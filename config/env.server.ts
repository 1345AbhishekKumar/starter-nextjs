import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const serverEnv = createEnv({
  server: {
    // Database
    DATABASE_URL: z.string().min(1),

    // Stripe
    STRIPE_SECRET_KEY: z
      .string()
      .refine(
        (val) => val.startsWith('sk_') || val.startsWith('rk_'),
        'Stripe API key must start with sk_ or rk_',
      ),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    STRIPE_PRO_PRICE_ID: z.string().optional(),
    STRIPE_ENTERPRISE_PRICE_ID: z.string().optional(),

    // Uploadcare
    UPLOADCARE_SECRET_KEY: z.string().min(1),

    // Authentication
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1),

    // Email
    RESEND_API_KEY: z.string().min(1),

    // Environment
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),

    // Sentry (optional)
    SENTRY_AUTH_TOKEN: z.string().optional(),
    SENTRY_DSN: z.string().optional(),

    // AI & Upstash (optional)
    NVIDIA_API_KEY: z.string().optional(),
    OPENROUTER_API_KEY: z.string().optional(),
    GEMINI_API_KEY: z.string().optional(),
    UPSTASH_REDIS_REST_URL: z.string().min(1),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

    // Rate Limiting
    ARCJET_KEY: z.string().min(1),
  },

  // For Next.js server components
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID,
    STRIPE_ENTERPRISE_PRICE_ID: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    UPLOADCARE_SECRET_KEY: process.env.UPLOADCARE_SECRET_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_DSN: process.env.SENTRY_DSN,
    NVIDIA_API_KEY: process.env.NVIDIA_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    ARCJET_KEY: process.env.ARCJET_KEY,
  },

  // For server-side validation
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
