import type { Metadata, Viewport } from 'next';
import { Inter, Caveat, Space_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'Starter Kit',
    template: '%s | Starter Kit',
  },
  description:
    'A premium Next.js starter kit with pre-configured authentication, styling, database, and custom animations.',
  keywords: [
    'nextjs',
    'starter kit',
    'boilerplate',
    'template',
    'auth',
    'database',
    'tailwindcss',
  ],
  authors: [{ name: 'Starter Kit Team' }],
  creator: 'Starter Kit',
  publisher: 'Starter Kit',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://starterkit.app',
  ),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Starter Kit',
    description:
      'A premium Next.js starter kit with pre-configured authentication, styling, database, and custom animations.',
    siteName: 'Starter Kit',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Starter Kit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Starter Kit',
    description:
      'A premium Next.js starter kit with pre-configured authentication, styling, database, and custom animations.',
    images: ['/og-image.png'],
    creator: '@starterkit',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={`${inter.variable} ${caveat.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body className='min-h-screen antialiased' suppressHydrationWarning>
        <ClerkProvider>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
