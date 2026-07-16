'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DraftFormInput } from '@/lib/validations/drafts';
import {
  getDrafts,
  createDraft,
  updateDraft,
  deleteDraft,
  generateDraftSummary,
  getAIModels,
} from '@/actions/drafts';
import { draftKeys } from '@/lib/query-keys';

export interface Draft {
  id: string;
  title: string;
  content: string;
  category: 'nature' | 'poetry' | 'reflection' | 'journal';
  tags: string[];
  summary: string | null;
  createdAt: string;
}
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

export function useSummarizeDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, model }: { id: string; model: string }) => {
      const res = await generateDraftSummary(id, model);
      if (!res.success || !res.summary) {
        throw new Error(res.error || 'Failed to generate summary');
      }
      return res.summary;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: draftKeys.all });
    },
  });
}

export function useAIModels() {
  return useQuery({
    queryKey: draftKeys.models(),
    queryFn: async () => {
      const res = await getAIModels();
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to fetch AI models');
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });
}
