'use client';

import React from 'react';
import { useUnreadCountQuery } from '@/hooks/use-notifications';

export function NotificationBadge() {
  const { data: countResponse } = useUnreadCountQuery();
  const count = countResponse ?? 0;

  if (count === 0) return null;

  return (
    <span className='font-mono-custom absolute -top-1 -right-1 flex size-4 animate-pulse items-center justify-center rounded-full bg-[#6e9c4e] text-[8px] font-bold text-white'>
      {count > 99 ? '99+' : count}
    </span>
  );
}
