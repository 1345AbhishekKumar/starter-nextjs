'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSyncedFiles,
  syncUploadcareFile,
  deleteSyncedFile,
} from '@/actions/uploadcare';

export interface SyncedFile {
  id: number;
  fileId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
}

export const fileKeys = {
  all: ['synced-files'] as const,
  lists: () => [...fileKeys.all, 'list'] as const,
};

export function useFiles() {
  return useQuery({
    queryKey: fileKeys.lists(),
    queryFn: async () => {
      const res = await getSyncedFiles();
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to fetch files');
      }
      return res.data as SyncedFile[];
    },
    staleTime: 10 * 1000, // 10 seconds stale time
  });
}

export function useSyncFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      fileId: string;
      fileUrl: string;
      fileName: string;
      fileSize: number;
    }) => {
      const res = await syncUploadcareFile(input);
      if (!res.success) {
        throw new Error(res.error || 'Failed to sync file');
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.all });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteSyncedFile(id);
      if (!res.success) {
        throw new Error(res.error || 'Failed to delete file');
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.all });
    },
  });
}
