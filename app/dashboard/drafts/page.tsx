import React from 'react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { getDrafts, getAIModels } from '@/actions/drafts';
import { draftKeys } from '@/lib/query-keys';
import { DraftsPageClient } from '@/components/drafts/DraftsPageClient';

type SearchParams = Promise<{
  search?: string;
  category?: string;
  page?: string;
}>;

interface Props {
  searchParams: SearchParams;
}

export default async function DraftsPage({ searchParams }: Props) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const { search = '', category = 'all', page = '1' } = await searchParams;
  const pageNumber = parseInt(page, 10) || 1;

  const queryClient = new QueryClient();

  // Prefetch AI models
  await queryClient.prefetchQuery({
    queryKey: draftKeys.models(),
    queryFn: async () => {
      const res = await getAIModels();
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to fetch AI models');
      }
      return res.data;
    },
  });

  // Prefetch active list of drafts based on dynamic search params
  await queryClient.prefetchQuery({
    queryKey: draftKeys.list({
      search,
      category,
      page: pageNumber,
    }),
    queryFn: async () => {
      const res = await getDrafts({
        search,
        category,
        page: pageNumber,
        pageSize: 2,
      });
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to fetch drafts');
      }
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <React.Suspense
        fallback={
          <div className='relative flex min-h-screen flex-col bg-[#f9f8f6] px-6 py-12 md:py-20'>
            <div className='paper-texture'></div>
            <div className='relative z-10 mx-auto flex min-h-[50vh] w-full max-w-[1100px] items-center justify-center'>
              <Loader2 className='animate-spin text-[#6e9c4e]' size={32} />
            </div>
          </div>
        }
      >
        <DraftsPageClient />
      </React.Suspense>
    </HydrationBoundary>
  );
}
