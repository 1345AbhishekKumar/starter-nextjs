'use client';

import React from 'react';
import { ErrorLayout } from '@/components/error/ErrorLayout';

export default function MaintenancePage() {
  const SproutIcon = (
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
      {/* Ground */}
      <path d='M2 20H22' stroke='var(--accent-black)' strokeWidth='1.5' />
      {/* Sprout stem */}
      <path
        d='M12 20C12 15 10 12 10 8'
        stroke='var(--brand-green)'
        strokeWidth='1.5'
      />
      <path
        d='M12 20C12 16 14 13 15 11'
        stroke='var(--brand-green)'
        strokeWidth='1.2'
      />
      {/* Leaves */}
      <path
        d='M10 8C8 8 6 9 6 11C6 13 8 13 10 13V8Z'
        fill='var(--brand-green)'
        fillOpacity='0.2'
        stroke='var(--brand-green)'
        strokeWidth='1.2'
      />
      <path
        d='M15 11C17 11 18 10 18 8C18 6 16 6 15 8V11Z'
        fill='var(--brand-green)'
        fillOpacity='0.2'
        stroke='var(--brand-green)'
        strokeWidth='1.2'
      />
      {/* Sun outline */}
      <circle
        cx='18'
        cy='4'
        r='2'
        stroke='var(--text-secondary)'
        strokeDasharray='2 2'
      />
    </svg>
  );

  return (
    <ErrorLayout
      statusCode='503'
      title='Tending to the fields.'
      description="We're currently planting new seeds, weeding the borders, and refreshing the meadow. We will be back shortly with a greener pasture."
      illustration={SproutIcon}
    />
  );
}
