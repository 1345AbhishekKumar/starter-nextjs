import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SettingsClient } from '@/components/settings/SettingsClient';
import { ensureUserAndProfile } from '@/lib/users';

export const metadata = {
  title: 'Settings',
  alternates: {
    canonical: '/settings',
  },
};

export default async function SettingsPage(): Promise<React.JSX.Element> {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Ensure user and profile records exist (self-healing)
  const { user, profile } = await ensureUserAndProfile(userId);

  const serializableProfile = {
    id: userId,
    name: profile?.name || '',
    email: user?.email || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    avatarUrl: profile?.avatarUrl || '',
  };

  return <SettingsClient initialProfile={serializableProfile} />;
}
