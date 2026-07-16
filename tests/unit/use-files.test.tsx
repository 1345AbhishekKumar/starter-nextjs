import { renderHook, waitFor } from '@testing-library/react';
import { useFiles, useSyncFile, useDeleteFile } from '@/hooks/use-files';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';

// Mock Server Actions
vi.mock('@/actions/uploadcare', () => ({
  getSyncedFiles: vi.fn(() =>
    Promise.resolve({
      success: true,
      data: [
        {
          id: 1,
          fileId: 'mock-uuid',
          fileUrl: 'https://ucarecdn.com/mock-uuid/',
          fileName: 'nature.jpg',
          fileSize: 2048,
          createdAt: '2026-07-14T00:00:00.000Z',
        },
      ],
    }),
  ),
  syncUploadcareFile: vi.fn((input) =>
    Promise.resolve({
      success: true,
      data: input,
    }),
  ),
  deleteSyncedFile: vi.fn(() =>
    Promise.resolve({
      success: true,
    }),
  ),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

describe('useFiles React Query Hook', () => {
  it('fetches synced files successfully', async () => {
    const { result } = renderHook(() => useFiles(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].fileName).toBe('nature.jpg');
  });

  it('runs sync file mutation successfully', async () => {
    const { result } = renderHook(() => useSyncFile(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      fileId: 'new-uuid',
      fileUrl: 'https://ucarecdn.com/new-uuid/',
      fileName: 'forest.jpg',
      fileSize: 4096,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('runs delete file mutation successfully', async () => {
    const { result } = renderHook(() => useDeleteFile(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
