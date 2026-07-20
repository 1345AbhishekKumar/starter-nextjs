import { db } from '@/db';
import { users, profiles } from '@/db/schema';
import { clerkClient } from '@clerk/nextjs/server';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';
import { withDbRetry } from '@/lib/utils';

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
  // 1. Fetch user and profile in a single joined database query
  let userWithProfile:
    (UserRecord & { profile: ProfileRecord | null }) | undefined;
  try {
    userWithProfile = (await withDbRetry(() =>
      db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, userId),
        with: { profile: true },
      }),
    )) as (UserRecord & { profile: ProfileRecord | null }) | undefined;
  } catch (error) {
    logger.error(
      {
        err: error,
        userId,
      },
      'Failed to fetch user and profile records due to database error',
    );
    Sentry.captureException(error);
    throw error;
  }

  let userRecord: UserRecord;
  let profileRecord: ProfileRecord;

  // 2. If user record is missing, create both user and profile (self-healing)
  if (!userWithProfile) {
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
        const refetchedUser = await withDbRetry(() =>
          db.query.users.findFirst({ where: (u, { eq }) => eq(u.id, userId) }),
        );
        if (!refetchedUser) {
          throw new Error('User record still missing after concurrent insert');
        }
        userRecord = refetchedUser;
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
  } else {
    userRecord = {
      id: userWithProfile.id,
      email: userWithProfile.email,
      role: userWithProfile.role,
      stripeCustomerId: userWithProfile.stripeCustomerId,
      createdAt: userWithProfile.createdAt,
      updatedAt: userWithProfile.updatedAt,
    };
  }

  // 3. If profile record is missing, create it
  const existingProfile = userWithProfile?.profile;
  if (!existingProfile) {
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
        const refetchedProfile = await withDbRetry(() =>
          db.query.profiles.findFirst({
            where: (p, { eq }) => eq(p.id, userId),
          }),
        );
        if (!refetchedProfile) {
          throw new Error(
            'Profile record still missing after concurrent insert',
          );
        }
        profileRecord = refetchedProfile;
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
  } else {
    profileRecord = existingProfile;
  }

  return {
    user: userRecord,
    profile: profileRecord,
  };
}

/**
 * Retrieves a user's role from the database.
 */
export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
      columns: { role: true },
    });
    return user?.role || null;
  } catch (error) {
    logger.error({ error, userId }, 'Failed to fetch user role');
    Sentry.captureException(error);
    return null;
  }
}
