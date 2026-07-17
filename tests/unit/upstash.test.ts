import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the environment config first to prevent validation errors
vi.mock('@/config/env.server', () => ({
  serverEnv: {
    UPSTASH_REDIS_REST_URL: 'https://test-redis.upstash.io',
    UPSTASH_REDIS_REST_TOKEN: 'test-token',
  },
}));

// Mocks for Upstash Redis and Ratelimit
const mockRedisConstructor = vi.fn();
const mockRatelimitConstructor = vi.fn();
const mockLimit = vi.fn();

vi.mock('@upstash/redis', () => {
  return {
    Redis: class MockRedis {
      config: unknown;
      constructor(config: unknown) {
        mockRedisConstructor(config);
        this.config = config;
      }
    },
  };
});

vi.mock('@upstash/ratelimit', () => {
  class MockRatelimit {
    config: unknown;
    limit = mockLimit;
    constructor(config: unknown) {
      mockRatelimitConstructor(config);
      this.config = config;
    }
    static slidingWindow(capacity: number, window: string) {
      return {
        type: 'slidingWindow',
        capacity,
        window,
      };
    }
  }

  return {
    Ratelimit: MockRatelimit,
  };
});

describe('Upstash Redis and Ratelimit Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize Redis and construct rate limiters with correct configuration from environment', async () => {
    // Import to trigger initialization
    const { FREE_LIMITER_CONFIG, PRO_LIMITER_CONFIG } =
      await import('@/lib/ai-limits');

    // Verify Redis client setup
    expect(mockRedisConstructor).toHaveBeenCalled();
    const config = mockRedisConstructor.mock.calls[0][0] as {
      url: string;
      token: string;
    };
    expect(config.url).toBe('https://test-redis.upstash.io');
    expect(config.token).toBe('test-token');

    // Verify Ratelimit constructs
    expect(mockRatelimitConstructor).toHaveBeenCalledTimes(2);

    // Verify free limiter config
    const freeCallConfig = mockRatelimitConstructor.mock.calls[0][0] as {
      prefix: string;
      limiter: { capacity: number; window: string };
    };
    expect(freeCallConfig.prefix).toBe('starter-nextjs:tokens:free');
    expect(freeCallConfig.limiter.capacity).toBe(FREE_LIMITER_CONFIG.capacity);
    expect(freeCallConfig.limiter.window).toBe(FREE_LIMITER_CONFIG.window);

    // Verify pro limiter config
    const proCallConfig = mockRatelimitConstructor.mock.calls[1][0] as {
      prefix: string;
      limiter: { capacity: number; window: string };
    };
    expect(proCallConfig.prefix).toBe('starter-nextjs:tokens:pro');
    expect(proCallConfig.limiter.capacity).toBe(PRO_LIMITER_CONFIG.capacity);
    expect(proCallConfig.limiter.window).toBe(PRO_LIMITER_CONFIG.window);
  });

  it('should return success and limit info on rate limit check', async () => {
    const { aiTokenLimiters } = await import('@/lib/ai-limits');

    mockLimit.mockResolvedValueOnce({
      success: true,
      limit: 5000,
      remaining: 4999,
      reset: Date.now() + 1000,
      pending: Promise.resolve(),
    });

    const result = await aiTokenLimiters.free.limit('user_test_123');

    expect(mockLimit).toHaveBeenCalledWith('user_test_123');
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4999);
  });

  it('should deny the request when limit is exceeded', async () => {
    const { aiTokenLimiters } = await import('@/lib/ai-limits');

    mockLimit.mockResolvedValueOnce({
      success: false,
      limit: 5000,
      remaining: 0,
      reset: Date.now() + 1000,
      pending: Promise.resolve(),
    });

    const result = await aiTokenLimiters.free.limit('user_test_123');

    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });
});
