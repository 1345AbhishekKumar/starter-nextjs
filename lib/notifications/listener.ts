import { eventBus } from '@/lib/events';
import { createNotification } from './service';
import { logger } from '@/lib/logger';

let isInitialized = false;

export function initializeNotificationListeners() {
  if (isInitialized) {
    logger.info('Notification listeners already initialized. Skipping.');
    return;
  }

  logger.info('Initializing Event-Driven Notification Listeners...');

  eventBus.on('task.created', async (payload) => {
    try {
      await createNotification({
        userId: payload.assigneeId || payload.userId,
        templateId: 'task.created',
        variables: {
          taskTitle: payload.title,
          creatorName: 'Someone',
        },
        priority: 'normal',
        delivery: { inApp: true, email: true },
        deduplicationKey: `task-created-${payload.taskId}`,
      });
    } catch (error) {
      logger.error(
        { error, payload },
        'Listener failed to process task.created event',
      );
    }
  });

  eventBus.on('task.assigned', async (payload) => {
    try {
      await createNotification({
        userId: payload.assigneeId,
        templateId: 'task.assigned',
        variables: {
          taskTitle: payload.title,
          assignerName: 'Someone',
        },
        priority: 'high',
        delivery: { inApp: true, email: true },
        deduplicationKey: `task-assigned-${payload.taskId}`,
      });
    } catch (error) {
      logger.error(
        { error, payload },
        'Listener failed to process task.assigned event',
      );
    }
  });

  eventBus.on('project.updated', async (payload) => {
    try {
      await createNotification({
        userId: payload.userId,
        templateId: 'project.updated',
        variables: {
          projectName: payload.title,
          changeDetails: payload.changeDetails,
        },
        priority: 'normal',
        delivery: { inApp: true, email: false },
        deduplicationKey: `project-updated-${payload.projectId}`,
      });
    } catch (error) {
      logger.error(
        { error, payload },
        'Listener failed to process project.updated event',
      );
    }
  });

  eventBus.on('invoice.paid', async (payload) => {
    try {
      await createNotification({
        userId: payload.userId,
        templateId: 'invoice.paid',
        variables: {
          amount: payload.amount,
        },
        priority: 'urgent',
        delivery: { inApp: true, email: true },
        deduplicationKey: `invoice-paid-${payload.invoiceId}`,
      });
    } catch (error) {
      logger.error(
        { error, payload },
        'Listener failed to process invoice.paid event',
      );
    }
  });

  eventBus.on('user.joined', async (payload) => {
    try {
      await createNotification({
        userId: payload.userId,
        templateId: 'user.joined',
        variables: {
          userName: payload.name,
        },
        priority: 'low',
        delivery: { inApp: true, email: false },
        deduplicationKey: `user-joined-${payload.userId}`,
      });
    } catch (error) {
      logger.error(
        { error, payload },
        'Listener failed to process user.joined event',
      );
    }
  });

  isInitialized = true;
  logger.info('Notification listeners initialized successfully.');
}
