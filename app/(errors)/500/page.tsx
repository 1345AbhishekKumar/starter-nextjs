'use client';

import React from 'react';
import { ErrorLayout } from '@/components/error/ErrorLayout';

export default function InternalServerErrorPage() {
  const StormIcon = (
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
        d='M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 8.58'
        stroke='var(--text-secondary)'
        strokeWidth='1.2'
      />
      {/* Lightning bolt */}
      <path
        d='M13 11L9 17H12L11 22L15 16H12L13 11Z'
        fill='var(--brand-green)'
        fillOpacity='0.2'
        stroke='var(--brand-green)'
        strokeWidth='1'
      />
    </svg>
  );

  return (
    <ErrorLayout
      statusCode='500'
      title='A sudden storm.'
      description='Something went wrong on our end. The shepherd has been notified and is on the way to mend the fence. Please try again later.'
      illustration={StormIcon}
    />
  );
}
