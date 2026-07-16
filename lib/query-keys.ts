export const draftKeys = {
  all: ['drafts'] as const,
  lists: () => [...draftKeys.all, 'list'] as const,
  list: (filters: { search: string; category: string; page: number }) =>
    [...draftKeys.lists(), filters] as const,
  models: () => [...draftKeys.all, 'models'] as const,
};
