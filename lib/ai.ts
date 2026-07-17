export * from './ai/interface';
export * from './ai/factory';
export {
  NVIDIA_FALLBACK_MODELS,
  OPENROUTER_FALLBACK_MODELS,
  GEMINI_FALLBACK_MODELS,
} from './ai/models';

import { getAIService } from './ai/factory';
import { type AIModel } from './ai/interface';

/**
 * Backwards compatibility wrapper for fetchAIModels.
 */
export async function fetchAIModels(): Promise<AIModel[]> {
  const service = getAIService();
  return service.getAvailableModels();
}

/**
 * Backwards compatibility wrapper for generateSummary.
 */
export async function generateSummary(
  content: string,
  modelId: string,
  userId: string = 'system',
  isPro: boolean = false,
): Promise<string> {
  const service = getAIService();
  const res = await service.summarize({ content, modelId, userId, isPro });
  if (!res.success) {
    throw new Error(res.error);
  }
  return res.summary;
}
