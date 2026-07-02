'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { changePasswordSchema } from '@/lib/validations/security';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

/**
 * Updates the user's password in Clerk.
 * Optionally revokes all other active sessions.
 */
export async function changePassword(data: unknown) {
  try {
    const { userId, sessionId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = changePasswordSchema.parse(data);

    const client = await clerkClient();
    await client.users.updateUser(userId, {
      password: validated.newPassword,
    });

    // If requested, sign out of all other active sessions
    if (validated.signOutOthers) {
      const response = await client.sessions.getSessionList({ userId });
      const sessions = response.data;
      for (const session of sessions) {
        if (session.id !== sessionId && session.status === 'active') {
          await client.sessions.revokeSession(session.id);
        }
      }
    }

    return { success: true };
  } catch (error) {
    logger.error({ error }, 'Failed to change password');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to change password' };
  }
}

/**
 * Revokes a specific session for the authenticated user.
 */
export async function revokeSessionAction(targetSessionId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const client = await clerkClient();
    // Verify that the session belongs to the user
    const session = await client.sessions.getSession(targetSessionId);
    if (session.userId !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await client.sessions.revokeSession(targetSessionId);
    return { success: true };
  } catch (error) {
    logger.error({ error, targetSessionId }, 'Failed to revoke session');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to revoke session' };
  }
}
