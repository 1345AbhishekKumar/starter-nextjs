'use client';

import React from 'react';
import Link from 'next/link';
import {
  useNotificationsQuery,
  useMarkAllAsReadMutation,
} from '@/hooks/use-notifications';
import { NotificationItem } from './NotificationItem';
import { EmptyState } from './EmptyState';
import { LoadingListSkeleton } from './LoadingState';
import { Check, ArrowRight } from 'lucide-react';

import { type Notification } from '@/lib/notifications/types';

interface NotificationDropdownProps {
  onClose?: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { data, isLoading } = useNotificationsQuery({
    readStatus: 'all',
    archivedStatus: 'active',
    limit: 5,
  });

  const markAllAsRead = useMarkAllAsReadMutation();

  const notifications =
    data?.pages.flatMap(
      (page) =>
        (page as { notifications?: Notification[] })?.notifications || [],
    ) || [];
  const latestNotifications = notifications.slice(0, 5);
  const unreadCount = latestNotifications.filter((n) => !n.readAt).length;

  return (
    <div
      className='w-[360px] overflow-hidden rounded-2xl border border-[#111111]/10 bg-white/90 p-4 shadow-xl backdrop-blur-md transition-all duration-300'
      style={{ zIndex: 100 }}
    >
      {/* Header */}
      <div className='mb-3 flex items-center justify-between border-b border-[#111111]/5 pb-2.5'>
        <div>
          <h3 className='font-mono-custom text-xs font-bold tracking-wider text-[#111111] uppercase'>
            Meadow Alerts
          </h3>
          {unreadCount > 0 && (
            <p className='font-mono-custom mt-0.5 text-[9px] tracking-wider text-[#6e9c4e] uppercase'>
              {unreadCount} Sowed Unread
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
            className='font-mono-custom flex items-center gap-1 text-[9px] font-bold tracking-wider text-[#6e9c4e] uppercase hover:text-[#58813e]'
          >
            <Check size={10} />
            Mark All
          </button>
        )}
      </div>

      {/* List content */}
      <div className='max-h-[300px] scrollbar-thin space-y-2.5 overflow-y-auto pr-1'>
        {isLoading ? (
          <LoadingListSkeleton count={3} />
        ) : latestNotifications.length === 0 ? (
          <EmptyState />
        ) : (
          latestNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={{
                id: notification.id,
                templateId: notification.templateId,
                variables: notification.variables as Record<string, string>,
                priority: notification.priority,
                readAt: notification.readAt
                  ? String(notification.readAt)
                  : null,
                createdAt: String(notification.createdAt),
                actionUrl:
                  (notification as { actionUrl?: string | null }).actionUrl ||
                  null,
              }}
              onItemClick={onClose}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className='mt-3 flex justify-center border-t border-[#111111]/5 pt-2'>
        <Link
          href='/dashboard/notifications'
          onClick={onClose}
          className='outline-btn font-mono-custom flex w-full items-center justify-center gap-1.5 border-[#111111]/20 bg-transparent py-2 text-[9px] tracking-widest uppercase hover:border-[#111111] hover:bg-[#111111]/5'
        >
          View All Stream
          <ArrowRight size={10} />
        </Link>
      </div>
    </div>
  );
}
