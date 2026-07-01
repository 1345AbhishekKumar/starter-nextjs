import { verifyWebhook } from '@clerk/nextjs/webhooks';
import type { NextRequest } from 'next/server';
import { db } from '@/db';
import { users, profiles, webhookEvents } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { logger, flushLogsAfterResponse } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';
import { serverEnv } from '@/config/env.server';

/**
 * Clerk Webhook Handler
 *
 * Handles user lifecycle events (created, updated, deleted) from Clerk
 * and syncs them to our Neon Postgres database.
 *
 * Security: Every request is verified using Clerk's `verifyWebhook()`,
 * which validates the Svix HMAC-SHA256 signature automatically via
 * the CLERK_WEBHOOK_SIGNING_SECRET env var.
 *
 * Idempotency: Uses the `svix-id` header to deduplicate retried events
 * via the `webhook_events` table.
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  // ── Step 1: Verify the webhook signature ──────────────────────────
  let evt;
  try {
    evt = await verifyWebhook(req, {
      signingSecret: serverEnv.CLERK_WEBHOOK_SECRET,
    });
  } catch (err) {
    logger.error({ err }, 'Clerk webhook verification failed');
    return new Response('Webhook verification failed', { status: 400 });
  }

  const webhookId = req.headers.get('svix-id');
  const eventType = evt.type;

  logger.info({ eventType, webhookId }, 'Clerk webhook received');

  // ── Step 2: Idempotency check ─────────────────────────────────────
  if (webhookId) {
    try {
      const existing = await db.query.webhookEvents.findFirst({
        where: (events, { eq: eqOp }) => eqOp(events.id, webhookId),
      });

      if (existing) {
        logger.info(
          { webhookId, eventType },
          'Duplicate webhook — already processed',
        );
        return new Response('Already processed', { status: 200 });
      }
    } catch (err) {
      // If the idempotency lookup fails, continue processing
      // to avoid dropping events. The upsert logic below is
      // safe to run twice.
      logger.warn(
        { err, webhookId },
        'Idempotency check failed — continuing with processing',
      );
    }
  }

  // ── Step 3: Process the event ─────────────────────────────────────
  try {
    if (eventType === 'user.created') {
      await handleUserCreated(evt.data);
    }

    if (eventType === 'user.updated') {
      await handleUserUpdated(evt.data);
    }

    if (eventType === 'user.deleted') {
      await handleUserDeleted(evt.data);
    }

    // ── Step 4: Record the processed webhook ──────────────────────
    if (webhookId) {
      await db
        .insert(webhookEvents)
        .values({ id: webhookId })
        .onConflictDoNothing();
    }

    const durationMs = Date.now() - startTime;
    logger.info(
      { eventType, webhookId, durationMs },
      'Clerk webhook processed successfully',
    );

    flushLogsAfterResponse();
    return new Response('Webhook processed', { status: 200 });
  } catch (err) {
    logger.error(
      { err, eventType, webhookId },
      'Failed to process Clerk webhook',
    );
    Sentry.captureException(err, {
      extra: { eventType, webhookId },
    });

    flushLogsAfterResponse();
    return new Response('Webhook processing failed', { status: 500 });
  }
}

// ── Event Handlers ────────────────────────────────────────────────────

interface UserPayload {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  first_name: string | null;
  last_name: string | null;
  image_url: string;
}

async function handleUserCreated(data: UserPayload) {
  const { id, email_addresses, first_name, last_name, image_url } = data;
  const primaryEmail = email_addresses[0]?.email_address ?? '';
  const fullName = buildFullName(first_name, last_name);

  // Upsert to handle duplicate `user.created` deliveries gracefully
  await db
    .insert(users)
    .values({
      id,
      email: primaryEmail,
      role: 'member',
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: primaryEmail,
        updatedAt: new Date(),
      },
    });

  await db
    .insert(profiles)
    .values({
      id,
      name: fullName || null,
      avatarUrl: image_url || null,
    })
    .onConflictDoUpdate({
      target: profiles.id,
      set: {
        name: fullName || null,
        avatarUrl: image_url || null,
        updatedAt: new Date(),
      },
    });

  logger.info(
    { userId: id, email: primaryEmail },
    'User created and profile initialized',
  );
}

async function handleUserUpdated(data: UserPayload) {
  const { id, email_addresses, first_name, last_name, image_url } = data;
  const primaryEmail = email_addresses[0]?.email_address ?? '';
  const fullName = buildFullName(first_name, last_name);

  await db
    .update(users)
    .set({
      email: primaryEmail,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id));

  await db
    .update(profiles)
    .set({
      name: fullName || null,
      avatarUrl: image_url || null,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, id));

  logger.info({ userId: id, email: primaryEmail }, 'User and profile updated');
}

async function handleUserDeleted(data: { id?: string }) {
  const { id } = data;

  if (!id) {
    logger.warn('user.deleted event received without an ID — skipping');
    return;
  }

  // Cascade delete is configured on the FK constraints,
  // so deleting from `users` also removes `profiles`, `posts`,
  // and `subscriptions`.
  await db.delete(users).where(eq(users.id, id));

  logger.info({ userId: id }, 'User deleted (cascade)');
}

// ── Helpers ───────────────────────────────────────────────────────────

function buildFullName(
  firstName: string | null,
  lastName: string | null,
): string {
  return `${firstName ?? ''} ${lastName ?? ''}`.trim();
}
