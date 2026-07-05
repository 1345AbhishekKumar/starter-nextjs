import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pino', 'pino-pretty'],
  allowedDevOrigins: ['closing-upward-mite.ngrok-free.app'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.ucarecdn.com',
        pathname: '/**',
      },
    ],
  },
};

// const nextConfig: NextConfig = {
//   serverExternalPackages: ['pino', 'pino-pretty'],
//   allowedDevOrigins: ['closing-upward-mite.ngrok-free.app'],
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'ucarecdn.com',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: '*.ucarecdn.com',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'ucarecdn.net',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: '*.ucarecdn.net',
//         pathname: '/**',
//       },
//     ],
//   },
//   async headers() {
//     const cspHeader = `
//       default-src 'self';
//       script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://*.clerk.accounts.dev https://*.clerk.com https://*.posthog.com https://us-assets.i.posthog.com;
//       worker-src 'self' blob:;
//       style-src 'self' 'unsafe-inline';
//       img-src 'self' data: blob: https://ucarecdn.com https://*.ucarecdn.com https://ucarecdn.net https://*.ucarecdn.net https://img.clerk.com https://images.unsplash.com https://*.posthog.com https://us-assets.i.posthog.com;
//       font-src 'self';
//       connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://*.sentry.io https://*.posthog.com https://us-assets.i.posthog.com https://ucarecdn.com https://*.ucarecdn.com https://ucarecdn.net https://*.ucarecdn.net https://upload.uploadcare.com https://*.uploadcare.com ws://localhost:* ws://127.0.0.1:* wss://closing-upward-mite.ngrok-free.app;
//       frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com;
//       media-src 'self';
//       object-src 'none';
//       base-uri 'self';
//       form-action 'self';
//     `
//       .replace(/\s{2,}/g, ' ')
//       .trim();

//     return [
//       {
//         source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
//         headers: [
//           {
//             key: 'Content-Security-Policy',
//             value: cspHeader,
//           },
//           {
//             key: 'X-Frame-Options',
//             value: 'DENY',
//           },
//           {
//             key: 'X-Content-Type-Options',
//             value: 'nosniff',
//           },
//           {
//             key: 'Referrer-Policy',
//             value: 'strict-origin-when-cross-origin',
//           },
//         ],
//       },
//     ];
//   },
// };

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
