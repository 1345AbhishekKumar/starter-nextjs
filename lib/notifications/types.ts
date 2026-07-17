import { type notifications } from '@/db/schema';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export type NotificationType =
  'info' | 'success' | 'warning' | 'error' | 'system';

export interface NotificationDelivery {
  inApp: boolean;
  email: boolean;
  push: boolean;
}

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

export interface NotificationChannel {
  name: string;
  send(
    notification: Notification,
    variables?: Record<string, string>,
  ): Promise<void>;
}

export interface CreateNotificationInput {
  userId: string;
  templateId: string;
  variables: Record<string, string>;
  priority?: NotificationPriority;
  delivery?: Partial<NotificationDelivery>;
  deduplicationKey?: string;
  expiresAt?: Date;
  deliverAt?: Date;
}
