import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { notificationRepository } from '@/lib/notifications/repository';
import { createNotification } from '@/lib/notifications/service';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

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
    const readStatus = searchParams.get('readStatus') as
      'all' | 'unread' | 'read' | null;
    const archivedStatus = searchParams.get('archivedStatus') as
      'active' | 'archived' | 'all' | null;
    const priority = searchParams.get('priority') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit')
      ? Number(searchParams.get('limit'))
      : undefined;
    const offset = searchParams.get('offset')
      ? Number(searchParams.get('offset'))
      : undefined;
    const cursor = searchParams.get('cursor') || undefined;

    const result = await notificationRepository.findMany({
      userId,
      readStatus: readStatus || 'all',
      archivedStatus: archivedStatus || 'active',
      priority,
      search,
      limit,
      offset,
      cursor,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
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

    const body = await req.json();
    // Enforce userId matches the authenticated session user
    const result = await createNotification({
      ...body,
      userId,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
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
