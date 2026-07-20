import { z } from 'zod';

export const searchCategories = [
  'all',
  'drafts',
  'files',
  'notifications',
  'navigation',
] as const;

export type SearchCategory = (typeof searchCategories)[number];

export const searchQuerySchema = z.object({
  query: z
    .string()
    .trim()
    .max(100, { message: 'Search query is too long' })
    .default(''),
  category: z.enum(searchCategories).default('all'),
  limit: z.number().int().min(1).max(50).default(20),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
