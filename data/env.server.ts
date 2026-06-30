import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const serverEnv = createEnv({
  server: {
    // Database
    DATABASE_URL: z.string().min(1),

    // Authentication
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1),

    // Email
    RESEND_API_KEY: z.string().min(1),

    // Environment
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  },

  // For Next.js server components
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },

  // For server-side validation
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
