import { z } from 'zod';

export const chatMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(4000, 'Message is too long'),
  createdAt: z.string().optional(),
});

export const aiChatInputSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, { message: 'Message cannot be empty' })
    .max(2000, { message: 'Message is too long (max 2000 characters)' }),
  modelId: z.string().default('nvidia/moonshotai/kimi-k2.6'),
  history: z.array(chatMessageSchema).optional().default([]),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type AIChatInput = z.infer<typeof aiChatInputSchema>;
