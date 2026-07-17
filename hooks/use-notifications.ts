import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import {
  getNotificationsAction,
  getUnreadCountAction,
  markAsReadAction,
  markAllAsReadAction,
  deleteNotificationAction,
  archiveNotificationAction,
} from '@/actions/notifications';
// Local placeholder toast logger to prevent import errors in the absence of a toast library
const toast = {
  error: (msg: string) => console.error(`[Toast Error]: ${msg}`),
  success: (msg: string) => console.log(`[Toast Success]: ${msg}`),
};

export interface NotificationFilters {
  readStatus?: 'all' | 'unread' | 'read';
  archivedStatus?: 'active' | 'archived' | 'all';
  priority?: string;
  search?: string;
  limit?: number;
}

export function useNotificationsQuery(filters: NotificationFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['notifications', filters],
    queryFn: async ({ pageParam }) => {
      const res = await getNotificationsAction({
        readStatus: filters.readStatus,
        archivedStatus: filters.archivedStatus,
        priority: filters.priority,
        search: filters.search,
        limit: filters.limit ?? 10,
        cursor: (pageParam as string) || undefined,
      });

      if (!res.success) {
        throw new Error(res.error);
      }

      return res.data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.notifications.length === 0) {
        return null;
      }
      // Use the createdAt ISO string of the last item as the cursor
      const lastItem =
        lastPage.notifications[lastPage.notifications.length - 1];
      return new Date(lastItem.createdAt).toISOString();
    },
  });
}

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const res = await getUnreadCountAction();
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data;
    },
    refetchInterval: 30000, // Poll every 30 seconds for simulated real-time updates
    refetchOnWindowFocus: true,
  });
}

export function useMarkAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await markAsReadAction(ids);
      if (!res.success) {
        throw new Error(res.error);
      }
      return res;
    },
    onMutate: async (ids) => {
      // Cancel outgoing queries to prevent overwrites
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      // Optimistically update unread count
      const previousCount = queryClient.getQueryData<number>([
        'notifications',
        'unread-count',
      ]);
      if (previousCount !== undefined) {
        queryClient.setQueryData(
          ['notifications', 'unread-count'],
          Math.max(0, previousCount - ids.length),
        );
      }

      return { previousCount };
    },
    onError: (err, ids, context) => {
      // Rollback
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(
          ['notifications', 'unread-count'],
          context.previousCount,
        );
      }
      toast.error('Failed to mark notification as read');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await markAllAsReadAction();
      if (!res.success) {
        throw new Error(res.error);
      }
      return res;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previousCount = queryClient.getQueryData<number>([
        'notifications',
        'unread-count',
      ]);
      queryClient.setQueryData(['notifications', 'unread-count'], 0);

      return { previousCount };
    },
    onError: (err, variables, context) => {
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(
          ['notifications', 'unread-count'],
          context.previousCount,
        );
      }
      toast.error('Failed to mark all as read');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useDeleteNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteNotificationAction(id);
      if (!res.success) {
        throw new Error(res.error);
      }
      return res;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useArchiveNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      archiveState,
    }: {
      id: string;
      archiveState: boolean;
    }) => {
      const res = await archiveNotificationAction(id, archiveState);
      if (!res.success) {
        throw new Error(res.error);
      }
      return res;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
