'use client';

import React from 'react';
import { ErrorLayout } from '@/components/error/ErrorLayout';

export default function OfflinePage() {
  const OfflineIcon = (
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
      {/* Wave lines for wireless signal, fading out/slashed */}
      <path
        d='M5 18a8.5 8.5 0 0 1 0-12'
        stroke='var(--text-secondary)'
        strokeDasharray='2 2'
      />
      <path d='M8 15a4.5 4.5 0 0 1 0-6' />
      <path
        d='M11 12a1 1 0 0 1 0 0'
        stroke='var(--accent-black)'
        strokeWidth='2'
      />

      {/* Disconnection slash */}
      <line
        x1='3'
        y1='21'
        x2='21'
        y2='3'
        stroke='var(--accent-black)'
        strokeWidth='1.5'
      />

      {/* Small bird sitting safely on the corner */}
      <path
        d='M17 14c-1 0-1.5-.5-1.8-1-.5.5-1.2.8-2 .8-.7 0-1.2-.5-1.2-1.2 0-.8.8-1.5 1.8-1.5.5 0 .8.2 1 .3V11c0-.5-.3-.8-.8-.8-.3 0-.6.1-.8.3L13 9.5c.3-.5.9-.8 1.8-.8 1.4 0 2 .8 2 2V14z'
        fill='var(--brand-green)'
        fillOpacity='0.2'
        stroke='var(--brand-green)'
        strokeWidth='1.2'
      />
    </svg>
  );

  return (
    <ErrorLayout
      statusCode='Offline'
      title='Lost connection.'
      description="It looks like you've wandered out of range of our meadow servers. Check your internet connection or try moving closer to the router."
      illustration={OfflineIcon}
    />
  );
}
