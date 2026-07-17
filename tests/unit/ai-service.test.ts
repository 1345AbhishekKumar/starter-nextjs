import { describe, it, expect, vi } from 'vitest';
import { FakeAIService } from '@/lib/ai/fake-adapter';
import { getAIService } from '@/lib/ai/factory';
import { generateDraftSummary } from '@/actions/drafts';

// Mock dependency imports for server action execution
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => Promise.resolve({ userId: 'user_123' }),
}));

vi.mock('@arcjet/next', () => ({
  request: () => Promise.resolve({}),
  tokenBucket: () => ({}),
}));

vi.mock('@/lib/arcjet', () => ({
  arcjetClient: {
    withRule: () => ({
      protect: () => Promise.resolve({ isDenied: () => false }),
    }),
  },
}));

vi.mock('@/actions/stripe', () => ({
  getSubscriptionStatus: () =>
    Promise.resolve({
      success: true,
      data: { status: 'active', isPro: true },
    }),
}));

vi.mock('next/cache', () => ({
  revalidatePath: () => {},
}));

vi.mock('@/db', () => ({
  db: {
    query: {
      posts: {
        findFirst: () =>
          Promise.resolve({
            id: 1,
            title: 'Test Draft',
            content: 'This is some evocative nature writing about meadows.',
            userId: 'user_123',
            summary: null,
          }),
      },
    },
    update: () => ({
      set: () => ({
        where: () => Promise.resolve([{ id: 1 }]),
      }),
    }),
  },
}));

describe('AIService Seam & Fake Adapter', () => {
  it('should summarize text correctly using the FakeAIService', async () => {
    const service = new FakeAIService();
    const result = await service.summarize({
      content: 'This is a test content that needs a warm reflection.',
      modelId: 'gemini/gemini-1.5-flash',
      userId: 'user_123',
      isPro: false,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.summary).toContain(
        'A warm and thoughtful summary of: "This is a test content that ne..."',
      );
      expect(result.summary).toContain('gemini/gemini-1.5-flash');
    }
  });

  it('should fail to summarize if content is empty', async () => {
    const service = new FakeAIService();
    const result = await service.summarize({
      content: '   ',
      modelId: 'gemini/gemini-1.5-flash',
      userId: 'user_123',
      isPro: false,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Content cannot be empty');
    }
  });

  it('should return mock models from getAvailableModels', async () => {
    const service = new FakeAIService();
    const models = await service.getAvailableModels();
    expect(models).toHaveLength(2);
    expect(models[0].provider).toBe('gemini');
  });

  it('should return FakeAIService from getAIService() factory in test environment', () => {
    const service = getAIService();
    expect(service).toBeInstanceOf(FakeAIService);
  });
});

describe('generateDraftSummary Server Action', () => {
  it('should execute successfully when using the injected FakeAIService', async () => {
    const fakeService = new FakeAIService();
    const response = await generateDraftSummary(
      '1',
      'gemini/gemini-1.5-flash',
      fakeService,
    );

    expect(response.success).toBe(true);
    if (response.success) {
      expect(response.summary).toContain(
        'A warm and thoughtful summary of: "This is some evocative nature ..."',
      );
    }
  });
});
