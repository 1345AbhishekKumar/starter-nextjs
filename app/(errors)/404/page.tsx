'use client';

import React from 'react';
import { ErrorLayout } from '@/components/error/ErrorLayout';

export default function NotFoundPage() {
  const TreeHillIcon = (
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
      {/* Cloud */}
      <path
        d='M17.5 12.5a3.5 3.5 0 0 0 .5-6.96 4 4 0 0 0-7.85-.29 3 3 0 0 0-4.65 4A3.5 3.5 0 0 0 6 16'
        stroke='var(--text-secondary)'
        strokeDasharray='2 2'
      />
      {/* Ground / Hill */}
      <path
        d='M2 20C6 18 12 18 22 20'
        stroke='var(--accent-black)'
        strokeWidth='1.5'
      />
      {/* Tree Trunk */}
      <path d='M12 18V13' stroke='var(--accent-black)' strokeWidth='1.5' />
      {/* Tree Leaves */}
      <path
        d='M12 13C10 13 9 11.5 9 10C9 8.5 10 7.5 12 7.5C14 7.5 15 8.5 15 10C15 11.5 14 13 12 13Z'
        fill='var(--brand-green)'
        fillOpacity='0.1'
        stroke='var(--brand-green)'
        strokeWidth='1.2'
      />
      {/* Floating leaf */}
      <path
        d='M16 12C16.5 11.5 17 12 17 12.5C16.5 12.5 16 12.5 16 12Z'
        stroke='var(--brand-green)'
        fill='var(--brand-green)'
      />
    </svg>
  );

  return (
    <ErrorLayout
      statusCode='404'
      title='Lost in the meadows...'
      description="The page you are looking for has wandered away from the flock. Let's guide you back to the home pasture."
      illustration={TreeHillIcon}
    />
  );
}
