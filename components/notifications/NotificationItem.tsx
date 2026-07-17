'use client';

import React from 'react';
import {
  Check,
  Trash2,
  PlusCircle,
  UserCheck,
  FolderSync,
  CreditCard,
  UserPlus,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Bell,
} from 'lucide-react';
import { resolveTemplate } from '@/lib/notifications/templates';
import {
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
} from '@/hooks/use-notifications';

interface NotificationItemProps {
  notification: {
    id: string;
    templateId: string;
    variables: Record<string, string>;
    priority: string;
    readAt: string | null;
    createdAt: string;
    actionUrl: string | null;
  };
  onItemClick?: () => void;
}

const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  PlusCircle,
  UserCheck,
  FolderSync,
  CreditCard,
  UserPlus,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Bell,
};

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffMins < 1) return 'JUST NOW';
  if (diffMins < 60) return `${diffMins}M AGO`;
  if (diffHours < 24) return `${diffHours}H AGO`;
  return `${diffDays}D AGO`;
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'low':
      return 'border-[#111111]/10 text-[#525252]/80 bg-[#111111]/5';
    case 'high':
      return 'border-blue-500/20 text-blue-600 bg-blue-500/5';
    case 'urgent':
      return 'border-[#FF8904]/20 text-[#FF8904] bg-[#FF8904]/5';
    case 'normal':
    default:
      return 'border-[#6e9c4e]/20 text-[#6e9c4e] bg-[#6e9c4e]/5';
  }
}

export function NotificationItem({
  notification,
  onItemClick,
}: NotificationItemProps) {
  const markAsRead = useMarkAsReadMutation();
  const deleteNotification = useDeleteNotificationMutation();

  const resolved = resolveTemplate(
    notification.templateId,
    notification.variables,
  );
  const IconComponent = iconMap[resolved.icon || 'Bell'] || Bell;
  const isRead = !!notification.readAt;

  const handleItemClick = async (e: React.MouseEvent) => {
    // If user clicked check or delete buttons, ignore main redirect
    if ((e.target as HTMLElement).closest('.action-button')) {
      return;
    }

    if (!isRead) {
      await markAsRead.mutateAsync([notification.id]);
    }

    if (onItemClick) {
      onItemClick();
    }

    if (resolved.actionUrl || notification.actionUrl) {
      window.location.href =
        resolved.actionUrl || notification.actionUrl || '#';
    }
  };

  return (
    <div
      onClick={handleItemClick}
      className={`group relative flex items-start gap-4 rounded-xl border p-4 transition-all duration-300 ${
        isRead
          ? 'border-[#111111]/5 bg-white/40 opacity-75'
          : 'border-[#111111]/10 bg-white shadow-sm hover:border-[#111111]/25 hover:shadow-md'
      } cursor-pointer`}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      {/* Icon frame */}
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${
          isRead
            ? 'border-[#111111]/10 bg-[#111111]/5 text-[#525252]/60'
            : 'border-[#6e9c4e]/20 bg-[#6e9c4e]/10 text-[#6e9c4e]'
        }`}
      >
        <IconComponent size={14} />
      </div>

      {/* Content */}
      <div className='flex flex-1 flex-col gap-1 pr-12'>
        <div className='flex items-center gap-2'>
          <span
            className={`font-mono-custom rounded-full border px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase ${getPriorityColor(
              notification.priority,
            )}`}
          >
            {notification.priority}
          </span>
          <span className='font-mono-custom text-[9px] tracking-wider text-[#525252]/80 uppercase'>
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>
        <h4
          className={`text-xs font-semibold ${isRead ? 'text-[#525252]' : 'text-[#111111]'}`}
        >
          {resolved.title}
        </h4>
        <p className='text-[11px] leading-relaxed text-[#525252]/90'>
          {resolved.body}
        </p>
      </div>

      {/* Action buttons (absolute positioning for visual polish) */}
      <div className='absolute top-3 right-3 hidden items-center gap-1.5 group-hover:flex'>
        {!isRead && (
          <button
            onClick={() => markAsRead.mutate([notification.id])}
            disabled={markAsRead.isPending}
            title='Mark as read'
            /* eslint-disable-next-line tailwindcss/no-custom-classname */
            className='action-button flex size-6 items-center justify-center rounded-full border border-[#111111]/15 bg-white text-[#6e9c4e] transition-all hover:border-[#6e9c4e] hover:bg-[#6e9c4e]/10'
          >
            <Check size={10} />
          </button>
        )}
        <button
          onClick={() => deleteNotification.mutate(notification.id)}
          disabled={deleteNotification.isPending}
          title='Delete notification'
          /* eslint-disable-next-line tailwindcss/no-custom-classname */
          className='action-button flex size-6 items-center justify-center rounded-full border border-[#111111]/15 bg-white text-red-500 transition-all hover:border-red-500 hover:bg-red-500/10'
        >
          <Trash2 size={10} />
        </button>
      </div>
    </div>
  );
}
