import { z } from 'zod';
import { logger } from '@/lib/logger';
import { notificationRepository } from './repository';
import { providerRegistry } from './provider.registry';
import { resolveTemplate } from './templates';
import {
  type CreateNotificationInput,
  type Notification,
  type NotificationDelivery,
} from './types';

export const createNotificationSchema = z.object({
  userId: z.string().min(1),
  templateId: z.string().min(1),
  variables: z.record(z.string(), z.string()).default({}),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  delivery: z
    .object({
      inApp: z.boolean().default(true),
      email: z.boolean().default(false),
      push: z.boolean().default(false),
    })
    .default({ inApp: true, email: false, push: false }),
  deduplicationKey: z.string().optional(),
  expiresAt: z.coerce.date().optional(),
  deliverAt: z.coerce.date().optional(),
});

// A mock preference resolver. In a production system, this would query a user_preferences table
// or load preferences stored inside Clerk user metadata.
async function getUserPreferences(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userId: string,
): Promise<NotificationDelivery> {
  return {
    inApp: true,
    email: true, // Allow email notifications by default for testing
    push: false,
  };
}

export class NotificationService {
  /**
   * Main entrypoint to sow/create a notification.
   */
  async createNotification(
    rawInput: CreateNotificationInput,
  ): Promise<Notification> {
    try {
      const input = createNotificationSchema.parse(rawInput);
      logger.info(
        { userId: input.userId, templateId: input.templateId },
        'Processing createNotification request',
      );

      // 1. Deduplication / Aggregation Check
      // If a matching notification exists within the last 5 minutes and is unread, aggregate it.
      const timeWindow = 5 * 60 * 1000; // 5-minute aggregation window
      if (input.deduplicationKey) {
        const existing = await notificationRepository.findRecentMatch(
          input.userId,
          input.deduplicationKey,
          timeWindow,
        );

        if (existing) {
          logger.info(
            { existingId: existing.id },
            'Found duplicate notification. Aggregating values.',
          );
          const currentCount = Number(existing.variables.count || '1');
          const nextCount = String(currentCount + 1);

          // Update variables (e.g. increment count, combine actor names)
          const updatedVariables = {
            ...existing.variables,
            ...input.variables,
            count: nextCount,
          };

          const updated = await notificationRepository.update(
            existing.id,
            existing.userId,
            {
              variables: updatedVariables,
            },
          );

          if (updated) {
            // Retrieve compiled details for logging/dispatching
            const resolved = resolveTemplate(
              updated.templateId,
              updated.variables as Record<string, string>,
            );
            logger.info(
              { notificationId: updated.id, title: resolved.title },
              'Notification aggregated successfully',
            );

            // Dispatch websocket / real-time updates for the modified notification
            await this.dispatchChannels(
              updated,
              updated.variables as Record<string, string>,
            );
            return updated;
          }
        }
      }

      // 2. Save Notification to Database First
      const notification = await notificationRepository.create({
        id: crypto.randomUUID(),
        userId: input.userId,
        templateId: input.templateId,
        variables: input.variables,
        priority: input.priority,
        delivery: input.delivery,
        deduplicationKey: input.deduplicationKey || null,
        expiresAt: input.expiresAt || null,
        deliverAt: input.deliverAt || null,
      });

      logger.info(
        { notificationId: notification.id },
        'Notification sowed to database successfully',
      );

      // 3. Defer delivery if scheduled in the future
      if (input.deliverAt && input.deliverAt.getTime() > Date.now()) {
        logger.info(
          { notificationId: notification.id, deliverAt: input.deliverAt },
          'Notification delivery deferred to future date',
        );
        return notification;
      }

      // 4. Dispatch to dynamic channels immediately
      await this.dispatchChannels(notification, input.variables);

      return notification;
    } catch (error) {
      logger.error({ error, input: rawInput }, 'Failed to create notification');
      throw error;
    }
  }

  /**
   * Filters and dispatches notification to registered providers.
   */
  private async dispatchChannels(
    notification: Notification,
    variables: Record<string, string>,
  ): Promise<void> {
    const preferences = await getUserPreferences(notification.userId);
    const intendedChannels = notification.delivery;

    const channelsToDispatch = providerRegistry
      .getAllProviders()
      .filter((provider) => {
        const channelName = provider.name as keyof NotificationDelivery;

        // Send if: requested by delivery payload AND allowed by user preferences
        const isRequested = intendedChannels[channelName] ?? false;
        const isPreferred = preferences[channelName] ?? false;

        return isRequested && isPreferred;
      });

    if (channelsToDispatch.length === 0) {
      logger.info(
        { notificationId: notification.id },
        'No active channels passed filters. Skipping dispatch.',
      );
      return;
    }

    logger.info(
      {
        notificationId: notification.id,
        channels: channelsToDispatch.map((c) => c.name),
      },
      'Dispatching notification to channels',
    );

    // Call all channels concurrently and safely capture all failure responses
    const results = await Promise.allSettled(
      channelsToDispatch.map((channel) =>
        channel.send(notification, variables),
      ),
    );

    results.forEach((result, index) => {
      const channelName = channelsToDispatch[index].name;
      if (result.status === 'rejected') {
        logger.error(
          {
            error: result.reason,
            notificationId: notification.id,
            channel: channelName,
          },
          'Notification channel dispatch failed',
        );
      } else {
        logger.info(
          { notificationId: notification.id, channel: channelName },
          'Notification channel dispatch completed successfully',
        );
      }
    });
  }

  /**
   * Triggers scheduled pending notifications (to be called by cron jobs).
   */
  async processScheduledPending(): Promise<number> {
    try {
      const pending = await notificationRepository.findScheduledPending();
      if (pending.length === 0) return 0;

      logger.info(
        { count: pending.length },
        'Processing scheduled notifications',
      );

      const results = await Promise.allSettled(
        pending.map(async (notification) => {
          // Trigger dispatch
          await this.dispatchChannels(notification, notification.variables);
        }),
      );

      const processedCount = results.filter(
        (r) => r.status === 'fulfilled',
      ).length;
      logger.info(
        { processedCount },
        'Completed scheduled notifications processing',
      );
      return processedCount;
    } catch (error) {
      logger.error(
        { error },
        'Failed to process scheduled pending notifications',
      );
      throw error;
    }
  }
}

export const notificationService = new NotificationService();

// Decoupled API shorthand helper exported for feature actions to call
export async function createNotification(
  input: CreateNotificationInput,
): Promise<Notification> {
  return notificationService.createNotification(input);
}
