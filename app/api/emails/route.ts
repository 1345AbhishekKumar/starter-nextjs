import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { getUserRole } from '@/lib/users';

const emailSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const role = await getUserRole(userId);
    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const result = emailSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid parameters',
          details: result.error.format(),
        },
        { status: 400 },
      );
    }

    const { email, name } = result.data;
    await sendWelcomeEmail(email, name);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(
      { error, path: '/api/emails' },
      'Unhandled exception in emails route handler',
    );
    Sentry.captureException(error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}
