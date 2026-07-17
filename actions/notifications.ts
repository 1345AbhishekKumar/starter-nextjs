'use server';

import { auth } from '@clerk/nextjs/server';
import { notificationRepository } from '@/lib/notifications/repository';
import { notificationService } from '@/lib/notifications/service';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

import { type Notification } from '@/lib/notifications/types';

export type ActionResponse<T = void> =
  { success: true; data?: T } | { success: false; error: string };

export async function getNotificationsAction(filters: {
  readStatus?: 'all' | 'unread' | 'read';
  archivedStatus?: 'active' | 'archived' | 'all';
  priority?: string;
  search?: string;
  limit?: number;
  offset?: number;
  cursor?: string;
  userId?: string;
}): Promise<
  ActionResponse<{ notifications: Notification[]; totalCount: number }>
> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const result = await notificationRepository.findMany({
      ...filters,
      userId,
    });

    return { success: true, data: result };
  } catch (error) {
    logger.error(
      { error, filters },
      'Failed to fetch notifications via server action',
    );
    Sentry.captureException(error);
    return { success: false, error: 'Failed to fetch notifications' };
  }
}

export async function getUnreadCountAction(): Promise<ActionResponse<number>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const count = await notificationRepository.countUnread(userId);
    return { success: true, data: count };
  } catch (error) {
    logger.error({ error }, 'Failed to get unread count via server action');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to retrieve unread count' };
  }
}

export async function markAsReadAction(ids: string[]): Promise<ActionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    if (!ids.length) {
      return { success: true };
    }

    await notificationRepository.markAsRead(ids, userId);
    revalidatePath('/dashboard/notifications');
    return { success: true };
  } catch (error) {
    logger.error({ error, ids }, 'Failed to mark notifications as read');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to update notifications' };
  }
}

export async function markAllAsReadAction(): Promise<ActionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await notificationRepository.markAllAsRead(userId);
    revalidatePath('/dashboard/notifications');
    return { success: true };
  } catch (error) {
    logger.error({ error }, 'Failed to mark all notifications as read');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to update all notifications' };
  }
}

export async function deleteNotificationAction(
  id: string,
): Promise<ActionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await notificationRepository.softDelete(id, userId);
    revalidatePath('/dashboard/notifications');
    return { success: true };
  } catch (error) {
    logger.error({ error, id }, 'Failed to delete notification');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to delete notification' };
  }
}

export async function archiveNotificationAction(
  id: string,
  archiveState: boolean,
): Promise<ActionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await notificationRepository.archive(id, userId, archiveState);
    revalidatePath('/dashboard/notifications');
    return { success: true };
  } catch (error) {
    logger.error(
      { error, id, archiveState },
      'Failed to archive/unarchive notification',
    );
    Sentry.captureException(error);
    return { success: false, error: 'Failed to update notification state' };
  }
}

export async function processScheduledNotificationsAction(): Promise<
  ActionResponse<number>
> {
  try {
    const count = await notificationService.processScheduledPending();
    return { success: true, data: count };
  } catch (error) {
    logger.error({ error }, 'Failed to process scheduled notifications');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to process scheduled items' };
  }
}
