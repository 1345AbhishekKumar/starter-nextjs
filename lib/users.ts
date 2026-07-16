import { db } from '@/db';
import { users, profiles } from '@/db/schema';
import { clerkClient } from '@clerk/nextjs/server';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

export type UserRecord = typeof users.$inferSelect;
export type ProfileRecord = typeof profiles.$inferSelect;

/**
 * Ensures user and profile records exist in the database (self-healing).
 * Used to handle delay in Clerk webhooks during first-time user navigation.
 */
export async function ensureUserAndProfile(userId: string): Promise<{
  user: UserRecord;
  profile: ProfileRecord;
}> {
  // 1. Ensure user record exists
  let userRecord: UserRecord | undefined;
  try {
    userRecord = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
    });
  } catch (error) {
    logger.error(
      {
        err: error,
        userId,
      },
      'Failed to fetch user record due to connection/database error',
    );
    Sentry.captureException(error);
    throw error;
  }

  if (!userRecord) {
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress || '';

      const [newUser] = await db
        .insert(users)
        .values({
          id: userId,
          email,
          role: 'member',
        })
        .onConflictDoNothing()
        .returning();

      if (newUser) {
        userRecord = newUser;
      } else {
        // Fetch again if inserted concurrently by webhook
        userRecord = await db.query.users.findFirst({
          where: (u, { eq }) => eq(u.id, userId),
        });
      }
    } catch (error) {
      logger.error(
        {
          err: error,
          userId,
        },
        'Failed to self-heal or insert user record',
      );
      Sentry.captureException(error);
      throw error;
    }
  }

  if (!userRecord) {
    throw new Error(`Failed to ensure user record for user: ${userId}`);
  }

  // 2. Ensure profile record exists
  let profileRecord: ProfileRecord | undefined;
  try {
    profileRecord = await db.query.profiles.findFirst({
      where: (p, { eq }) => eq(p.id, userId),
    });
  } catch (error) {
    logger.error(
      {
        err: error,
        userId,
      },
      'Failed to fetch profile record due to connection/database error',
    );
    Sentry.captureException(error);
    throw error;
  }

  if (!profileRecord) {
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
      profileRecord = newProfile;
    } catch {
      // Safe to ignore if written concurrently, fetch again
      try {
        profileRecord = await db.query.profiles.findFirst({
          where: (p, { eq }) => eq(p.id, userId),
        });
      } catch (refetchError) {
        logger.error(
          {
            err: refetchError,
            userId,
          },
          'Failed to refetch profile record after concurrent insert',
        );
        Sentry.captureException(refetchError);
        throw refetchError;
      }
    }
  }

  if (!profileRecord) {
    throw new Error(`Failed to ensure profile record for user: ${userId}`);
  }

  return {
    user: userRecord,
    profile: profileRecord,
  };
}
