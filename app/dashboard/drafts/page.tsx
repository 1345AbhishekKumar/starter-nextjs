'use client';
/* eslint-disable tailwindcss/no-custom-classname */

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import {
  PenTool,
  Search,
  Folder,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  Loader2,
  BookOpen,
  Hash,
  Edit,
  Trash2,
} from 'lucide-react';

import { useUIStore } from '@/store/ui';
import {
  draftFormSchema,
  type DraftFormInput,
  draftCategories,
} from '@/lib/validations/drafts';
import {
  useDrafts,
  useCreateDraft,
  useUpdateDraft,
  useDeleteDraft,
  type Draft,
} from '@/hooks/use-drafts';

function DraftsPageContent() {
  // Zustand UI Store state and actions
  const isCreateDialogOpen = useUIStore((state) => state.isCreateDialogOpen);
  const setCreateDialogOpen = useUIStore((state) => state.setCreateDialogOpen);

  // Edit and delete state / hooks
  const [editingDraft, setEditingDraft] = React.useState<Draft | null>(null);
  const updateDraftMutation = useUpdateDraft();
  const deleteDraftMutation = useDeleteDraft();

  const isFormOpen = isCreateDialogOpen || !!editingDraft;

  // nuqs URL State Configuration
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault(''),
  );
  const [category, setCategory] = useQueryState(
    'category',
    parseAsString.withDefault('all'),
  );
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  // TanStack Query custom hooks
  const { data, isLoading, isPlaceholderData } = useDrafts({
    search,
    category,
    page,
    pageSize: 2, // 2 items per page to showcase pagination easily
  });

  const createDraftMutation = useCreateDraft();

  // React Hook Form + Zod Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DraftFormInput>({
    resolver: zodResolver(draftFormSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'nature',
      tags: [],
    },
  });

  const [tagInput, setTagInput] = React.useState('');
  const [tagsList, setTagsList] = React.useState<string[]>([]);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Tag helpers
  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tagsList.includes(trimmed) && tagsList.length < 5) {
      const updated = [...tagsList, trimmed];
      setTagsList(updated);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTagsList(tagsList.filter((t) => t !== tagToRemove));
  };

  // Reset form when editingDraft changes
  React.useEffect(() => {
    if (editingDraft) {
      reset({
        title: editingDraft.title,
        content: editingDraft.content,
        category: editingDraft.category,
        tags: editingDraft.tags,
      });
    } else {
      reset({
        title: '',
        content: '',
        category: 'nature',
        tags: [],
      });
    }
  }, [editingDraft, reset]);

  const handleCloseForm = () => {
    setCreateDialogOpen(false);
    setEditingDraft(null);
    reset();
    setTagsList([]);
    setFormError(null);
  };

  const handleFormSubmit = async (values: DraftFormInput) => {
    setFormError(null);
    try {
      if (editingDraft) {
        await updateDraftMutation.mutateAsync({
          id: editingDraft.id,
          input: {
            ...values,
            tags: tagsList,
          },
        });
        setEditingDraft(null);
      } else {
        await createDraftMutation.mutateAsync({
          ...values,
          tags: tagsList,
        });
        setCreateDialogOpen(false);
      }
      // Reset form on success
      reset();
      setTagsList([]);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save draft');
    }
  };

  const handleDeleteDraft = async (id: string) => {
    if (
      confirm('Are you sure you want to return this creation to the earth?')
    ) {
      try {
        await deleteDraftMutation.mutateAsync(id);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete draft');
      }
    }
  };

  // Category change helper
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1); // Reset page on category change
  };

  return (
    <div className='relative flex min-h-screen flex-col bg-[#f9f8f6] px-6 py-12 md:py-20'>
      {/* Paper texture overlay */}
      <div className='paper-texture'></div>

      <div className='relative z-10 mx-auto w-full max-w-275'>
        {/* Header navigation bar */}
        <header className='mb-12 flex items-center justify-between'>
          <Link
            href='/dashboard'
            className='flex items-center gap-2 text-[#525252] transition-colors hover:text-[#111111]'
          >
            <ArrowLeft size={16} />
            <span className='font-mono-custom text-xs tracking-wider uppercase'>
              Back to Dashboard
            </span>
          </Link>

          <div className='font-mono-custom text-xs tracking-widest text-[#6e9c4e] uppercase'>
            Slow Writing Space
          </div>
        </header>

        {/* Page Title */}
        <div className='mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end'>
          <div>
            <p className='font-mono-custom mb-2 text-[11px] tracking-[0.2em] text-[#6e9c4e] uppercase'>
              Creative Studio
            </p>
            <h1 className='font-handwritten text-5xl font-normal text-[#111111] md:text-6xl'>
              My Drafts.
            </h1>
            <p className='font-mono-custom mt-4 max-w-md text-[13px] leading-relaxed tracking-wider text-[#525252]'>
              A sanctuary for raw thoughts and unrefined prose. Take all the
              time you need.
            </p>
          </div>

          {!isFormOpen && (
            <button
              onClick={() => {
                setEditingDraft(null);
                setCreateDialogOpen(true);
                setTagsList([]);
                setFormError(null);
              }}
              className='magnetic-btn font-mono-custom flex items-center gap-2 bg-[#111111] px-6 py-3.5 text-xs tracking-wider text-white uppercase hover:opacity-90'
            >
              <Plus size={14} />
              Sow New Draft
            </button>
          )}
        </div>

        {/* Core Layout: Grid or Columns */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          {/* Filters Column (Left 1 Span) */}
          <div className='space-y-6 md:col-span-1'>
            {/* Search Bento */}
            <div className='bento-cell p-6'>
              <h3 className='font-mono-custom mb-3 text-xs tracking-wider text-[#111111] uppercase'>
                Filter & Search
              </h3>
              <div className='relative'>
                <input
                  type='text'
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1); // Reset page on query change
                  }}
                  placeholder='Search words...'
                  className='font-mono-custom w-full rounded-full border border-[#111111]/10 bg-white/80 px-4 py-2.5 pl-10 text-xs tracking-wide text-[#111111] transition-colors outline-none focus:border-[#111111]/30'
                />
                <Search
                  size={14}
                  className='absolute top-3.5 left-4 text-[#525252]/60'
                />
              </div>
            </div>

            {/* Category selection list */}
            <div className='bento-cell p-6'>
              <h3 className='font-mono-custom mb-4 text-xs tracking-wider text-[#111111] uppercase'>
                Meadow Categories
              </h3>
              <div className='flex flex-wrap gap-2 md:flex-col'>
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`font-mono-custom rounded-full px-4 py-2 text-left text-xs tracking-wider uppercase transition-all ${
                    category === 'all'
                      ? 'bg-[#6e9c4e] text-white'
                      : 'bg-white/60 text-[#525252] hover:bg-white'
                  }`}
                >
                  🌱 All Creations
                </button>
                {draftCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`font-mono-custom rounded-full px-4 py-2 text-left text-xs tracking-wider uppercase transition-all ${
                      category === cat
                        ? 'bg-[#6e9c4e] text-white'
                        : 'bg-white/60 text-[#525252] hover:bg-white'
                    }`}
                  >
                    {cat === 'nature'
                      ? '🌸'
                      : cat === 'poetry'
                        ? '✍️'
                        : cat === 'reflection'
                          ? '💭'
                          : '📓'}{' '}
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Column (Right 2 Spans) */}
          <div className='space-y-6 md:col-span-2'>
            {/* Create/Edit Draft Form Card (Inline expandable) */}
            {isFormOpen && (
              <div className='bento-cell animate-in fade-in slide-in-from-top-4 border-[#6e9c4e]/20 bg-[#6e9c4e]/5 p-6 duration-350'>
                <div className='mb-6 flex items-center justify-between border-b border-[#111111]/5 pb-4'>
                  <div className='flex items-center gap-2'>
                    <PenTool size={16} className='text-[#6e9c4e]' />
                    <h2 className='text-lg font-semibold text-[#111111]'>
                      {editingDraft
                        ? 'Refining Your Creation'
                        : 'Sowing a New Idea'}
                    </h2>
                  </div>
                  <button
                    onClick={handleCloseForm}
                    className='rounded-full p-1.5 text-[#525252] hover:bg-[#111111]/5'
                  >
                    <X size={16} />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className='space-y-5'
                >
                  {/* Title field */}
                  <div>
                    <label className='font-mono-custom mb-1.5 block text-[10px] tracking-wider text-[#525252]/80 uppercase'>
                      Draft Title
                    </label>
                    <input
                      type='text'
                      {...register('title')}
                      disabled={
                        createDraftMutation.isPending ||
                        updateDraftMutation.isPending
                      }
                      placeholder='Name your creation...'
                      className='font-mono-custom w-full rounded-xl border border-[#111111]/10 bg-white/80 p-3 text-xs text-[#111111] outline-none focus:border-[#111111]/30'
                    />
                    {errors.title && (
                      <p className='font-mono-custom mt-1 text-[10px] text-red-600'>
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Category Field */}
                  <div>
                    <label className='font-mono-custom mb-1.5 block text-[10px] tracking-wider text-[#525252]/80 uppercase'>
                      Category
                    </label>
                    <select
                      {...register('category')}
                      disabled={
                        createDraftMutation.isPending ||
                        updateDraftMutation.isPending
                      }
                      className='font-mono-custom w-full rounded-xl border border-[#111111]/10 bg-white/80 p-3 text-xs text-[#111111] outline-none focus:border-[#111111]/30'
                    >
                      {draftCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className='font-mono-custom mt-1 text-[10px] text-red-600'>
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* Content field */}
                  <div>
                    <label className='font-mono-custom mb-1.5 block text-[10px] tracking-wider text-[#525252]/80 uppercase'>
                      Body / Prose
                    </label>
                    <textarea
                      rows={5}
                      {...register('content')}
                      disabled={
                        createDraftMutation.isPending ||
                        updateDraftMutation.isPending
                      }
                      placeholder='Let the words flow onto the paper...'
                      className='font-mono-custom w-full rounded-xl border border-[#111111]/10 bg-white/80 p-3 text-xs leading-relaxed text-[#111111] outline-none focus:border-[#111111]/30'
                    />
                    {errors.content && (
                      <p className='font-mono-custom mt-1 text-[10px] text-red-600'>
                        {errors.content.message}
                      </p>
                    )}
                  </div>

                  {/* Tags manager */}
                  <div>
                    <label className='font-mono-custom mb-1.5 block text-[10px] tracking-wider text-[#525252]/80 uppercase'>
                      Tags (Optional, Max 5)
                    </label>
                    <div className='flex gap-2'>
                      <input
                        type='text'
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        disabled={
                          createDraftMutation.isPending ||
                          updateDraftMutation.isPending ||
                          tagsList.length >= 5
                        }
                        placeholder={
                          tagsList.length >= 5
                            ? 'Max tags reached'
                            : 'Type a tag & press enter...'
                        }
                        className='font-mono-custom flex-1 rounded-xl border border-[#111111]/10 bg-white/80 p-3 text-xs text-[#111111] outline-none focus:border-[#111111]/30'
                      />
                      <button
                        type='button'
                        onClick={addTag}
                        disabled={
                          createDraftMutation.isPending ||
                          updateDraftMutation.isPending ||
                          tagsList.length >= 5
                        }
                        className='outline-btn font-mono-custom border-[#111111]/30 bg-transparent px-4 text-[10px] uppercase hover:border-[#111111]'
                      >
                        Add
                      </button>
                    </div>
                    {/* Tags List */}
                    {tagsList.length > 0 && (
                      <div className='mt-3 flex flex-wrap gap-1.5'>
                        {tagsList.map((tag) => (
                          <span
                            key={tag}
                            className='font-mono-custom inline-flex items-center gap-1 rounded-full border border-[#111111]/5 bg-white px-2.5 py-1 text-[10px] text-[#525252]'
                          >
                            #{tag}
                            <button
                              type='button'
                              onClick={() => removeTag(tag)}
                              className='text-[#111111]/55 hover:text-[#111111]'
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {formError && (
                    <p className='font-mono-custom text-xs text-red-600'>
                      {formError}
                    </p>
                  )}

                  <div className='flex justify-end gap-3 border-t border-[#111111]/5 pt-4'>
                    <button
                      type='button'
                      onClick={handleCloseForm}
                      className='outline-btn font-mono-custom border-transparent bg-transparent px-5 py-2.5 text-[10px] tracking-wider uppercase'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      disabled={
                        createDraftMutation.isPending ||
                        updateDraftMutation.isPending
                      }
                      className='magnetic-btn font-mono-custom flex items-center gap-2 bg-[#111111] px-5 py-2.5 text-[10px] tracking-wider text-white uppercase disabled:opacity-50'
                    >
                      {createDraftMutation.isPending ||
                      updateDraftMutation.isPending ? (
                        <>
                          <Loader2 size={12} className='animate-spin' />
                          {editingDraft ? 'Refining...' : 'Sowing...'}
                        </>
                      ) : editingDraft ? (
                        'Update Draft'
                      ) : (
                        'Save Draft'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List and States */}
            {isLoading ? (
              // Loading State Skeletons
              <div className='space-y-4'>
                {[1, 2].map((i) => (
                  <div key={i} className='bento-cell animate-pulse p-6'>
                    <div className='mb-4 flex items-center justify-between'>
                      <div className='h-4 w-32 rounded bg-[#111111]/5'></div>
                      <div className='h-4 w-20 rounded bg-[#111111]/5'></div>
                    </div>
                    <div className='mb-3 h-6 w-3/4 rounded bg-[#111111]/5'></div>
                    <div className='mb-2 h-4 w-full rounded bg-[#111111]/5'></div>
                    <div className='h-4 w-5/6 rounded bg-[#111111]/5'></div>
                  </div>
                ))}
              </div>
            ) : data && data.drafts.length > 0 ? (
              // Active Drafts List
              <div className='space-y-4'>
                <div className='flex items-center justify-between px-2'>
                  <p className='font-mono-custom text-[11px] text-[#525252] uppercase'>
                    Showing {data.drafts.length} of {data.totalCount} creations
                  </p>
                  {isPlaceholderData && (
                    <Loader2
                      size={12}
                      className='animate-spin text-[#6e9c4e]'
                    />
                  )}
                </div>

                {data.drafts.map((draft: Draft) => (
                  <div
                    key={draft.id}
                    className='bento-cell flex min-h-40 flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-0.5'
                  >
                    <div>
                      {/* Top Category and Date */}
                      <div className='mb-3 flex items-center justify-between'>
                        <span className='font-mono-custom inline-flex items-center gap-1 text-[10px] tracking-wider text-[#6e9c4e] uppercase'>
                          <Folder size={10} />
                          {draft.category}
                        </span>

                        <div className='flex items-center gap-3'>
                          <span className='font-mono-custom inline-flex items-center gap-1 text-[10px] text-[#525252]/60'>
                            <Calendar size={10} />
                            {new Date(draft.createdAt).toLocaleDateString(
                              undefined,
                              {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              },
                            )}
                          </span>

                          <div className='flex items-center gap-1 border-l border-[#111111]/10 pl-3'>
                            <button
                              onClick={() => {
                                setEditingDraft(draft);
                                setCreateDialogOpen(false);
                                setTagsList(draft.tags || []);
                                setFormError(null);
                              }}
                              className='rounded-full p-1 text-[#525252] hover:bg-[#111111]/5 hover:text-[#111111]'
                              title='Edit Draft'
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteDraft(draft.id)}
                              disabled={deleteDraftMutation.isPending}
                              className='rounded-full p-1 text-[#dc2626]/80 hover:bg-[#dc2626]/10 hover:text-[#dc2626]'
                              title='Delete Draft'
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Draft Title */}
                      <h3 className='mb-2 text-lg font-semibold text-[#111111]'>
                        {draft.title}
                      </h3>

                      {/* Draft Content preview */}
                      <p className='font-sans text-[13px] leading-relaxed wrap-break-word text-[#525252]'>
                        {draft.content}
                      </p>
                    </div>

                    {/* Bottom Tags */}
                    {draft.tags && draft.tags.length > 0 && (
                      <div className='mt-4 flex flex-wrap gap-1 border-t border-[#111111]/5 pt-3'>
                        {draft.tags.map((tag) => (
                          <span
                            key={tag}
                            className='font-mono-custom mr-3 inline-flex items-center text-[10px] text-[#525252]/70'
                          >
                            <Hash size={9} className='text-[#6e9c4e]' />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Pagination Controls */}
                <div className='mt-8 flex items-center justify-between border-t border-[#111111]/5 pt-6'>
                  <button
                    onClick={() => setPage((old) => Math.max(old - 1, 1))}
                    disabled={page === 1}
                    className='outline-btn font-mono-custom flex items-center gap-2 border-[#111111]/20 bg-transparent px-4 py-2 text-[10px] uppercase hover:border-[#111111] disabled:opacity-30'
                  >
                    <ArrowLeft size={12} />
                    Previous
                  </button>

                  <span className='font-mono-custom text-xs text-[#525252]'>
                    Page {page} of {data.totalPages || 1}
                  </span>

                  <button
                    onClick={() => {
                      if (!isPlaceholderData && page < data.totalPages) {
                        setPage((old) => old + 1);
                      }
                    }}
                    disabled={page >= data.totalPages || isPlaceholderData}
                    className='outline-btn font-mono-custom flex items-center gap-2 border-[#111111]/20 bg-transparent px-4 py-2 text-[10px] uppercase hover:border-[#111111] disabled:opacity-30'
                  >
                    Next
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ) : (
              // Empty State
              <div className='bento-cell flex flex-col items-center justify-center bg-white/60 px-6 py-16 text-center'>
                <div className='mb-4 flex size-14 items-center justify-center rounded-full bg-[#6e9c4e]/10 text-[#6e9c4e]'>
                  <BookOpen size={24} />
                </div>
                <h3 className='mb-2 text-lg font-semibold text-[#111111]'>
                  A Quiet Meadow
                </h3>
                <p className='font-mono-custom mb-6 max-w-sm text-xs leading-relaxed text-[#525252]'>
                  No creations here match your search parameters. Settle in,
                  clear your mind, and plant some thoughts.
                </p>
                <button
                  onClick={() => setCreateDialogOpen(true)}
                  className='magnetic-btn font-mono-custom flex items-center gap-2 bg-[#111111] px-5 py-2.5 text-[10px] tracking-wider text-white uppercase'
                >
                  <Plus size={12} />
                  Sow Your First Draft
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DraftsPage() {
  return (
    <React.Suspense
      fallback={
        <div className='relative flex min-h-screen flex-col bg-[#f9f8f6] px-6 py-12 md:py-20'>
          <div className='paper-texture'></div>
          <div className='relative z-10 mx-auto flex min-h-[50vh] w-full max-w-250 items-center justify-center'>
            <Loader2 className='animate-spin text-[#6e9c4e]' size={32} />
          </div>
        </div>
      }
    >
      <DraftsPageContent />
    </React.Suspense>
  );
}
