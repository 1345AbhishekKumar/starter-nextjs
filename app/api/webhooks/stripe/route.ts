import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe';
import { db } from '@/db';
import { users, subscriptions, webhookEvents } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { logger, flushLogsAfterResponse } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  // 1. Verify Webhook Signature
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    logger.error({ err }, 'Stripe webhook verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const webhookId = event.id;
  const eventType = event.type;
  logger.info({ eventType, webhookId }, 'Stripe webhook event received');

  // 2. Idempotency Check
  try {
    const existing = await db.query.webhookEvents.findFirst({
      where: (ev, { eq: eqOp }) => eqOp(ev.id, webhookId),
    });

    if (existing) {
      logger.info(
        { webhookId, eventType },
        'Duplicate stripe event — skipping',
      );
      return NextResponse.json({ received: true, duplicate: true });
    }
  } catch (err) {
    logger.warn({ err, webhookId }, 'Stripe webhook idempotency check failed');
  }

  // 3. Process Events
  try {
    switch (eventType) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;

        if (!userId) {
          logger.warn(
            { sessionId: session.id },
            'No userId metadata in Stripe checkout session',
          );
          break;
        }

        // Update user's customer ID
        await db
          .update(users)
          .set({ stripeCustomerId: customerId })
          .where(eq(users.id, userId));

        // If subscription is created, save subscription details
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string,
          );
          await handleSubscriptionUpsert(subscription, userId);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        let userId: string | undefined = subscription.metadata?.userId;

        if (!userId) {
          const userRecord = await db.query.users.findFirst({
            where: (u, { eq: eqOp }) =>
              eqOp(u.stripeCustomerId, subscription.customer as string),
          });
          userId = userRecord?.id;
        }

        if (userId) {
          await handleSubscriptionUpsert(subscription, userId);
        } else {
          logger.warn(
            {
              subscriptionId: subscription.id,
              customerId: subscription.customer,
            },
            'Stripe subscription updated but user not found',
          );
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await db
          .update(subscriptions)
          .set({
            status: subscription.status,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.id, subscription.id));

        logger.info(
          { subscriptionId: subscription.id },
          'Stripe subscription canceled/deleted',
        );
        break;
      }

      default: {
        logger.info({ eventType }, 'Unhandled Stripe webhook event type');
      }
    }

    // 4. Record event processed for idempotency
    await db
      .insert(webhookEvents)
      .values({ id: webhookId })
      .onConflictDoNothing();

    const durationMs = Date.now() - startTime;
    logger.info(
      { eventType, webhookId, durationMs },
      'Stripe webhook processed successfully',
    );

    flushLogsAfterResponse();
    return NextResponse.json({ received: true });
  } catch (err) {
    logger.error(
      { err, eventType, webhookId },
      'Failed to process Stripe webhook',
    );
    Sentry.captureException(err, {
      extra: { eventType, webhookId },
    });

    flushLogsAfterResponse();
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 },
    );
  }
}

async function handleSubscriptionUpsert(
  subscription: Stripe.Subscription,
  userId: string,
) {
  const priceId = subscription.items.data[0]?.price.id || null;
  const periodEndTimestamp = subscription.items.data[0]?.current_period_end;
  const currentPeriodEnd = periodEndTimestamp
    ? new Date(periodEndTimestamp * 1000)
    : null;

  await db
    .insert(subscriptions)
    .values({
      id: subscription.id,
      userId,
      status: subscription.status,
      priceId,
      currentPeriodEnd,
    })
    .onConflictDoUpdate({
      target: subscriptions.id,
      set: {
        status: subscription.status,
        priceId,
        currentPeriodEnd,
        updatedAt: new Date(),
      },
    });

  logger.info(
    { subscriptionId: subscription.id, userId, status: subscription.status },
    'Subscription record upserted',
  );
}
