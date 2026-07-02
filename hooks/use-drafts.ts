'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DraftFormInput } from '@/lib/validations/drafts';

export interface Draft {
  id: string;
  title: string;
  content: string;
  category: 'nature' | 'poetry' | 'reflection' | 'journal';
  tags: string[];
  createdAt: string;
}

const STORAGE_KEY = 'meadow_drafts_v1';

const INITIAL_DRAFTS: Draft[] = [
  {
    id: '1',
    title: 'Wildflowers under Dawn',
    content:
      'The quiet morning unfolds over the hills. Bright yellows and deep blues emerge in the grass, nodding gently in the cool breeze.',
    category: 'nature',
    tags: ['meadow', 'morning', 'flowers'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '2',
    title: 'Quiet Rain',
    content:
      'A soft pitter-patter on the window pane. The air smells of wet earth and dry leaves. A perfect time for coffee and reflection.',
    category: 'reflection',
    tags: ['rain', 'cozy', 'thoughts'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '3',
    title: 'Solitude in the Forest',
    content:
      'Stately pines stand like guardians of a forgotten era. Walking along the needle-soft path, one feels both tiny and infinitely connected.',
    category: 'poetry',
    tags: ['forest', 'solitude', 'pines'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: '4',
    title: 'Morning Sage Journal',
    content:
      'Brewed a warm cup of herbal tea. Sitting on the porch watching the mist clear. The garden feels alive and full of possibilities.',
    category: 'journal',
    tags: ['tea', 'mist', 'garden'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

// Helper to interact with localStorage safely on the client
function getStoredDrafts(): Draft[] {
  if (typeof window === 'undefined') return INITIAL_DRAFTS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DRAFTS));
    return INITIAL_DRAFTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_DRAFTS;
  }
}

function saveStoredDrafts(drafts: Draft[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  }
}

// Simulated API latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
      await delay(600); // Simulate network roundtrip
      const allDrafts = getStoredDrafts();

      // Apply search filter (title and content)
      let filtered = allDrafts;
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(
          (d) =>
            d.title.toLowerCase().includes(query) ||
            d.content.toLowerCase().includes(query),
        );
      }

      // Apply category filter
      if (filters.category !== 'all') {
        filtered = filtered.filter((d) => d.category === filters.category);
      }

      // Calculate total count before slicing
      const totalCount = filtered.length;

      // Sort by creation date descending
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      // Apply pagination
      const start = (filters.page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedDrafts = filtered.slice(start, end);

      return {
        drafts: paginatedDrafts,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      };
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useCreateDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DraftFormInput) => {
      await delay(800); // Simulate network write delay
      const allDrafts = getStoredDrafts();

      const newDraft: Draft = {
        id: Math.random().toString(36).substring(2, 9),
        title: input.title,
        content: input.content,
        category: input.category,
        tags: input.tags || [],
        createdAt: new Date().toISOString(),
      };

      allDrafts.push(newDraft);
      saveStoredDrafts(allDrafts);
      return newDraft;
    },
    onSuccess: () => {
      // Invalidate all draft queries to refresh the lists automatically
      queryClient.invalidateQueries({ queryKey: draftKeys.all });
    },
  });
}
