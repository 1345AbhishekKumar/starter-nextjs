import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { notificationRepository } from '@/lib/notifications/repository';
import { createNotification } from '@/lib/notifications/service';
import { createNotificationSchema } from '@/lib/notifications/service';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';
import { z } from 'zod';
import { getNotificationsFiltersSchema } from '@/lib/notifications/validations';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    const parseResult = getNotificationsFiltersSchema.safeParse(params);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: parseResult.error.format(),
        },
        { status: 400 },
      );
    }

    const result = await notificationRepository.findMany({
      userId,
      ...parseResult.data,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.format() },
        { status: 400 },
      );
    }
    logger.error(
      { error, path: '/api/notifications' },
      'Failed to fetch notifications via API route',
    );
    Sentry.captureException(error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const parseResult = createNotificationSchema
      .omit({ userId: true })
      .safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid notification payload',
          details: parseResult.error.format(),
        },
        { status: 400 },
      );
    }

    // Enforce userId matches the authenticated session user
    const result = await createNotification({
      ...parseResult.data,
      userId,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.format() },
        { status: 400 },
      );
    }
    logger.error(
      { error, path: '/api/notifications' },
      'Failed to create notification via API route',
    );
    Sentry.captureException(error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
