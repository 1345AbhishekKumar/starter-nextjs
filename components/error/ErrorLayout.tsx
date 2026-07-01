'use client';

import React from 'react';
import { MagneticButton } from '@/components/sections/MagneticButton';

interface ErrorLayoutProps {
  statusCode: string;
  title: string;
  description: string;
  illustration: React.ReactNode;
  actionButton?: React.ReactNode;
}

export function ErrorLayout({
  statusCode,
  title,
  description,
  illustration,
  actionButton,
}: ErrorLayoutProps) {
  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--bg-alabaster)] px-6 py-12 text-center'>
      {/* Paper Texture Overlay */}
      <div className='paper-texture'></div>

      <main className='relative z-10 flex w-full max-w-lg flex-col items-center'>
        {/* Illustration Container */}
        <div className='mb-8 flex items-center justify-center'>
          {illustration}
        </div>

        {/* Status Code / Label */}
        <span className='font-mono-custom mb-3 text-[11px] tracking-[0.25em] text-[var(--brand-green)] uppercase'>
          Error {statusCode}
        </span>

        {/* Title */}
        <h1
          className='font-handwritten mb-4 font-normal text-[var(--accent-black)]'
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>

        {/* Description */}
        <p className='font-mono-custom mb-8 px-4 text-[13px] leading-relaxed tracking-wider text-[var(--text-secondary)]'>
          {description}
        </p>

        {/* Actions */}
        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          {actionButton || (
            <MagneticButton href='/' className='group'>
              Back to Meadow
              <svg
                className='size-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1'
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
          )}
        </div>
      </main>
    </div>
  );
}
