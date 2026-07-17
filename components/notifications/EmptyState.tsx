'use client';

import React from 'react';
import { BellOff } from 'lucide-react';

export function EmptyState() {
  return (
    <div className='flex flex-col items-center justify-center px-4 py-12 text-center'>
      <div className='mb-4 flex size-10 items-center justify-center rounded-full bg-[#6e9c4e]/10 text-[#6e9c4e]'>
        <BellOff size={16} />
      </div>
      <p className='font-mono-custom mb-1 text-[9px] tracking-widest text-[#525252] uppercase'>
        All Clear
      </p>
      <h3 className='mb-1 text-sm font-semibold text-[#111111]'>
        No Notifications Sowed
      </h3>
      <p className='max-w-[240px] text-[11px] leading-relaxed text-[#525252]/80'>
        Your notification meadow is completely quiet. Check back later for sowed
        updates.
      </p>
    </div>
  );
}
