'use client';

import React from 'react';
import { ErrorLayout } from '@/components/error/ErrorLayout';

export default function BadRequestPage() {
  const CompassIcon = (
    <svg
      width='120'
      height='120'
      viewBox='0 0 24 24'
      fill='none'
      stroke='var(--brand-green)'
      strokeWidth='1.2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='animate-spin text-[var(--brand-green)]'
      style={{ animationDuration: '20s' }}
    >
      <circle cx='12' cy='12' r='10' strokeDasharray='3 3' />
      <circle cx='12' cy='12' r='8' />
      <path d='M12 4V7' stroke='var(--accent-black)' strokeWidth='1.5' />
      <path d='M12 17V20' />
      <path d='M4 12H7' />
      <path d='M17 12H20' />
      <polygon
        points='12,8 14,13 12,12'
        fill='var(--brand-green)'
        stroke='var(--brand-green)'
      />
      <polygon
        points='12,16 10,11 12,12'
        fill='var(--accent-black)'
        stroke='var(--accent-black)'
      />
      <circle cx='12' cy='12' r='1' fill='var(--accent-black)' />
    </svg>
  );

  return (
    <ErrorLayout
      statusCode='400'
      title='The meadow wind blew us off course.'
      description='The request could not be understood by the server. Double check the URL, clear your cookies, or try going back to the home pasture.'
      illustration={CompassIcon}
    />
  );
}
