'use server';

import { auth } from '@clerk/nextjs/server';
import { aiChatInputSchema, type AIChatInput } from '@/lib/validations/ai-chat';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';
import { generateText } from 'ai';
import { serverEnv } from '@/config/env.server';

export type AIChatResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function sendAIChatMessage(
  input: AIChatInput,
): Promise<AIChatResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized. Please sign in.' };
    }

    const validated = aiChatInputSchema.parse(input);
    const { message, modelId, history } = validated;

    // Resolve provider & model identifier
    let provider: 'nvidia' | 'openrouter' | 'gemini' = 'nvidia';
    let cleanModelId = modelId;

    if (modelId.startsWith('nvidia/')) {
      provider = 'nvidia';
      cleanModelId = modelId.slice('nvidia/'.length);
    } else if (modelId.startsWith('openrouter/')) {
      provider = 'openrouter';
      cleanModelId = modelId.slice('openrouter/'.length);
    } else if (modelId.startsWith('gemini/')) {
      provider = 'gemini';
      cleanModelId = modelId.slice('gemini/'.length);
    }

    let modelInstance;
    if (provider === 'nvidia') {
      const apiKey = serverEnv.NVIDIA_API_KEY;
      if (!apiKey) throw new Error('NVIDIA_API_KEY is not configured.');
      const { createOpenAI } = await import('@ai-sdk/openai');
      const nvidia = createOpenAI({
        baseURL: 'https://integrate.api.nvidia.com/v1',
        apiKey,
      });
      modelInstance = nvidia(cleanModelId);
    } else if (provider === 'openrouter') {
      const apiKey = serverEnv.OPENROUTER_API_KEY;
      if (!apiKey) throw new Error('OPENROUTER_API_KEY is not configured.');
      const { createOpenAI } = await import('@ai-sdk/openai');
      const openrouter = createOpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey,
      });
      modelInstance = openrouter(cleanModelId);
    } else if (provider === 'gemini') {
      const apiKey = serverEnv.GEMINI_API_KEY;
      if (!apiKey) throw new Error('GEMINI_API_KEY is not configured.');
      const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
      const gemini = createGoogleGenerativeAI({ apiKey });
      modelInstance = gemini(cleanModelId);
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    // Format conversation history for LLM messages
    const formattedMessages = (history || []).map((msg) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    }));

    formattedMessages.push({ role: 'user', content: message });

    const { text } = await generateText({
      model: modelInstance,
      system:
        'You are Meadow AI Assistant, an intelligent, helpful, and concise AI assistant built into the Meadow web app. Provide clear, well-structured, and helpful answers.',
      messages: formattedMessages,
      maxOutputTokens: 600,
      temperature: 0.7,
    });

    const aiMessage = text?.trim();
    if (!aiMessage) {
      return {
        success: false,
        error: 'No response received from the AI model.',
      };
    }

    return { success: true, message: aiMessage };
  } catch (error) {
    logger.error({ error }, 'Error in sendAIChatMessage Server Action');
    Sentry.captureException(error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected AI error occurred.',
    };
  }
}
