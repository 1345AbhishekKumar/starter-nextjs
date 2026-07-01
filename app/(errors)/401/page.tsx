'use client';

import React from 'react';
import { ErrorLayout } from '@/components/error/ErrorLayout';
import { MagneticButton } from '@/components/sections/MagneticButton';

export default function UnauthorizedPage() {
  const LockGateIcon = (
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
      {/* Gate posts */}
      <path d='M4 20V4' stroke='var(--accent-black)' strokeWidth='1.5' />
      <path d='M20 20V4' stroke='var(--accent-black)' strokeWidth='1.5' />
      {/* Gate rails */}
      <path d='M4 7H20' />
      <path d='M4 12H20' stroke='var(--brand-green)' />
      <path d='M4 17H20' />
      {/* Vertical pickets */}
      <path d='M8 7V17' />
      <path d='M12 7V17' />
      <path d='M16 7V17' />
      {/* Padlock */}
      <rect
        x='9.5'
        y='11.5'
        width='5'
        height='4'
        rx='1'
        fill='var(--bg-alabaster)'
        stroke='var(--brand-green)'
        strokeWidth='1.2'
      />
      <path
        d='M10.5 11.5V9.5A1.5 1.5 0 0 1 12 8A1.5 1.5 0 0 1 13.5 9.5V11.5'
        stroke='var(--brand-green)'
        strokeWidth='1.2'
      />
    </svg>
  );

  const actionButton = (
    <div className='flex gap-4'>
      <MagneticButton href='/sign-in' className='group'>
        Sign In
        <svg
          className='size-4 transition-transform duration-300 group-hover:translate-x-1'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <line x1='5' y1='12' x2='19' y2='12'></line>
          <polyline points='12 5 19 12 12 19'></polyline>
        </svg>
      </MagneticButton>
      <MagneticButton
        href='/'
        className='group font-mono-custom border-[1.5px] border-[var(--accent-black)] !bg-transparent text-xs tracking-wider !text-[var(--accent-black)] uppercase hover:!bg-[var(--accent-black)] hover:!text-white'
      >
        Go Home
      </MagneticButton>
    </div>
  );

  return (
    <ErrorLayout
      statusCode='401'
      title='This pasture is private.'
      description='You need to be logged in to view these rolling fields. Please sign in or join our community flock to gain access.'
      illustration={LockGateIcon}
      actionButton={actionButton}
    />
  );
}
