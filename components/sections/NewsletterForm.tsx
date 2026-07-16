'use client';

import React from 'react';
import { MagneticButton } from './MagneticButton';

export function NewsletterForm(): React.JSX.Element {
  return (
    <form
      className='flex max-w-md flex-col gap-3 sm:flex-row'
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type='email'
        placeholder='your@email.com'
        className='font-mono-custom flex-1 rounded-full border border-[#111111]/10 bg-white/80 px-6 py-4 text-sm tracking-wide text-[#111111] placeholder-[#525252]/50 transition-colors focus:border-[#111111]/30 focus:outline-none'
      />
      <MagneticButton type='submit' className='group whitespace-nowrap'>
        Subscribe
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
    </form>
  );
}
