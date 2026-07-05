import { z } from 'zod';

export const draftCategories = [
  'nature',
  'poetry',
  'reflection',
  'journal',
] as const;
export type DraftCategory = (typeof draftCategories)[number];

export const draftFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long.' })
    .max(100, { message: 'Title cannot exceed 100 characters.' }),
  content: z
    .string()
    .min(10, { message: 'Content must be at least 10 characters long.' })
    .max(5000, { message: 'Content cannot exceed 5000 characters.' }),
  category: z.enum(draftCategories, {
    message: 'Please select a valid category.',
  }),
  tags: z
    .array(z.string().min(1))
    .max(5, { message: 'You can add up to 5 tags.' }),
});

export type DraftFormInput = z.infer<typeof draftFormSchema>;

export const draftFiltersSchema = z.object({
  search: z.string().default(''),
  category: z.string().default('all'),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).default(2).optional(),
});

export type DraftFiltersInput = z.infer<typeof draftFiltersSchema>;
