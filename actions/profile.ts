'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@/db';
import { profiles, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { profileFormSchema } from '@/lib/validations/profile';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';
import { revalidatePath } from 'next/cache';

/**
 * Updates the user's profile in both Clerk and Neon database.
 */
export async function updateProfile(data: unknown) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = profileFormSchema.parse(data);
    const nameParts = validated.name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Update user in Clerk
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      firstName,
      lastName,
    });

    // Update profile in Neon Postgres
    const existingProfile = await db.query.profiles.findFirst({
      where: (p, { eq: eqOp }) => eqOp(p.id, userId),
    });

    if (existingProfile) {
      await db
        .update(profiles)
        .set({
          name: validated.name,
          bio: validated.bio || null,
          website: validated.website || null,
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, userId));
    } else {
      // If profile record is somehow missing, query Clerk to get avatar url
      const clerkUser = await client.users.getUser(userId);
      await db.insert(profiles).values({
        id: userId,
        name: validated.name,
        bio: validated.bio || null,
        website: validated.website || null,
        avatarUrl: clerkUser.imageUrl || null,
      });
    }

    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    logger.error({ error }, 'Failed to update profile');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to update profile' };
  }
}

/**
 * Deletes the user account permanently in Clerk.
 * Cascade deletion rules on the DB will remove all associated user records.
 */
export async function deleteAccount() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const client = await clerkClient();
    await client.users.deleteUser(userId);

    // Also manually delete the user row from Neon DB to ensure instant removal
    await db.delete(users).where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    logger.error({ error }, 'Failed to delete account');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to delete account' };
  }
}
