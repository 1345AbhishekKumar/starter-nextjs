'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DraftFormInput } from '@/lib/validations/drafts';
import {
  getDrafts,
  createDraft,
  updateDraft,
  deleteDraft,
} from '@/actions/drafts';

export interface Draft {
  id: string;
  title: string;
  content: string;
  category: 'nature' | 'poetry' | 'reflection' | 'journal';
  tags: string[];
  createdAt: string;
}

// Query Key Factory
export const draftKeys = {
  all: ['drafts'] as const,
  lists: () => [...draftKeys.all, 'list'] as const,
  list: (filters: { search: string; category: string; page: number }) =>
    [...draftKeys.lists(), filters] as const,
};

// Custom hooks for TanStack Query
export function useDrafts(filters: {
  search: string;
  category: string;
  page: number;
  pageSize?: number;
}) {
  const pageSize = filters.pageSize || 2; // small default size to test pagination

  return useQuery({
    queryKey: draftKeys.list({
      search: filters.search,
      category: filters.category,
      page: filters.page,
    }),
    queryFn: async () => {
      const res = await getDrafts({
        search: filters.search,
        category: filters.category,
        page: filters.page,
        pageSize,
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to fetch drafts');
      }

      return res.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useCreateDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DraftFormInput) => {
      const res = await createDraft(input);
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to create draft');
      }
      return res.data;
    },
    onSuccess: () => {
      // Invalidate all draft queries to refresh the lists automatically
      queryClient.invalidateQueries({ queryKey: draftKeys.all });
    },
  });
}

export function useUpdateDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: DraftFormInput;
    }) => {
      const res = await updateDraft(id, input);
      if (!res.success) {
        throw new Error(res.error || 'Failed to update draft');
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: draftKeys.all });
    },
  });
}

export function useDeleteDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteDraft(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete draft');
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: draftKeys.all });
    },
  });
}
