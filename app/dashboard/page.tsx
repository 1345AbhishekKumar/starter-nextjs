'use client';

import React from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
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

  // Fallback if client-side check happens before proxy redirects
  if (!isSignedIn) {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className='relative flex min-h-screen flex-col bg-[#f9f8f6] px-6 py-12 md:py-20'>
      {/* Paper texture overlay */}
      <div className='paper-texture'></div>

      <div className='relative z-10 mx-auto w-full max-w-[1000px]'>
        {/* Header navigation bar inside dashboard */}
        <header className='mb-12 flex items-center justify-between'>
          <Link
            href='/'
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

        {/* Welcome Section */}
        <div className='mb-10'>
          <p className='font-mono-custom mb-2 text-[11px] tracking-[0.2em] text-[#6e9c4e] uppercase'>
            Creator Space
          </p>
          <h1 className='font-handwritten text-5xl font-normal text-[#111111] md:text-6xl'>
            Hello, {user.firstName || 'Creator'}.
          </h1>
          <p className='font-mono-custom mt-4 max-w-lg text-[13px] leading-relaxed tracking-wider text-[#525252]'>
            Welcome back to your private meadow. Here is a quiet space for your
            slow creations and drafts.
          </p>
        </div>

        {/* Bento Grid */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          {/* Card 1: User Profile Bento */}
          <div className='bento-cell flex min-h-[220px] flex-col justify-between p-6 md:col-span-1'>
            <div className='flex items-center gap-4'>
              <div className='font-mono-custom flex size-14 items-center justify-center overflow-hidden rounded-full border-[3px] border-[#6e9c4e] bg-[#6e9c4e]/20 text-xl text-[#6e9c4e]'>
                {user.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={user.imageUrl}
                    alt='Avatar'
                    className='size-full object-cover'
                  />
                ) : (
                  user.firstName?.[0] || 'M'
                )}
              </div>
              <div>
                <h3 className='text-base leading-tight font-semibold text-[#111111]'>
                  {user.fullName || 'Meadow Creator'}
                </h3>
                <p className='font-mono-custom mt-0.5 text-[10px] tracking-wider text-[#525252] uppercase'>
                  Member since{' '}
                  {new Date(user.createdAt!).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                  })}
                </p>
              </div>
            </div>
            <div className='mt-6 border-t border-[#111111]/5 pt-4'>
              <p className='font-mono-custom text-[11px] tracking-wider text-[#525252]/60 uppercase'>
                Email Address
              </p>
              <p className='font-mono-custom mt-1 truncate text-xs font-medium text-[#111111]'>
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>

          {/* Card 2: Creative Drafts Bento */}
          <div className='bento-cell flex min-h-[220px] flex-col justify-between bg-[#6e9c4e]/5 p-6 md:col-span-2'>
            <div className='flex size-10 items-center justify-center rounded-full bg-white shadow-xs'>
              <svg
                className='size-5 text-[#6e9c4e]'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'></path>
              </svg>
            </div>
            <div>
              <p className='font-mono-custom mb-1 text-[10px] tracking-widest text-[#525252]/60 uppercase'>
                Slow Journal
              </p>
              <h3 className='mb-2 text-lg font-semibold text-[#111111]'>
                Your Creative Drafts
              </h3>
              <p className='font-mono-custom text-[12px] leading-relaxed tracking-wide text-[#525252]'>
                You have 2 pending draft drafts:{' '}
                <span className='font-sans font-medium text-[#111111] italic'>
                  &quot;Wildflowers under Dawn&quot;
                </span>{' '}
                and{' '}
                <span className='font-sans font-medium text-[#111111] italic'>
                  &quot;Quiet Rain&quot;
                </span>
                . Take your time to finish.
              </p>
            </div>
          </div>

          {/* Card 3: Stats Bento */}
          <div className='bento-cell flex min-h-[220px] flex-col justify-between p-6 md:col-span-2'>
            <div className='flex size-10 items-center justify-center rounded-full bg-[#6e9c4e]/10'>
              <svg
                className='size-5 text-[#6e9c4e]'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='12' cy='12' r='10'></circle>
                <path d='M12 8v8M8 12h8'></path>
              </svg>
            </div>
            <div className='grid grid-cols-3 gap-4 pt-4'>
              <div>
                <p className='font-handwritten text-4xl leading-none text-[#6e9c4e]'>
                  4
                </p>
                <p className='font-mono-custom mt-2 text-[9px] tracking-wider text-[#525252] uppercase'>
                  Works
                </p>
              </div>
              <div>
                <p className='font-handwritten text-4xl leading-none text-[#6e9c4e]'>
                  12
                </p>
                <p className='font-mono-custom mt-2 text-[9px] tracking-wider text-[#525252] uppercase'>
                  Flock Likes
                </p>
              </div>
              <div>
                <p className='font-handwritten text-4xl leading-none text-[#6e9c4e]'>
                  1
                </p>
                <p className='font-mono-custom mt-2 text-[9px] tracking-wider text-[#525252] uppercase'>
                  Journal
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Quick Actions Bento */}
          <div className='bento-cell flex min-h-[220px] flex-col justify-between bg-white p-6 md:col-span-1'>
            <div className='flex size-10 items-center justify-center rounded-full bg-[#111111]/5'>
              <svg
                className='size-5 text-[#111111]'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M18.36 6.64a9 9 0 1 1-12.73 0'></path>
                <line x1='12' y1='2' x2='12' y2='12'></line>
              </svg>
            </div>
            <div>
              <p className='font-mono-custom mb-1 text-[10px] tracking-widest text-[#525252]/60 uppercase'>
                Navigation
              </p>
              <h3 className='mb-4 text-sm font-semibold text-[#111111]'>
                Back to Homepage
              </h3>
              <Link href='/'>
                <button className='magnetic-btn font-mono-custom w-full px-5 py-2.5 text-[10px] tracking-wider uppercase'>
                  Go Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
