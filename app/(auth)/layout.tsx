'use client';

import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center px-4 py-12 md:px-6'>
      {/* Paper texture overlay */}
      <div className='paper-texture'></div>

      <div className='relative z-10 flex w-full max-w-105 flex-col items-center'>
        {/* Logo / Back link */}
        <Link
          href='/'
          className='mb-8 flex items-center gap-2 text-xl font-semibold tracking-tight text-[#111111] transition-transform hover:scale-102'
        >
          <svg
            width='22'
            height='22'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#111111'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
          </svg>
          <span className='font-mono-custom text-lg tracking-[0.15em] uppercase'>
            Meadow
          </span>
        </Link>

        {/* Content card */}
        <div className='bento-cell w-full px-6 py-10 md:p-8'>{children}</div>
      </div>

      {/* Required for custom sign-up flows with Clerk, placed in the layout to ensure it's always present and stable during transitions */}
      <div id='clerk-captcha' />
    </div>
  );
}
