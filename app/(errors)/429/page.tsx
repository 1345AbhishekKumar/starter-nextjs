'use client';

import React from 'react';
import { ErrorLayout } from '@/components/error/ErrorLayout';

export default function TooManyRequestsPage() {
  const SnailIcon = (
    <svg
      width='120'
      height='120'
      viewBox='0 0 24 24'
      fill='none'
      stroke='var(--brand-green)'
      strokeWidth='1.2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='text-[var(--brand-green)]'
    >
      {/* Leaf above */}
      <path
        d='M4 3C8 3 14 5 18 10C19 11.5 17.5 13 16 12C13 10 9 8 4 8C3.5 8 3.5 3 4 3Z'
        fill='var(--brand-green)'
        fillOpacity='0.1'
        stroke='var(--brand-green)'
        strokeWidth='1.2'
      />
      {/* Snail shell (spiral) */}
      <path
        d='M12 20C9.79 20 8 18.21 8 16C8 13.79 9.79 12 12 12C14.21 12 16 13.79 16 16C16 18.21 14.21 20 12 20Z'
        stroke='var(--accent-black)'
        strokeWidth='1.5'
      />
      <path
        d='M12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14C13.1 14 14 14.9 14 16'
        stroke='var(--accent-black)'
        strokeWidth='1.5'
      />
      {/* Snail body */}
      <path
        d='M5 20C7 19.5 8 19 10 19H17C18.5 19 19.5 19.5 20 20'
        stroke='var(--accent-black)'
        strokeWidth='1.5'
      />
      {/* Snail feelers */}
      <path
        d='M18 19L19.5 16.5'
        stroke='var(--accent-black)'
        strokeWidth='1.2'
      />
      <path d='M17 19L18 16' stroke='var(--accent-black)' strokeWidth='1.2' />
    </svg>
  );

  return (
    <ErrorLayout
      statusCode='429'
      title='Slow down, take a breath.'
      description="You've been moving a bit too quickly through the meadow. Let the grass grow for a moment before refreshing."
      illustration={SnailIcon}
    />
  );
}
