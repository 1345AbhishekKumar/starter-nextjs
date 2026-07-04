import Stripe from 'stripe';
import { serverEnv } from '@/config/env.server';

if (!serverEnv.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in serverEnv');
}

export const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: '2026-06-24.dahlia' as any,
});

export const STRIPE_WEBHOOK_SECRET = serverEnv.STRIPE_WEBHOOK_SECRET;
