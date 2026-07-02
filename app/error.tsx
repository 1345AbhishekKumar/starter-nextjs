'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { ErrorLayout } from '@/components/error/ErrorLayout';
import { MagneticButton } from '@/components/sections/MagneticButton';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

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
      className='text-(--brand-green)'
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

  const actionButton = (
    <div className='flex gap-4'>
      <MagneticButton onClick={() => reset()} className='group'>
        Try Again
        <svg
          className='size-4 transition-transform duration-300 group-hover:rotate-180'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67' />
        </svg>
      </MagneticButton>
      <MagneticButton
        href='/'
        className='group font-mono-custom border-[1.5px] border-(--accent-black) bg-transparent! text-xs tracking-wider text-(--accent-black)! uppercase hover:bg-(--accent-black)! hover:text-white!'
      >
        Go Home
      </MagneticButton>
    </div>
  );

  return (
    <ErrorLayout
      statusCode='500'
      title='A sudden storm.'
      description='Something went wrong on our end. The shepherd has been notified and is on the way to mend the fence. Please try again or head back.'
      illustration={StormIcon}
      actionButton={actionButton}
    />
  );
}
