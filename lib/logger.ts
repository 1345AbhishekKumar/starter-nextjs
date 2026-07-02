import pino from 'pino';
import * as Sentry from '@sentry/nextjs';
import posthog from 'posthog-js';

const isServer = typeof window === 'undefined';

// Set up log stream for server-side development logging
let stream;
if (isServer && process.env.NODE_ENV === 'development') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pretty = require('pino-pretty');
    stream = pretty({
      colorize: true,
      sync: true,
    });
  } catch (error) {
    console.error('Failed to initialize pino-pretty stream:', error);
  }
}

// Configure the raw Pino logger
const rawPino = pino(
  {
    level: process.env.NEXT_PUBLIC_LOG_LEVEL || 'info',
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    browser: {
      asObject: true,
      write: (o) => {
        console.log(JSON.stringify(o));
      },
    },
  },
  stream,
);

// Wrap logger methods to capture errors/warnings in Sentry and PostHog (client-side only)
function createLogFn(
  level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal',
  rawPinoFn: pino.LogFn,
): pino.LogFn {
  return ((objOrMsg: unknown, msg?: string, ...args: unknown[]) => {
    // 1. Log via raw Pino (console output on both server and client)
    rawPinoFn(objOrMsg as Record<string, unknown>, msg, ...args);

    // 2. Client-side integrations (Sentry & PostHog)
    // Note: On the server, Sentry's Pino integration automatically captures logs.
    // On the client, we manually capture exceptions and warnings.
    if (!isServer) {
      try {
        let message = '';
        let attributes: Record<string, unknown> = {};

        if (typeof objOrMsg === 'string') {
          message = objOrMsg;
          if (args && args.length > 0) {
            attributes['args'] = args;
          }
        } else if (objOrMsg && typeof objOrMsg === 'object') {
          const obj = objOrMsg as Record<string, unknown>;
          message =
            msg ||
            (obj['msg'] as string) ||
            (obj['message'] as string) ||
            'Log entry';
          attributes = { ...obj };
          if (args && args.length > 0) {
            attributes['args'] = args;
          }
          // Avoid duplicating properties in attributes
          delete attributes['msg'];
          delete attributes['message'];
        }

        if (level === 'error' || level === 'fatal') {
          const errorVal = attributes['error'] || attributes['err'];
          const errorObject =
            errorVal instanceof Error ? errorVal : new Error(message);

          // Sentry capture
          Sentry.captureException(errorObject, {
            extra: attributes,
            level: level === 'fatal' ? 'fatal' : 'error',
          });

          // PostHog capture
          posthog.capture('$exception', {
            message: errorObject.message,
            stack: errorObject.stack,
            ...attributes,
          });
        } else if (level === 'warn') {
          Sentry.captureMessage(message, {
            level: 'warning',
            extra: attributes,
          });
        }
      } catch {
        // Prevent logging failures from throwing exceptions in application runtime
      }
    }
  }) as pino.LogFn;
}

// Wrap logger methods to preserve the exact same Pino logger interface
export const logger = {
  trace: createLogFn('trace', rawPino.trace.bind(rawPino)),
  debug: createLogFn('debug', rawPino.debug.bind(rawPino)),
  info: createLogFn('info', rawPino.info.bind(rawPino)),
  warn: createLogFn('warn', rawPino.warn.bind(rawPino)),
  error: createLogFn('error', rawPino.error.bind(rawPino)),
  fatal: createLogFn('fatal', rawPino.fatal.bind(rawPino)),
};

// Safe helper to invoke after() and force flush Sentry logs in Next.js Server Components, API routes or Server Actions
export function flushLogsAfterResponse() {
  if (isServer) {
    try {
      // Dynamically import next/server to prevent client-side build errors
      import('next/server')
        .then(({ after }) => {
          after(async () => {
            await Sentry.flush(2000);
          });
        })
        .catch(() => {});
    } catch {
      // Fail silently if called outside a Next.js request lifecycle
    }
  }
}
