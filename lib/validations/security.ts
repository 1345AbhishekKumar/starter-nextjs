import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: 'Your password must contain 8 or more characters.' }),
    confirmPassword: z.string(),
    signOutOthers: z.boolean(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
