import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const serverEnv = createEnv({
  server: {
    // Database
    DATABASE_URL: z.string().min(1),

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
    // UPSTASH_REDIS_REST_URL: z.string().optional(),
    // UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  },

  // For Next.js server components
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
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
    // UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    // UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  },

  // For server-side validation
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
