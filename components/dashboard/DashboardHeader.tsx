'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { Settings } from 'lucide-react';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export function DashboardHeader() {
  const { signOut } = useAuth();

  return (
    <header className='mb-12 flex items-center justify-between'>
      <Link
        href='/'
        className='flex items-center gap-2 text-lg font-semibold tracking-tight text-[#111111]'
      >
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#111111'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
        </svg>
        <span className='font-mono-custom text-base tracking-[0.15em] uppercase'>
          Meadow
        </span>
      </Link>

      <div className='flex items-center gap-3'>
        <NotificationBell />
        <Link
          href='/settings'
          className='outline-btn font-mono-custom flex items-center gap-1.5 border-[#111111]/30 bg-transparent px-4 py-2.5 text-[10px] tracking-wider uppercase hover:border-[#111111]'
        >
          <Settings size={12} />
          Settings
        </Link>
        <button
          onClick={() => signOut()}
          className='outline-btn font-mono-custom border-[#111111]/30 bg-transparent px-5 py-2.5 text-[10px] tracking-wider uppercase hover:border-[#111111]'
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
