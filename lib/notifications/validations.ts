import { z } from 'zod';
import { DEFAULT_PAGE_SIZE } from '@/lib/utils';

export const getNotificationsFiltersSchema = z.object({
  readStatus: z.enum(['all', 'unread', 'read']).default('all'),
  archivedStatus: z.enum(['active', 'archived', 'all']).default('active'),
  priority: z.string().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).default(DEFAULT_PAGE_SIZE),
  offset: z.coerce.number().int().nonnegative().optional(),
  cursor: z.string().optional(),
});
