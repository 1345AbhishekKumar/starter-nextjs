'use client';

import React from 'react';
import { ErrorLayout } from '@/components/error/ErrorLayout';

export default function ForbiddenPage() {
  const FenceIcon = (
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
      {/* Wooden fence pickets */}
      <path
        d='M4 6L6 4L8 6V18H4V6Z'
        fill='var(--bg-alabaster)'
        stroke='var(--brand-green)'
        strokeWidth='1.2'
      />
      <path
        d='M10 6L12 4L14 6V18H10V6Z'
        fill='var(--bg-alabaster)'
        stroke='var(--brand-green)'
        strokeWidth='1.2'
      />
      <path
        d='M16 6L18 4L20 6V18H16V6Z'
        fill='var(--bg-alabaster)'
        stroke='var(--brand-green)'
        strokeWidth='1.2'
      />
      {/* Crossbeams */}
      <path d='M2 8H22' stroke='var(--accent-black)' strokeWidth='1.5' />
      <path d='M2 14H22' stroke='var(--accent-black)' strokeWidth='1.5' />
    </svg>
  );

  return (
    <ErrorLayout
      statusCode='403'
      title='No grazing allowed here.'
      description='You do not have permission to access this pasture. If you believe you should be allowed here, please speak with the shepherd.'
      illustration={FenceIcon}
    />
  );
}
