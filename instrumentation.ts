import * as Sentry from '@sentry/nextjs';
import type { LoggerProvider } from '@opentelemetry/sdk-logs';

let loggerProviderInstance: LoggerProvider | null = null;

export async function getLoggerProvider(): Promise<LoggerProvider> {
  if (loggerProviderInstance) return loggerProviderInstance;

  const { LoggerProvider: LP, BatchLogRecordProcessor } =
    await import('@opentelemetry/sdk-logs');
  const { OTLPLogExporter } =
    await import('@opentelemetry/exporter-logs-otlp-http');
  const { resourceFromAttributes } = await import('@opentelemetry/resources');

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost =
    process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

  const processors = [];

  if (posthogKey) {
    const baseUrl = posthogHost.replace(/\/$/, '');
    processors.push(
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${baseUrl}/i/v1/logs?token=${posthogKey}`,
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ),
    );
  }

  loggerProviderInstance = new LP({
    resource: resourceFromAttributes({ 'service.name': 'nextjs-kit' }),
    processors,
  });

  return loggerProviderInstance;
}

export async function register() {
  // Validate environment variables on startup
  await import('./config');

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');

    try {
      const { logs } = await import('@opentelemetry/api-logs');
      const provider = await getLoggerProvider();
      logs.setGlobalLoggerProvider(provider);
    } catch (e) {
      console.error('Failed to initialize OpenTelemetry LoggerProvider:', e);
    }
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
