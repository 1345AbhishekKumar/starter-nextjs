import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  cacheComponents: true,
  allowedDevOrigins: ['closing-upward-mite.ngrok-free.app'],
  serverExternalPackages: ['pino', 'arcjet', '@arcjet/next'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ucarecdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.ucarecdn.net',
      },
    ],
  },

  async headers() {
    const csp = `
      default-src 'self';

      script-src
        'self'
        ${isDev ? "'unsafe-eval' 'unsafe-inline'" : "'unsafe-inline'"}
        https://*.clerk.com
        https://*.clerk.accounts.dev
        https://*.posthog.com
        https://us-assets.i.posthog.com;

      style-src
        'self'
        'unsafe-inline';

      img-src
        'self'
        data:
        blob:
        https:
        https://img.clerk.com;

      font-src
        'self'
        data:;

      connect-src
        'self'
        https://*.clerk.com
        https://*.clerk.accounts.dev
        https://*.posthog.com
        https://us-assets.i.posthog.com
        https://app.posthog.com
        https://upload.uploadcare.com
        https://*.uploadcare.com
        https://*.ucarecdn.com
        https://*.ucarecdn.net
        ${isDev ? 'ws://localhost:* ws://127.0.0.1:*' : ''};

      frame-src
        'self'
        https://*.clerk.com
        https://*.clerk.accounts.dev;

      worker-src
        'self'
        blob:;

      media-src
        'self';

      object-src
        'none';

      base-uri
        'self';

      form-action
        'self';

      frame-ancestors
        'none';

      manifest-src
        'self';

      upgrade-insecure-requests;
    `
      .replace(/\s{2,}/g, ' ')
      .trim();

    const headers = [
      {
        key: 'Content-Security-Policy',
        value: csp,
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Cross-Origin-Opener-Policy',
        value: 'same-origin-allow-popups',
      },
      {
        key: 'Cross-Origin-Resource-Policy',
        value: 'same-site',
      },
      {
        key: 'Permissions-Policy',
        value:
          'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
    ];

    if (!isDev) {
      headers.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      });
    }

    return [
      {
        source: '/:path*',
        headers,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'starter-gn',

  project: 'nextjs-kit',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: '/monitoring',

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
