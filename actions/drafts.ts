'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { posts, users } from '@/db/schema';
import { and, eq, ilike, or, desc, sql, type SQL } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { draftFormSchema } from '@/lib/validations/drafts';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

/**
 * Fetches user drafts (posts) from Neon database with filters and pagination.
 */
export async function getDrafts(filters: {
  search: string;
  category: string;
  page: number;
  pageSize?: number;
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const search = filters.search || '';
    const category = filters.category || 'all';
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 2;

    const conditions: SQL[] = [eq(posts.userId, userId)];

    if (category !== 'all') {
      conditions.push(eq(posts.category, category));
    }

    if (search.trim()) {
      const searchOr = or(
        ilike(posts.title, `%${search}%`),
        ilike(posts.content, `%${search}%`),
      );
      if (searchOr) {
        conditions.push(searchOr);
      }
    }

    // Query total count of matching drafts
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(and(...conditions));

    const totalCount = Number(countResult?.count || 0);

    // Query paginated drafts
    const results = await db
      .select()
      .from(posts)
      .where(and(...conditions))
      .orderBy(desc(posts.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    // Map to frontend interface structure (ensuring ID is a string)
    const drafts = results.map((post) => ({
      id: String(post.id),
      title: post.title,
      content: post.content,
      category: post.category as 'nature' | 'poetry' | 'reflection' | 'journal',
      tags: post.tags || [],
      createdAt: post.createdAt.toISOString(),
    }));

    return {
      success: true,
      data: {
        drafts,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  } catch (error) {
    logger.error({ error, filters }, 'Failed to fetch drafts');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to fetch drafts' };
  }
}

/**
 * Creates a new draft (post) in Neon database.
 */
export async function createDraft(data: unknown) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = draftFormSchema.parse(data);

    // Self-healing: Ensure user record exists in users table
    const userRecord = await db.query.users.findFirst({
      where: (u, { eq: eqOp }) => eqOp(u.id, userId),
    });

    if (!userRecord) {
      const { clerkClient } = await import('@clerk/nextjs/server');
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
    }

    const [newPost] = await db
      .insert(posts)
      .values({
        title: validated.title,
        content: validated.content,
        userId: userId,
        status: 'draft',
        category: validated.category,
        tags: validated.tags,
      })
      .returning();

    revalidatePath('/dashboard/drafts');

    return {
      success: true,
      data: {
        id: String(newPost.id),
        title: newPost.title,
        content: newPost.content,
        category: newPost.category as
          'nature' | 'poetry' | 'reflection' | 'journal',
        tags: newPost.tags || [],
        createdAt: newPost.createdAt.toISOString(),
      },
    };
  } catch (error) {
    logger.error({ error, data }, 'Failed to create draft');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to create draft' };
  }
}

/**
 * Updates an existing draft (post) in Neon database.
 */
export async function updateDraft(id: string, data: unknown) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = draftFormSchema.parse(data);
    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
      return { success: false, error: 'Invalid draft ID' };
    }

    const [updatedPost] = await db
      .update(posts)
      .set({
        title: validated.title,
        content: validated.content,
        category: validated.category,
        tags: validated.tags,
        updatedAt: new Date(),
      })
      .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
      .returning();

    if (!updatedPost) {
      return { success: false, error: 'Draft not found or unauthorized' };
    }

    revalidatePath('/dashboard/drafts');

    return { success: true };
  } catch (error) {
    logger.error({ error, id, data }, 'Failed to update draft');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to update draft' };
  }
}

/**
 * Deletes a draft (post) from Neon database.
 */
export async function deleteDraft(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
      return { success: false, error: 'Invalid draft ID' };
    }

    const [deletedPost] = await db
      .delete(posts)
      .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
      .returning();

    if (!deletedPost) {
      return { success: false, error: 'Draft not found or unauthorized' };
    }

    revalidatePath('/dashboard/drafts');

    return { success: true };
  } catch (error) {
    logger.error({ error, id }, 'Failed to delete draft');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to delete draft' };
  }
}
