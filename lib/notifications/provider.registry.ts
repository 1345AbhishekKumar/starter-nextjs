import { type Notification, type NotificationChannel } from './types';
import { resend } from '@/lib/resend';
import { logger } from '@/lib/logger';
import { resolveTemplate } from './templates';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as React from 'react';

function GenericNotificationEmail({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return React.createElement(
    'div',
    {
      style: {
        fontFamily: 'sans-serif',
        padding: '24px',
        backgroundColor: '#f9f8f6',
        color: '#111111',
        borderRadius: '16px',
        border: '1px solid #E7EAF3',
        maxWidth: '600px',
        margin: '0 auto',
      },
    },
    React.createElement(
      'h2',
      { style: { color: '#6e9c4e', fontSize: '20px', marginBottom: '16px' } },
      title,
    ),
    React.createElement(
      'p',
      { style: { fontSize: '14px', lineHeight: '20px', color: '#525252' } },
      body,
    ),
    React.createElement('hr', {
      style: {
        border: 'none',
        borderTop: '1px solid #E7EAF3',
        margin: '24px 0',
      },
    }),
    React.createElement(
      'p',
      { style: { fontSize: '12px', color: '#99A1AF' } },
      'This is an automated notification. You can manage your preferences inside your Meadow settings.',
    ),
  );
}

class InAppProvider implements NotificationChannel {
  name = 'inApp';
  async send(
    notification: Notification,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    variables?: Record<string, string>,
  ): Promise<void> {
    logger.info(
      { notificationId: notification.id },
      'In-app notification sowed in DB.',
    );
    // Integrates with Real-time Socket.io once connected
  }
}

class EmailProvider implements NotificationChannel {
  name = 'email';
  async send(
    notification: Notification,
    variables?: Record<string, string>,
  ): Promise<void> {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, notification.userId),
      });

      if (!user?.email) {
        logger.warn(
          { userId: notification.userId },
          'Skipping email dispatch: user email not found.',
        );
        return;
      }

      const resolved = resolveTemplate(
        notification.templateId,
        variables || {},
      );

      const fromAddress = process.env.NEXT_PUBLIC_APP_NAME
        ? `${process.env.NEXT_PUBLIC_APP_NAME} <notifications@resend.dev>`
        : 'Meadow <notifications@resend.dev>';

      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: user.email,
        subject: resolved.title,
        react: React.createElement(GenericNotificationEmail, {
          title: resolved.title,
          body: resolved.body,
        }),
      });

      if (error) {
        logger.error(
          { error, notificationId: notification.id },
          'Failed to send notification email via Resend.',
        );
        throw new Error(error.message);
      }

      logger.info(
        { emailId: data?.id, notificationId: notification.id },
        'Notification email sent successfully.',
      );
    } catch (error) {
      logger.error(
        { error, notificationId: notification.id },
        'Unhandled exception in EmailProvider',
      );
      throw error;
    }
  }
}

class NotificationProviderRegistry {
  private static instance: NotificationProviderRegistry;
  private providers: Map<string, NotificationChannel> = new Map();

  private constructor() {
    this.registerProvider(new InAppProvider());
    this.registerProvider(new EmailProvider());
  }

  static getInstance(): NotificationProviderRegistry {
    if (!NotificationProviderRegistry.instance) {
      NotificationProviderRegistry.instance =
        new NotificationProviderRegistry();
    }
    return NotificationProviderRegistry.instance;
  }

  registerProvider(provider: NotificationChannel) {
    this.providers.set(provider.name, provider);
    logger.info(
      { name: provider.name },
      'Registered notification channel provider.',
    );
  }

  getProvider(name: string): NotificationChannel | undefined {
    return this.providers.get(name);
  }

  getAllProviders(): NotificationChannel[] {
    return Array.from(this.providers.values());
  }
}

export const providerRegistry = NotificationProviderRegistry.getInstance();
