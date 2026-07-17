import { type NotificationType } from './types';

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  actionUrl?: string;
}

export const TEMPLATE_REGISTRY: Record<string, NotificationTemplate> = {
  'task.created': {
    id: 'task.created',
    type: 'success',
    title: 'New Task Created',
    body: 'Task "{{taskTitle}}" has been sowed successfully by {{creatorName}}.',
    icon: 'PlusCircle',
    actionUrl: '/dashboard',
  },
  'task.assigned': {
    id: 'task.assigned',
    type: 'info',
    title: 'Task Assigned to You',
    body: 'You have been assigned to "{{taskTitle}}" by {{assignerName}}.',
    icon: 'UserCheck',
    actionUrl: '/dashboard',
  },
  'project.updated': {
    id: 'project.updated',
    type: 'warning',
    title: 'Project Updated',
    body: 'Project "{{projectName}}" was modified: {{changeDetails}}.',
    icon: 'FolderSync',
    actionUrl: '/dashboard',
  },
  'invoice.paid': {
    id: 'invoice.paid',
    type: 'success',
    title: 'Invoice Paid',
    body: 'Your invoice for {{amount}} has been processed successfully.',
    icon: 'CreditCard',
    actionUrl: '/pricing',
  },
  'user.joined': {
    id: 'user.joined',
    type: 'system',
    title: 'New Creator Joined',
    body: 'Welcome {{userName}} to the meadow stream!',
    icon: 'UserPlus',
    actionUrl: '/dashboard',
  },
};

export function resolveTemplate(
  templateId: string,
  variables: Record<string, string>,
): {
  title: string;
  body: string;
  type: NotificationType;
  icon?: string;
  actionUrl?: string;
} {
  const template = TEMPLATE_REGISTRY[templateId];
  if (!template) {
    return {
      title: variables.title || 'System Notification',
      body: variables.body || 'You have a new message.',
      type: 'info',
      icon: 'Bell',
      actionUrl: variables.actionUrl,
    };
  }

  const interpolate = (text: string) => {
    return text.replace(
      /\{\{\s*(\w+)\s*\}\}/g,
      (_, key) => variables[key] || '',
    );
  };

  return {
    title: interpolate(template.title),
    body: interpolate(template.body),
    type: template.type,
    icon: template.icon,
    actionUrl: template.actionUrl ? interpolate(template.actionUrl) : undefined,
  };
}
