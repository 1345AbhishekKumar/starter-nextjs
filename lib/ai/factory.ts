import { type AIService } from './interface';
import { LiveAIService } from './live-adapter';
import { FakeAIService } from './fake-adapter';

let cachedAIService: AIService | null = null;

/**
 * Returns the configured AIService implementation (seam registry).
 * Auto-injects FakeAIService in test environments or when explicitly configured.
 */
export function getAIService(): AIService {
  if (cachedAIService) {
    return cachedAIService;
  }

  const isTest = process.env.NODE_ENV === 'test';
  const forceMock = process.env.NEXT_PUBLIC_USE_MOCK_AI === 'true';

  if (isTest || forceMock) {
    cachedAIService = new FakeAIService();
  } else {
    cachedAIService = new LiveAIService();
  }

  return cachedAIService;
}

/**
 * Allows manual injection/override of the active AIService (primarily for testing).
 */
export function setAIService(service: AIService | null): void {
  cachedAIService = service;
}
