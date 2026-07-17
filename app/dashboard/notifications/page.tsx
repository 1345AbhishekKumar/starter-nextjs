import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { NotificationPage } from '@/components/notifications/NotificationPage';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export const metadata = {
  title: 'Notifications',
};

export default async function DashboardNotificationsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className='relative flex min-h-screen flex-col bg-[#f9f8f6] px-6 py-12 md:py-20'>
      {/* Paper texture overlay */}
      <div className='paper-texture'></div>

      <div className='relative z-10 mx-auto w-full max-w-[1100px]'>
        <DashboardHeader />
        <NotificationPage />
      </div>
    </div>
  );
}
