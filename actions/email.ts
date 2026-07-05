'use server';

import { resend } from '@/lib/resend';
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { logger } from '@/lib/logger';
import * as React from 'react';

/**
 * Sends a welcome email to the specified user address.
 * Uses Resend transaction email API.
 */
export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const fromAddress = process.env.NEXT_PUBLIC_APP_NAME
      ? `${process.env.NEXT_PUBLIC_APP_NAME} <onboarding@resend.dev>`
      : 'Starter App <onboarding@resend.dev>';

    logger.info({ email, name }, 'Attempting to send welcome email');

    // Create the email component dynamically
    const welcomeReactElement = React.createElement(WelcomeEmail, { name });

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: 'Welcome to our platform!',
      react: welcomeReactElement,
    });

    if (error) {
      logger.error({ error, email }, 'Failed to send welcome email via Resend');
      throw new Error(error.message);
    }

    logger.info(
      { id: data?.id, email },
      'Welcome email sent successfully via Resend',
    );
    return { success: true, data };
  } catch (error) {
    logger.error({ error, email }, 'Unhandled exception in sendWelcomeEmail');
    throw error;
  }
}
