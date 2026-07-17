import { type AIModel } from './interface';

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
