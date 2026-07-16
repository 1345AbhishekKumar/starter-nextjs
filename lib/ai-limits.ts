import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { serverEnv } from '@/config/env.server';

const redis = new Redis({
  url: serverEnv.UPSTASH_REDIS_REST_URL,
  token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
});

type LimiterConfig = {
  capacity: number;
  window: `${number} h` | `${number} m` | `${number} s` | `${number} d`;
};

export const FREE_LIMITER_CONFIG: LimiterConfig = {
  capacity: 5000,
  window: '24 h',
};

export const PRO_LIMITER_CONFIG: LimiterConfig = {
  capacity: 50000,
  window: '3 h',
};

export const aiTokenLimiters = {
  free: new Ratelimit({
    redis,
    prefix: 'starter-nextjs:tokens:free',
    limiter: Ratelimit.slidingWindow(
      FREE_LIMITER_CONFIG.capacity,
      FREE_LIMITER_CONFIG.window,
    ),
    analytics: true,
  }),
  pro: new Ratelimit({
    redis,
    prefix: 'starter-nextjs:tokens:pro',
    limiter: Ratelimit.slidingWindow(
      PRO_LIMITER_CONFIG.capacity,
      PRO_LIMITER_CONFIG.window,
    ),
    analytics: true,
  }),
};

export const CHARS_PER_TOKEN = 4;
