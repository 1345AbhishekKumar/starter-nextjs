'use client';

import React from 'react';

export function LoadingItemSkeleton() {
  return (
    <div className='flex animate-pulse items-start gap-4 rounded-xl border border-[#111111]/5 bg-white/40 p-4'>
      {/* Icon skeleton */}
      <div className='size-8 shrink-0 rounded-full bg-[#111111]/5' />

      {/* Lines skeletons */}
      <div className='flex flex-1 flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <div className='h-3.5 w-12 rounded-full bg-[#111111]/5' />
          <div className='h-3 w-16 rounded bg-[#111111]/5' />
        </div>
        <div className='h-4 w-3/4 rounded bg-[#111111]/10' />
        <div className='h-3 w-5/6 rounded bg-[#111111]/5' />
      </div>
    </div>
  );
}

export function LoadingListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className='space-y-3'>
      {Array.from({ length: count }).map((_, i) => (
        <LoadingItemSkeleton key={i} />
      ))}
    </div>
  );
}
