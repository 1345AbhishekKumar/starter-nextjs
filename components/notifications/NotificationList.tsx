'use client';

import React from 'react';
import { useNotificationsQuery } from '@/hooks/use-notifications';
import { NotificationItem } from './NotificationItem';
import { EmptyState } from './EmptyState';
import { LoadingListSkeleton } from './LoadingState';
import { type NotificationFilters } from '@/hooks/use-notifications';
import { type Notification } from '@/lib/notifications/types';

interface NotificationListProps {
  filters?: NotificationFilters;
}

export function NotificationList({ filters }: NotificationListProps) {
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
  } = useNotificationsQuery(filters);

  const notifications =
    data?.pages.flatMap(
      (page) =>
        (page as { notifications?: Notification[] })?.notifications || [],
    ) || [];

  if (isLoading) {
    return <LoadingListSkeleton count={4} />;
  }

  if (isError) {
    return (
      <div className='font-mono-custom rounded-xl border border-red-500/10 bg-red-500/5 p-4 text-center text-xs tracking-wider text-red-600 uppercase'>
        Failed to harvest notifications.
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className='rounded-2xl border border-[#111111]/5 bg-white/30 p-8 shadow-sm backdrop-blur-sm'>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Items list */}
      <div className='space-y-3'>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={{
              id: notification.id,
              templateId: notification.templateId,
              variables: notification.variables as Record<string, string>,
              priority: notification.priority,
              readAt: notification.readAt ? String(notification.readAt) : null,
              createdAt: String(notification.createdAt),
              actionUrl:
                (notification as { actionUrl?: string | null }).actionUrl ||
                null,
            }}
          />
        ))}
      </div>

      {/* Pagination load action */}
      {hasNextPage && (
        <div className='mt-6 flex justify-center'>
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className='outline-btn font-mono-custom border-[#111111]/20 bg-transparent px-6 py-2.5 text-[9px] tracking-widest uppercase hover:border-[#111111] hover:bg-[#111111]/5 disabled:opacity-50'
          >
            {isFetchingNextPage ? 'Harvesting...' : 'Load More Alerts'}
          </button>
        </div>
      )}
    </div>
  );
}
