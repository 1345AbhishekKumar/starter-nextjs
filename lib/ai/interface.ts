export interface AIModel {
  id: string; // e.g., "nvidia/meta/llama-3.1-8b-instruct" or "gemini/gemini-1.5-flash"
  name: string;
  provider: 'nvidia' | 'openrouter' | 'gemini';
}

export interface AIService {
  /**
   * Generates a warm, thoughtful 1-2 sentence summary of draft content.
   * Performs internal rate-limiting and token checks.
   */
  summarize(params: {
    content: string;
    modelId: string;
    userId: string;
    isPro: boolean;
  }): Promise<
    { success: true; summary: string } | { success: false; error: string }
  >;

  /**
   * Dynamically fetches and consolidates available models from all configured API providers.
   */
  getAvailableModels(): Promise<AIModel[]>;
}
