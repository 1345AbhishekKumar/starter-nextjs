import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Compass, UploadCloud } from 'lucide-react';

import { KPICards } from '@/components/dashboard/KPICards';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

import { ensureUserAndProfile } from '@/lib/users';
import { logger } from '@/lib/logger';

export const metadata = {
  title: 'Dashboard',
  alternates: {
    canonical: '/dashboard',
  },
};

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const { userId } = await auth();

  logger.info('Rendering dashboard server component');

  if (!userId) {
    redirect('/sign-in');
  }

  // Ensure user and profile records exist (self-healing)
  const { profile } = await ensureUserAndProfile(userId);

  const firstName = profile?.name?.split(' ')[0] || 'Creator';

  return (
    <div className='relative flex min-h-screen flex-col bg-[#f9f8f6] px-6 py-12 md:py-20'>
      {/* Paper texture overlay */}
      <div className='paper-texture'></div>

      <main
        id='main-content'
        className='relative z-10 mx-auto w-full max-w-[1100px]'
      >
        {/* Header navigation bar inside dashboard */}
        <DashboardHeader />

        {/* Welcome & Action Header Section */}
        <div className='mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end'>
          <div>
            <p className='font-mono-custom mb-2 text-[11px] tracking-[0.2em] text-[#6e9c4e] uppercase'>
              Creator Space
            </p>
            <h1 className='font-handwritten text-5xl font-normal text-[#111111] md:text-6xl'>
              Hello, {firstName}.
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
      </main>
    </div>
  );
}
