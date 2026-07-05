'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { stripe } from '@/lib/stripe';
import { clientEnv } from '@/config/env.client';
import { serverEnv } from '@/config/env.server';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';
import { z } from 'zod';

/**
 * Creates a Stripe Checkout Session for a subscription plan.
 */
export async function createCheckoutSession(priceId: string) {
  try {
    // Validate priceId parameter
    z.string().min(1).parse(priceId);
    const allowedPrices = [
      serverEnv.STRIPE_PRO_PRICE_ID,
      serverEnv.STRIPE_ENTERPRISE_PRICE_ID,
    ].filter(Boolean);

    if (!allowedPrices.includes(priceId)) {
      return { success: false, error: 'Invalid plan selected' };
    }

    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // 1. Get or create user record
    let userRecord = await db.query.users.findFirst({
      where: (u, { eq: eqOp }) => eqOp(u.id, userId),
    });

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress || '';

    if (!userRecord) {
      const [newUser] = await db
        .insert(users)
        .values({
          id: userId,
          email,
          role: 'member',
        })
        .returning();
      userRecord = newUser;
    }

    // 2. Get or create Stripe customer ID
    let stripeCustomerId = userRecord.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { userId },
      });
      stripeCustomerId = customer.id;

      await db
        .update(users)
        .set({ stripeCustomerId })
        .where(eq(users.id, userId));
    }

    // 3. Create Checkout Session
    // Omit payment_method_types to let Stripe handle it dynamically via Dashboard configs
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${clientEnv.NEXT_PUBLIC_APP_URL}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientEnv.NEXT_PUBLIC_APP_URL}/pricing/canceled`,
      metadata: { userId },
    });

    return { success: true, url: session.url };
  } catch (error) {
    logger.error(
      { error, priceId },
      'Failed to create Stripe checkout session',
    );
    Sentry.captureException(error);
    return { success: false, error: 'Failed to initiate purchase' };
  }
}

/**
 * Creates a Stripe Billing Customer Portal Session for managing subscriptions.
 */
export async function createPortalSession() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const userRecord = await db.query.users.findFirst({
      where: (u, { eq: eqOp }) => eqOp(u.id, userId),
    });

    if (!userRecord || !userRecord.stripeCustomerId) {
      return { success: false, error: 'No active billing details found' };
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: userRecord.stripeCustomerId,
      return_url: `${clientEnv.NEXT_PUBLIC_APP_URL}/settings`,
    });

    return { success: true, url: session.url };
  } catch (error) {
    logger.error({ error }, 'Failed to create Stripe portal session');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to load billing portal' };
  }
}

/**
 * Retrieves the current subscription record from database.
 */
export async function getSubscriptionStatus() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const subRecord = await db.query.subscriptions.findFirst({
      where: (s, { eq: eqOp }) => eqOp(s.userId, userId),
    });

    if (!subRecord) {
      return { success: true, data: null };
    }

    return {
      success: true,
      data: {
        id: subRecord.id,
        status: subRecord.status,
        priceId: subRecord.priceId,
        currentPeriodEnd: subRecord.currentPeriodEnd
          ? subRecord.currentPeriodEnd.toISOString()
          : null,
        isPro: subRecord.priceId === serverEnv.STRIPE_PRO_PRICE_ID,
        isEnterprise:
          subRecord.priceId === serverEnv.STRIPE_ENTERPRISE_PRICE_ID,
      },
    };
  } catch (error) {
    logger.error({ error }, 'Failed to retrieve subscription status');
    Sentry.captureException(error);
    return { success: false, error: 'Failed to retrieve subscription details' };
  }
}
