'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Compass, Settings, UploadCloud } from 'lucide-react';

import { KPICards } from '@/components/dashboard/KPICards';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';

import { logger } from '@/lib/logger';

export default function DashboardPage() {
  logger.info('Rendering dashboard server component');

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

      <div className='relative z-10 mx-auto w-full max-w-[1100px]'>
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

          <div className='flex items-center gap-3'>
            <Link
              href='/settings'
              className='outline-btn font-mono-custom flex items-center gap-1.5 border-[#111111]/30 bg-transparent px-4 py-2.5 text-[10px] tracking-wider uppercase hover:border-[#111111]'
            >
              <Settings size={12} />
              Settings
            </Link>
            <button
              onClick={() => signOut()}
              className='outline-btn font-mono-custom border-[#111111]/30 bg-transparent px-5 py-2.5 text-[10px] tracking-wider uppercase hover:border-[#111111]'
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Welcome & Action Header Section */}
        <div className='mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end'>
          <div>
            <p className='font-mono-custom mb-2 text-[11px] tracking-[0.2em] text-[#6e9c4e] uppercase'>
              Creator Space
            </p>
            <h1 className='font-handwritten text-5xl font-normal text-[#111111] md:text-6xl'>
              Hello, {user.firstName || 'Creator'}.
            </h1>
            <p className='font-mono-custom mt-4 max-w-lg text-[13px] leading-relaxed tracking-wider text-[#525252]'>
              Welcome back to your private meadow. Here is a quiet space for
              your slow creations and drafts.
            </p>
          </div>

          {/* Quick Actions Panel */}
          <div className='flex flex-wrap gap-3'>
            <Link href='/dashboard/drafts'>
              <button className='magnetic-btn font-mono-custom flex items-center gap-2 px-5 py-3 text-[10px] tracking-wider uppercase'>
                <Plus size={12} />
                Sow New Draft
              </button>
            </Link>
            <Link href='/dashboard/drafts'>
              <button className='outline-btn font-mono-custom flex items-center gap-2 border-[#111111]/30 px-5 py-3 text-[10px] tracking-wider uppercase hover:border-[#111111]'>
                <Compass size={12} />
                My Journal Drafts
              </button>
            </Link>
            <Link href='/dashboard/uploads'>
              <button className='outline-btn font-mono-custom flex items-center gap-2 border-[#111111]/30 px-5 py-3 text-[10px] tracking-wider uppercase hover:border-[#111111]'>
                <UploadCloud size={12} />
                Upload Gallery
              </button>
            </Link>
          </div>
        </div>

        {/* Section 1: KPI Stats Panel */}
        <section className='mb-8'>
          <KPICards />
        </section>

        {/* Section 2: Chart & Timeline Stream */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Main Activity Chart (Spans 2 columns on desktop) */}
          <div className='lg:col-span-2'>
            <ActivityChart />
          </div>

          {/* Activity Feed (Spans 1 column) */}
          <div className='lg:col-span-1'>
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
