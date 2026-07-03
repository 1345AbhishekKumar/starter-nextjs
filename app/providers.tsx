'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from '@posthog/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { useState } from 'react';
import { PreferencesSync } from '@/components/settings/PreferencesSync';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <PHProvider client={posthog}>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <PreferencesSync>{children}</PreferencesSync>
        </NuqsAdapter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </PHProvider>
  );
}
