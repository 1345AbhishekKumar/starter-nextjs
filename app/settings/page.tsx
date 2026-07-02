import React from 'react';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users, profiles } from '@/db/schema';
import { SettingsClient } from '@/components/settings/SettingsClient';

export const metadata = {
  title: 'Settings',
};

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Ensure user record exists (self-healing if webhook is delayed)
  const userRecord = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });

  if (!userRecord) {
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress || '';

      await db
        .insert(users)
        .values({
          id: userId,
          email,
          role: 'member',
        })
        .onConflictDoNothing();
    } catch {
      // Safe to ignore if written concurrently
    }
  }

  // Ensure profile record exists
  let profile = await db.query.profiles.findFirst({
    where: (p, { eq }) => eq(p.id, userId),
  });

  if (!profile) {
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      const fullName =
        `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
        'Meadow Creator';

      const [newProfile] = await db
        .insert(profiles)
        .values({
          id: userId,
          name: fullName,
          bio: '',
          website: '',
          avatarUrl: clerkUser.imageUrl || null,
        })
        .returning();
      profile = newProfile;
    } catch {
      // Safe to ignore if written concurrently, fetch again
      profile = await db.query.profiles.findFirst({
        where: (p, { eq }) => eq(p.id, userId),
      });
    }
  }

  const serializableProfile = {
    id: userId,
    name: profile?.name || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    avatarUrl: profile?.avatarUrl || '',
  };

  return <SettingsClient initialProfile={serializableProfile} />;
}
