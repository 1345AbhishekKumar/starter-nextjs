'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { posts, uploadcareFiles, notifications } from '@/db/schema';
import { and, eq, ilike, or, desc, sql } from 'drizzle-orm';
import { searchQuerySchema } from '@/lib/validations/search';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

export type SearchResultType =
  'page' | 'action' | 'file' | 'draft' | 'notification';

export type SearchResultItem = {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  url: string;
  badgeText?: string;
  actionType?: 'signout' | 'upload' | 'ai' | 'navigate';
  createdAt?: string;
  fileSize?: number;
};

export type GroupedSearchResults = {
  pages: SearchResultItem[];
  actions: SearchResultItem[];
  files: SearchResultItem[];
  drafts: SearchResultItem[];
  notifications: SearchResultItem[];
};

export type GlobalSearchResponse = {
  success: boolean;
  data?: {
    grouped: GroupedSearchResults;
    totalCount: number;
  };
  error?: string;
};

const STATIC_PAGES: SearchResultItem[] = [
  {
    id: 'page-dashboard',
    type: 'page',
    title: 'Dashboard Console',
    description: '/dashboard — System metrics, storage sandbox & AI console',
    url: '/dashboard',
  },
  {
    id: 'page-billing',
    type: 'page',
    title: 'Billing & Subscriptions',
    description: '/pricing — Manage plan, Stripe portal & invoices',
    url: '/pricing',
  },
  {
    id: 'page-settings',
    type: 'page',
    title: 'Account Settings',
    description: '/settings — Profile, security, 2FA & API keys',
    url: '/settings',
  },
  {
    id: 'page-notifications',
    type: 'page',
    title: 'Notifications Center',
    description: '/dashboard/notifications — Real-time alerts and system logs',
    url: '/dashboard/notifications',
  },
  {
    id: 'page-manifesto',
    type: 'page',
    title: 'System Manifesto',
    description: '/ — SWARM Autonomous Agent architecture & manifesto',
    url: '/',
  },
];

const STATIC_ACTIONS: SearchResultItem[] = [
  {
    id: 'action-upload',
    type: 'action',
    title: 'Upload Document to InsForge Storage',
    description: 'Quick upload PDF, CSV, or text files',
    url: '/dashboard/uploads',
    actionType: 'upload',
  },
  {
    id: 'action-ai',
    type: 'action',
    title: 'Launch AI Playground Terminal',
    description: 'Interact with OpenRouter serverless LLM assistant',
    url: '/dashboard',
    actionType: 'ai',
  },
  {
    id: 'action-security',
    type: 'action',
    title: 'Manage 2FA & Security Keys',
    description: 'Configure two-factor auth and personal API tokens',
    url: '/settings',
    actionType: 'navigate',
  },
  {
    id: 'action-signout',
    type: 'action',
    title: 'Sign Out Session',
    description: 'Terminate local authentication token',
    url: '',
    actionType: 'signout',
  },
];

/**
 * Executes a global search across Pages, Actions, Files, Drafts, and Notifications.
 */
export async function searchAll(input: unknown): Promise<GlobalSearchResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const validated = searchQuerySchema.parse(input);
    const queryTerm = validated.query.toLowerCase().trim();

    const grouped: GroupedSearchResults = {
      pages: [],
      actions: [],
      files: [],
      drafts: [],
      notifications: [],
    };

    // 1. Search Pages
    grouped.pages = STATIC_PAGES.filter(
      (p) =>
        !queryTerm ||
        p.title.toLowerCase().includes(queryTerm) ||
        p.description.toLowerCase().includes(queryTerm) ||
        p.url.toLowerCase().includes(queryTerm),
    );

    // 2. Search Actions
    grouped.actions = STATIC_ACTIONS.filter(
      (a) =>
        !queryTerm ||
        a.title.toLowerCase().includes(queryTerm) ||
        a.description.toLowerCase().includes(queryTerm),
    );

    // 3. Search Files (Neon Postgres Uploadcare files)
    if (
      queryTerm ||
      validated.category === 'all' ||
      validated.category === 'files'
    ) {
      const fileConditions = [eq(uploadcareFiles.userId, userId)];
      if (queryTerm) {
        fileConditions.push(ilike(uploadcareFiles.fileName, `%${queryTerm}%`));
      }

      const fileRecords = await db
        .select()
        .from(uploadcareFiles)
        .where(and(...fileConditions))
        .orderBy(desc(uploadcareFiles.createdAt))
        .limit(10);

      grouped.files = fileRecords.map((f) => ({
        id: `file-${f.id}`,
        type: 'file',
        title: f.fileName,
        description: `${(f.fileSize / (1024 * 1024)).toFixed(2)} MB • ${new Date(
          f.createdAt,
        ).toLocaleDateString()}`,
        url: '/dashboard/uploads',
        fileSize: f.fileSize,
        createdAt: f.createdAt.toISOString(),
      }));
    }

    // 4. Search Drafts / Posts
    if (
      queryTerm ||
      validated.category === 'all' ||
      validated.category === 'drafts'
    ) {
      const draftConditions = [eq(posts.userId, userId)];
      if (queryTerm) {
        draftConditions.push(
          or(
            ilike(posts.title, `%${queryTerm}%`),
            ilike(posts.summary, `%${queryTerm}%`),
            ilike(posts.content, `%${queryTerm}%`),
            ilike(posts.category, `%${queryTerm}%`),
          )!,
        );
      }

      const draftRecords = await db
        .select()
        .from(posts)
        .where(and(...draftConditions))
        .orderBy(desc(posts.createdAt))
        .limit(10);

      grouped.drafts = draftRecords.map((d) => ({
        id: `draft-${d.id}`,
        type: 'draft',
        title: d.title,
        description:
          d.summary ||
          (d.content.length > 80 ? `${d.content.slice(0, 80)}...` : d.content),
        url: '/dashboard/drafts',
        badgeText: d.category.toUpperCase(),
        createdAt: d.createdAt.toISOString(),
      }));
    }

    // 5. Search Notifications
    if (
      queryTerm ||
      validated.category === 'all' ||
      validated.category === 'notifications'
    ) {
      const notifConditions = [eq(notifications.userId, userId)];
      if (queryTerm) {
        notifConditions.push(
          or(
            ilike(notifications.templateId, `%${queryTerm}%`),
            sql`${notifications.variables}::text ILIKE ${`%${queryTerm}%`}`,
          )!,
        );
      }

      const notifRecords = await db
        .select()
        .from(notifications)
        .where(and(...notifConditions))
        .orderBy(desc(notifications.createdAt))
        .limit(10);

      grouped.notifications = notifRecords.map((n) => ({
        id: `notif-${n.id}`,
        type: 'notification',
        title: `Notification: ${n.templateId}`,
        description: `Priority: ${n.priority} • ${
          n.readAt ? 'Read' : 'Unread'
        }`,
        url: '/dashboard/notifications',
        badgeText: n.priority.toUpperCase(),
        createdAt: n.createdAt.toISOString(),
      }));
    }

    const totalCount =
      grouped.pages.length +
      grouped.actions.length +
      grouped.files.length +
      grouped.drafts.length +
      grouped.notifications.length;

    return {
      success: true,
      data: {
        grouped,
        totalCount,
      },
    };
  } catch (error) {
    logger.error({ error, input }, 'Failed to execute global search');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to perform search' };
  }
}
