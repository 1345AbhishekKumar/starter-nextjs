import { z } from 'zod';

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(50, { message: 'Name cannot exceed 50 characters.' }),
  email: z.string().email({ message: 'Must be a valid email address.' }),
  bio: z
    .string()
    .max(200, { message: 'Bio cannot exceed 200 characters.' })
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .url({ message: 'Must be a valid URL (e.g. https://example.com).' })
    .optional()
    .or(z.literal('')),
});

export type ProfileFormInput = z.infer<typeof profileFormSchema>;
