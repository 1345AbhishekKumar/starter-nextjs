import { NextResponse } from 'next/server';
import { getLoggerProvider } from '@/instrumentation';
import { SeverityNumber } from '@opentelemetry/api-logs';
import { after } from 'next/server';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

export async function GET() {
  try {
    const loggerProvider = await getLoggerProvider();
    const otelLogger = loggerProvider.getLogger('nextjs-kit');

    otelLogger.emit({
      body: 'Test log from Next.js server',
      severityNumber: SeverityNumber.INFO,
      attributes: {
        endpoint: '/api/test-logs',
        method: 'GET',
        timestamp: new Date().toISOString(),
      },
    });

    // Ensure logs are flushed before the serverless function freezes
    after(async () => {
      try {
        await loggerProvider.forceFlush();
      } catch (err) {
        logger.error({ error: err }, 'Failed to flush OpenTelemetry logs');
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Log emitted and scheduled to flush',
    });
  } catch (error) {
    logger.error({ error, path: '/api/test-logs' }, 'Failed to emit test log');
    Sentry.captureException(error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
