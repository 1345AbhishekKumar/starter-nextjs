import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the environment config first to prevent validation errors
vi.mock('@/config/env.server', () => ({
  serverEnv: {
    ARCJET_KEY: 'ajkey_test_123',
  },
}));

// Create a mock for Arcjet implementation to test client configuration
const mockProtect = vi.fn();
const mockWithRule = vi.fn().mockReturnValue({
  protect: mockProtect,
});

vi.mock('@arcjet/next', async () => {
  return {
    default: vi.fn().mockImplementation((config) => ({
      config,
      withRule: mockWithRule,
    })),
    shield: vi.fn().mockImplementation((opts) => ({ type: 'shield', ...opts })),
    detectBot: vi
      .fn()
      .mockImplementation((opts) => ({ type: 'detectBot', ...opts })),
    tokenBucket: vi
      .fn()
      .mockImplementation((opts) => ({ type: 'tokenBucket', ...opts })),
  };
});

describe('Arcjet Client Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize Arcjet with correct config and key', async () => {
    const { arcjetClient } = await import('@/lib/arcjet');
    expect(arcjetClient).toBeDefined();

    // Check if the mock constructor was called
    const { default: arcjet } = await import('@arcjet/next');
    expect(arcjet).toHaveBeenCalled();

    const config = (
      arcjet as unknown as {
        mock: {
          results: Array<{
            value: {
              config: {
                key: string;
                rules: unknown[];
              };
            };
          }>;
        };
      }
    ).mock.results[0].value.config;
    expect(config.key).toBe('ajkey_test_123');
    expect(config.rules).toBeDefined();
    expect(config.rules.length).toBe(2);
  });

  it('should correctly build custom rule interfaces via withRule', async () => {
    const { arcjetClient } = await import('@/lib/arcjet');
    const { tokenBucket } = await import('@arcjet/next');

    const customRule = tokenBucket({
      mode: 'LIVE',
      refillRate: 10,
      interval: 60,
      capacity: 20,
    });

    const derivedClient = arcjetClient.withRule(customRule);
    expect(arcjetClient.withRule).toHaveBeenCalledWith(customRule);
    expect(derivedClient).toBeDefined();
    expect(derivedClient.protect).toBeDefined();
  });

  it('should correctly allow requests when isDenied is false', async () => {
    const { arcjetClient } = await import('@/lib/arcjet');
    const customRule = {};
    const derivedClient = arcjetClient.withRule(customRule);

    mockProtect.mockResolvedValueOnce({
      isDenied: () => false,
      reason: {
        isRateLimit: () => false,
        isBot: () => false,
      },
    });

    const decision = await derivedClient.protect(
      new Request('http://localhost'),
    );
    expect(decision.isDenied()).toBe(false);
  });

  it('should correctly flag rate limits when denied with rate limit reason', async () => {
    const { arcjetClient } = await import('@/lib/arcjet');
    const customRule = {};
    const derivedClient = arcjetClient.withRule(customRule);

    mockProtect.mockResolvedValueOnce({
      isDenied: () => true,
      reason: {
        isRateLimit: () => true,
        isBot: () => false,
      },
    });

    const decision = await derivedClient.protect(
      new Request('http://localhost'),
    );
    expect(decision.isDenied()).toBe(true);
    expect(decision.reason.isRateLimit()).toBe(true);
  });
});
