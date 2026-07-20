'use server';

import { resend } from '@/lib/resend';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';
import { z } from 'zod';

const sendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1),
});

export type ActionResponse<T = void> =
  { success: true; data?: T } | { success: false; error: string };

/**
 * Generic Server Action to send an email.
 * Provided for future/general use.
 */
export async function sendEmailAction(
  payload: unknown,
): Promise<ActionResponse<{ id: string }>> {
  try {
    const validated = sendEmailSchema.parse(payload);
    const fromAddress = process.env.NEXT_PUBLIC_APP_NAME
      ? `${process.env.NEXT_PUBLIC_APP_NAME} <onboarding@resend.dev>`
      : 'Starter App <onboarding@resend.dev>';

    logger.info(
      { to: validated.to, subject: validated.subject },
      'Attempting to send email via Server Action',
    );

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: validated.to,
      subject: validated.subject,
      html: validated.html,
    });

    if (error) {
      logger.error(
        { error, to: validated.to },
        'Failed to send email via Resend in Server Action',
      );
      return { success: false, error: error.message };
    }

    logger.info(
      { id: data?.id, to: validated.to },
      'Email sent successfully via Resend in Server Action',
    );
    return { success: true, data: { id: data?.id || '' } };
  } catch (error) {
    logger.error({ error }, 'Unhandled exception in sendEmailAction');
    Sentry.captureException(error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input parameters' };
    }
    return { success: false, error: 'Failed to send email' };
  }
}
