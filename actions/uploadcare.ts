'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { uploadcareFiles } from '@/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';
import { z } from 'zod';

const syncFileSchema = z.object({
  fileId: z.string().min(1),
  fileUrl: z.string().url(),
  fileName: z.string().min(1),
  fileSize: z.number().int().positive(),
});

/**
 * Persists Uploadcare file metadata to the Neon database, bound to the authenticated Clerk user.
 */
export async function syncUploadcareFile(data: unknown) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = syncFileSchema.parse(data);

    await db
      .insert(uploadcareFiles)
      .values({
        fileId: validated.fileId,
        fileUrl: validated.fileUrl,
        fileName: validated.fileName,
        fileSize: validated.fileSize,
        userId: userId,
      })
      .onConflictDoNothing();

    revalidatePath('/dashboard/uploads');
    return { success: true };
  } catch (error) {
    logger.error({ error, data }, 'Failed to sync Uploadcare file');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to sync file' };
  }
}

/**
 * Retrieves the list of synced files for the authenticated user, ordered by creation time.
 */
export async function getSyncedFiles() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const files = await db
      .select()
      .from(uploadcareFiles)
      .where(eq(uploadcareFiles.userId, userId))
      .orderBy(desc(uploadcareFiles.createdAt));

    return {
      success: true,
      data: files.map((file) => ({
        id: file.id,
        fileId: file.fileId,
        fileUrl: file.fileUrl,
        fileName: file.fileName,
        fileSize: file.fileSize,
        createdAt: file.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    logger.error({ error }, 'Failed to fetch synced files');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to fetch synced files' };
  }
}

/**
 * Removes a file reference from the Neon database for the authenticated user.
 */
export async function deleteSyncedFile(id: number) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Ensure user owns the file and delete it in a single query
    const [deletedFile] = await db
      .delete(uploadcareFiles)
      .where(
        and(eq(uploadcareFiles.id, id), eq(uploadcareFiles.userId, userId)),
      )
      .returning();

    if (!deletedFile) {
      return { success: false, error: 'File not found or unauthorized' };
    }

    revalidatePath('/dashboard/uploads');
    return { success: true };
  } catch (error) {
    logger.error({ error, id }, 'Failed to delete synced file');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to delete file' };
  }
}
