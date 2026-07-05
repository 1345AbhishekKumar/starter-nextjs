import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/actions/email';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).default('there'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const result = emailSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Invalid email or name parameters',
          details: result.error.format(),
        },
        { status: 400 },
      );
    }

    const { email, name } = result.data;
    logger.info({ email, name }, 'API call received to send test email');

    const res = await sendWelcomeEmail(email, name);

    return NextResponse.json({ success: true, data: res.data });
  } catch (error) {
    logger.error({ error }, 'Failed to send test email via API');
    Sentry.captureException(error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}
