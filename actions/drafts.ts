'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { posts, users } from '@/db/schema';
import { and, eq, ilike, or, desc, sql, type SQL } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { draftFormSchema, draftFiltersSchema } from '@/lib/validations/drafts';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';
import { arcjetClient } from '@/lib/arcjet';
import { request, tokenBucket } from '@arcjet/next';
import { aiTokenLimiters, CHARS_PER_TOKEN } from '@/lib/ai-limits';
import { getSubscriptionStatus } from '@/actions/stripe';
import { type AIModel } from '@/lib/ai';

// Define route-specific rate limiting for AI summary generation
const aiSummaryProtect = arcjetClient.withRule(
  tokenBucket({
    mode: 'LIVE',
    characteristics: ['userId'], // Track rate limits by Clerk userId
    refillRate: 5, // Refill 5 tokens per interval
    interval: 60, // 1-minute window
    capacity: 10, // Max capacity of 10 tokens
  }),
);

export type DraftItem = {
  id: string;
  title: string;
  content: string;
  category: 'nature' | 'poetry' | 'reflection' | 'journal';
  tags: string[];
  summary: string | null;
  createdAt: string;
};

export type GetDraftsResponse = {
  success: boolean;
  data?: {
    drafts: DraftItem[];
    totalCount: number;
    totalPages: number;
  };
  error?: string;
};

/**
 * Fetches user drafts (posts) from Neon database with filters and pagination.
 */
export async function getDrafts(filters: unknown): Promise<GetDraftsResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const validatedFilters = draftFiltersSchema.parse(filters);
    const search = validatedFilters.search || '';
    const category = validatedFilters.category || 'all';
    const page = validatedFilters.page || 1;
    const pageSize = validatedFilters.pageSize || 2;

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
      summary: post.summary,
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

export type CreateDraftResponse = {
  success: boolean;
  data?: DraftItem;
  error?: string;
};

/**
 * Creates a new draft (post) in Neon database.
 */
export async function createDraft(data: unknown): Promise<CreateDraftResponse> {
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
        summary: newPost.summary,
        createdAt: newPost.createdAt.toISOString(),
      },
    };
  } catch (error) {
    logger.error({ error, data }, 'Failed to create draft');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to create draft' };
  }
}

export type ActionResponse = {
  success: boolean;
  error?: string;
};

/**
 * Updates an existing draft (post) in Neon database.
 */
export async function updateDraft(
  id: string,
  data: unknown,
): Promise<ActionResponse> {
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
export async function deleteDraft(id: string): Promise<ActionResponse> {
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

    return {
      success: true,
    };
  } catch (error) {
    logger.error({ error, id }, 'Failed to delete draft');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to delete draft' };
  }
}

export type GenerateSummaryResponse = {
  success: boolean;
  summary?: string;
  error?: string;
};

/**
 * Generates an AI summary for a specific draft and updates it in the Neon database.
 */
export async function generateDraftSummary(
  id: string,
  model: string,
): Promise<GenerateSummaryResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
      return { success: false, error: 'Invalid draft ID' };
    }

    const req = await request();
    const decision = await aiSummaryProtect.protect(req, {
      requested: 1,
      userId,
    });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          success: false,
          error: 'Too many requests. Please slow down.',
        };
      }
      return {
        success: false,
        error: 'Security filters blocked this request.',
      };
    }

    const draft = await db.query.posts.findFirst({
      where: (p, { and: andOp, eq: eqOp }) =>
        andOp(eqOp(p.id, postId), eqOp(p.userId, userId)),
    });

    if (!draft) {
      return { success: false, error: 'Draft not found or unauthorized' };
    }

    const subStatus = await getSubscriptionStatus();
    const isPro =
      subStatus.success &&
      subStatus.data?.status === 'active' &&
      (subStatus.data.isPro || subStatus.data.isEnterprise);
    const tier: 'pro' | 'free' = isPro ? 'pro' : 'free';

    const estimatedPromptTokens = Math.max(
      1,
      Math.ceil(draft.content.length / CHARS_PER_TOKEN),
    );

    const limitCheck = await aiTokenLimiters[tier].limit(userId, {
      rate: estimatedPromptTokens,
    });

    if (!limitCheck.success) {
      const cooldownMs = limitCheck.reset - Date.now();
      const cooldownHours = Math.max(0, cooldownMs / (1000 * 60 * 60));
      return {
        success: false,
        error: `AI token limit reached. Please wait ${cooldownHours.toFixed(1)} hours before trying again.`,
      };
    }

    // Call the AI utility to generate summary
    const { generateSummary } = await import('@/lib/ai');
    const summary = await generateSummary(draft.content, model);

    // Save the summary back to the database
    await db
      .update(posts)
      .set({ summary, updatedAt: new Date() })
      .where(and(eq(posts.id, postId), eq(posts.userId, userId)));

    revalidatePath('/dashboard/drafts');

    return { success: true, summary };
  } catch (error) {
    logger.error({ error, id, model }, 'Failed to generate draft summary');
    Sentry.captureException(error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to generate draft summary',
    };
  }
}

export type GetAIModelsResponse = {
  success: boolean;
  data?: AIModel[];
  error?: string;
};

/**
 * Server Action to fetch available models from AI catalog (or fallbacks).
 */
export async function getAIModels(): Promise<GetAIModelsResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const { fetchAIModels } = await import('@/lib/ai');
    const models = await fetchAIModels();
    return { success: true, data: models };
  } catch (error) {
    logger.error({ error }, 'Failed to get AI models');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to get AI models' };
  }
}
