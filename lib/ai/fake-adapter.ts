import { type AIModel, type AIService } from './interface';

export class FakeAIService implements AIService {
  async getAvailableModels(): Promise<AIModel[]> {
    return [
      {
        id: 'gemini/gemini-1.5-flash',
        name: 'Mock Gemini 1.5 Flash',
        provider: 'gemini',
      },
      {
        id: 'nvidia/meta/llama-3.1-8b-instruct',
        name: 'Mock Llama 3.1 8B',
        provider: 'nvidia',
      },
    ];
  }

  async summarize(params: {
    content: string;
    modelId: string;
    userId: string;
    isPro: boolean;
  }): Promise<
    { success: true; summary: string } | { success: false; error: string }
  > {
    if (!params.content.trim()) {
      return { success: false, error: 'Content cannot be empty' };
    }

    const excerpt =
      params.content.length > 30
        ? params.content.substring(0, 30) + '...'
        : params.content;

    return {
      success: true,
      summary: `A warm and thoughtful summary of: "${excerpt}" generated using ${params.modelId}.`,
    };
  }
}
