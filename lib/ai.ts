import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { serverEnv } from '@/config/env.server';
import { logger } from './logger';

export interface AIModel {
  id: string; // e.g., "nvidia/meta/llama-3.1-8b-instruct" or "gemini/gemini-1.5-flash"
  name: string;
  provider: 'nvidia' | 'openrouter' | 'gemini';
}

// Curated fallbacks for each provider
export const NVIDIA_FALLBACK_MODELS: readonly AIModel[] = [
  {
    id: 'nvidia/moonshotai/kimi-k2.6',
    name: 'Moonshot Kimi K2.6',
    provider: 'nvidia',
  },
  {
    id: 'nvidia/stepfun-ai/step-3.7-flash',
    name: 'Stepfun Step-3.7-Flash',
    provider: 'nvidia',
  },
  { id: 'nvidia/z-ai/glm-5.2', name: 'Z-AI GLM 5.2', provider: 'nvidia' },
  {
    id: 'nvidia/deepseek-ai/deepseek-v4-pro',
    name: 'DeepSeek v4 Pro',
    provider: 'nvidia',
  },
  {
    id: 'nvidia/meta/llama-3.1-8b-instruct',
    name: 'Meta Llama 3.1 8B',
    provider: 'nvidia',
  },
  {
    id: 'nvidia/meta/llama-3.1-70b-instruct',
    name: 'Meta Llama 3.1 70B',
    provider: 'nvidia',
  },
] as const;

export const OPENROUTER_FALLBACK_MODELS: readonly AIModel[] = [
  {
    id: 'openrouter/meta-llama/llama-3.1-70b-instruct',
    name: 'Llama 3.1 70B',
    provider: 'openrouter',
  },
  {
    id: 'openrouter/google/gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'openrouter',
  },
  {
    id: 'openrouter/anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'openrouter',
  },
  {
    id: 'openrouter/deepseek/deepseek-chat',
    name: 'DeepSeek V3',
    provider: 'openrouter',
  },
] as const;

export const GEMINI_FALLBACK_MODELS: readonly AIModel[] = [
  {
    id: 'gemini/gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'gemini',
  },
  { id: 'gemini/gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'gemini' },
  {
    id: 'gemini/gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'gemini',
  },
] as const;

/**
 * Dynamically fetches models for a single provider.
 */
async function fetchProviderModels(
  provider: 'nvidia' | 'openrouter' | 'gemini',
): Promise<AIModel[]> {
  if (provider === 'nvidia') {
    const apiKey = serverEnv.NVIDIA_API_KEY;
    if (!apiKey) return [];
    try {
      const res = await fetch('https://integrate.api.nvidia.com/v1/models', {
        method: 'GET',
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 3600 * 24 }, // Cache list for 24h
      });
      if (!res.ok) throw new Error(`NVIDIA status ${res.status}`);
      const json = (await res.json()) as { data: Array<{ id: string }> };
      if (!json.data || !Array.isArray(json.data))
        throw new Error('Invalid format');

      return json.data.map((m) => {
        const parts = m.id.split('/');
        const name =
          parts.length > 1
            ? parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
            : m.id;
        return { id: `nvidia/${m.id}`, name, provider: 'nvidia' };
      });
    } catch (error) {
      logger.error({ error }, 'Failed to fetch NVIDIA models dynamically.');
      return [...NVIDIA_FALLBACK_MODELS];
    }
  }

  if (provider === 'openrouter') {
    const apiKey = serverEnv.OPENROUTER_API_KEY;
    if (!apiKey) return [];
    try {
      const res = await fetch('https://openrouter.ai/api/v1/models', {
        method: 'GET',
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 3600 * 24 },
      });
      if (!res.ok) throw new Error(`OpenRouter status ${res.status}`);
      const json = (await res.json()) as {
        data: Array<{ id: string; name?: string }>;
      };
      if (!json.data || !Array.isArray(json.data))
        throw new Error('Invalid format');

      return json.data.map((m) => ({
        id: `openrouter/${m.id}`,
        name: m.name || m.id,
        provider: 'openrouter',
      }));
    } catch (error) {
      logger.error({ error }, 'Failed to fetch OpenRouter models dynamically.');
      return [...OPENROUTER_FALLBACK_MODELS];
    }
  }

  if (provider === 'gemini') {
    const apiKey = serverEnv.GEMINI_API_KEY;
    if (!apiKey) return [];
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
        {
          method: 'GET',
          next: { revalidate: 3600 * 24 },
        },
      );
      if (!res.ok) throw new Error(`Gemini status ${res.status}`);
      const json = (await res.json()) as {
        models: Array<{
          name: string;
          displayName?: string;
          supportedGenerationMethods: string[];
        }>;
      };
      if (!json.models || !Array.isArray(json.models))
        throw new Error('Invalid format');

      // Filter for text generation models
      const textModels = json.models.filter(
        (m) =>
          m.supportedGenerationMethods.includes('generateContent') &&
          !m.name.includes('embed') &&
          !m.name.includes('vision') &&
          !m.name.includes('bidi'),
      );

      return textModels.map((m) => {
        const id = m.name.replace(/^models\//, '');
        return {
          id: `gemini/${id}`,
          name: m.displayName || id,
          provider: 'gemini',
        };
      });
    } catch (error) {
      logger.error({ error }, 'Failed to fetch Gemini models dynamically.');
      return [...GEMINI_FALLBACK_MODELS];
    }
  }

  return [];
}

/**
 * Dynamically fetches and consolidates available models from all configured API providers.
 */
export async function fetchAIModels(): Promise<AIModel[]> {
  const providers: Array<'nvidia' | 'openrouter' | 'gemini'> = [];
  if (serverEnv.NVIDIA_API_KEY) providers.push('nvidia');
  if (serverEnv.OPENROUTER_API_KEY) providers.push('openrouter');
  if (serverEnv.GEMINI_API_KEY) providers.push('gemini');

  // If no keys configured, return all fallback configurations combined
  if (providers.length === 0) {
    return [
      ...NVIDIA_FALLBACK_MODELS,
      ...OPENROUTER_FALLBACK_MODELS,
      ...GEMINI_FALLBACK_MODELS,
    ];
  }

  const results = await Promise.allSettled(providers.map(fetchProviderModels));
  const combined: AIModel[] = [];

  results.forEach((res, index) => {
    const prov = providers[index];
    if (res.status === 'fulfilled' && res.value.length > 0) {
      combined.push(...res.value);
    } else {
      // Use fallback list for this specific failed/unconfigured provider
      if (prov === 'nvidia') combined.push(...NVIDIA_FALLBACK_MODELS);
      if (prov === 'openrouter') combined.push(...OPENROUTER_FALLBACK_MODELS);
      if (prov === 'gemini') combined.push(...GEMINI_FALLBACK_MODELS);
    }
  });

  return combined;
}

/**
 * Generates a warm, thoughtful 1-2 sentence summary of draft content using the specified model and provider.
 */
export async function generateSummary(
  content: string,
  fullModelId: string,
): Promise<string> {
  let provider: 'nvidia' | 'openrouter' | 'gemini' = 'nvidia';
  let modelId = fullModelId;

  // Extract provider and inner modelId, with backwards compatibility
  if (fullModelId.startsWith('nvidia/')) {
    provider = 'nvidia';
    modelId = fullModelId.slice('nvidia/'.length);
  } else if (fullModelId.startsWith('openrouter/')) {
    provider = 'openrouter';
    modelId = fullModelId.slice('openrouter/'.length);
  } else if (fullModelId.startsWith('gemini/')) {
    provider = 'gemini';
    modelId = fullModelId.slice('gemini/'.length);
  } else {
    // Backwards compatibility fallback (assumes raw Nvidia catalog model ID)
    provider = 'nvidia';
    modelId = fullModelId;
  }

  let modelInstance;

  if (provider === 'nvidia') {
    const apiKey = serverEnv.NVIDIA_API_KEY;
    if (!apiKey) throw new Error('NVIDIA_API_KEY is not configured.');
    const nvidia = createOpenAI({
      baseURL: 'https://integrate.api.nvidia.com/v1',
      apiKey,
    });
    modelInstance = nvidia(modelId);
  } else if (provider === 'openrouter') {
    const apiKey = serverEnv.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error('OPENROUTER_API_KEY is not configured.');
    const openrouter = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
    });
    modelInstance = openrouter(modelId);
  } else if (provider === 'gemini') {
    const apiKey = serverEnv.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured.');
    const gemini = createGoogleGenerativeAI({
      apiKey,
    });
    modelInstance = gemini(modelId);
  } else {
    throw new Error(`Unsupported provider: ${provider}`);
  }

  const { text } = await generateText({
    model: modelInstance,
    system:
      "You are a warm, thoughtful, creative writing assistant. Your task is to read the user's draft and summarize it in exactly 1 or 2 concise, evocative sentences. Maintain an organic, reflective, and poetic tone. You must output ONLY the direct summary text. Do NOT explain your reasoning, do NOT output thinking blocks, do NOT write notes or prefaces, and do NOT use markdown or code block formatting. Start directly with the summary.",
    prompt: `Draft Title: (optional)\nContent:\n${content}`,
    temperature: 0.5,
    maxOutputTokens: 150,
  });

  const summary = text?.trim();
  if (!summary) {
    throw new Error('No summary returned from the AI model');
  }

  return summary;
}
