'use client';

import React from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileUploader } from '@/components/uploader/FileUploader';
import { FileGrid } from '@/components/uploader/FileGrid';
import { CloudUpload } from 'lucide-react';

export default function UploadsPage() {
  const { isLoaded, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className='relative flex min-h-screen flex-col items-center justify-center bg-[#f9f8f6] px-6'>
        <div className='paper-texture'></div>
        <div className='mb-4 size-8 animate-spin rounded-full border-2 border-[#6e9c4e] border-t-transparent'></div>
        <p className='font-mono-custom text-xs tracking-widest text-[#525252] uppercase'>
          Entering the meadow...
        </p>
      </div>
    );
  }

  // Fallback if client-side check happens before redirects
  if (!isSignedIn) {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className='relative flex min-h-screen flex-col bg-[#f9f8f6] px-6 py-12 md:py-20'>
      {/* Paper texture overlay */}
      <div className='paper-texture'></div>

      <div className='relative z-10 mx-auto w-full max-w-[1000px]'>
        {/* Header navigation bar inside page */}
        <header className='mb-12 flex items-center justify-between'>
          <Link
            href='/dashboard'
            className='flex items-center gap-2 text-lg font-semibold tracking-tight text-[#111111]'
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='#111111'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
            </svg>
            <span className='font-mono-custom text-base tracking-[0.15em] uppercase'>
              Meadow
            </span>
          </Link>

          <button
            onClick={() => signOut()}
            className='outline-btn font-mono-custom border-[#111111]/30 bg-transparent px-5 py-2.5 text-[10px] tracking-wider uppercase hover:border-[#111111]'
          >
            Sign Out
          </button>
        </header>

        {/* Title Section */}
        <div className='mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end'>
          <div>
            <p className='font-mono-custom mb-2 text-[11px] tracking-[0.2em] text-[#6e9c4e] uppercase'>
              Media Optimization
            </p>
            <h1 className='font-handwritten text-5xl font-normal text-[#111111] md:text-6xl'>
              Uploadcare Gallery
            </h1>
            <p className='font-mono-custom mt-4 max-w-xl text-[13px] leading-relaxed tracking-wider text-[#525252]'>
              Upload files directly to the Uploadcare CDN. Sync file metadata
              with your Neon PostgreSQL database, and preview optimized versions
              with on-the-fly transformations.
            </p>
          </div>
          <Link href='/dashboard'>
            <button className='outline-btn font-mono-custom border-[#111111]/30 bg-transparent px-5 py-2.5 text-[10px] tracking-wider uppercase hover:border-[#111111]'>
              Back to Dashboard
            </button>
          </Link>
        </div>

        {/* Uploader Section */}
        <div className='bento-cell mb-10 p-8'>
          <div className='mb-6 flex items-center gap-2'>
            <CloudUpload className='size-5 text-[var(--brand-green)]' />
            <h3 className='text-base font-semibold text-[#111111]'>
              Upload New Media
            </h3>
          </div>
          <FileUploader />
        </div>

        {/* Synced Gallery Section */}
        <div className='space-y-6'>
          <div className='flex items-center justify-between border-b border-[#111111]/5 pb-4'>
            <h3 className='text-lg font-semibold text-[#111111]'>
              Your Synced Files
            </h3>
            <p className='font-mono-custom text-[10px] tracking-wider text-[#525252]/60 uppercase'>
              Persisted in Neon
            </p>
          </div>
          <FileGrid />
        </div>
      </div>
    </div>
  );
}
