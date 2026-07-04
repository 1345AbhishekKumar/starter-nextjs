'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PenTool, X, Loader2 } from 'lucide-react';
import {
  draftFormSchema,
  type DraftFormInput,
  draftCategories,
} from '@/lib/validations/drafts';
import { useCreateDraft, useUpdateDraft, type Draft } from '@/hooks/use-drafts';

interface DraftFormProps {
  editingDraft: Draft | null;
  onClose: () => void;
}

export function DraftForm({ editingDraft, onClose }: DraftFormProps) {
  const createDraftMutation = useCreateDraft();
  const updateDraftMutation = useUpdateDraft();

  const [tagInput, setTagInput] = React.useState('');
  const [tagsList, setTagsList] = React.useState<string[]>(
    editingDraft?.tags || [],
  );
  const [formError, setFormError] = React.useState<string | null>(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DraftFormInput>({
    resolver: zodResolver(draftFormSchema),
    defaultValues: editingDraft
      ? {
          title: editingDraft.title,
          content: editingDraft.content,
          category: editingDraft.category,
          tags: editingDraft.tags || [],
        }
      : {
          title: '',
          content: '',
          category: 'nature',
          tags: [],
        },
  });

  // Tag helper functions
  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tagsList.includes(trimmed) && tagsList.length < 5) {
      setTagsList([...tagsList, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTagsList(tagsList.filter((t) => t !== tagToRemove));
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
      } else {
        await createDraftMutation.mutateAsync({
          ...values,
          tags: tagsList,
        });
      }
      handleClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save draft');
    }
  };

  const handleClose = () => {
    reset();
    setTagsList([]);
    setTagInput('');
    setFormError(null);
    onClose();
  };

  const isPending =
    createDraftMutation.isPending || updateDraftMutation.isPending;

  return (
    /* eslint-disable-next-line tailwindcss/no-custom-classname */
    <div className='bento-cell animate-in fade-in slide-in-from-top-4 border-[#6e9c4e]/20 bg-[#6e9c4e]/5 p-6 duration-350'>
      <div className='mb-6 flex items-center justify-between border-b border-[#111111]/5 pb-4'>
        <div className='flex items-center gap-2'>
          <PenTool size={16} className='text-[#6e9c4e]' />
          <h2 className='text-lg font-semibold text-[#111111]'>
            {editingDraft ? 'Refining Your Creation' : 'Sowing a New Idea'}
          </h2>
        </div>
        <button
          onClick={handleClose}
          className='rounded-full p-1.5 text-[#525252] hover:bg-[#111111]/5'
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-5'>
        {/* Title field */}
        <div>
          <label className='font-mono-custom mb-1.5 block text-[10px] tracking-wider text-[#525252]/80 uppercase'>
            Draft Title
          </label>
          <input
            type='text'
            {...register('title')}
            disabled={isPending}
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
            disabled={isPending}
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
            disabled={isPending}
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
              disabled={isPending || tagsList.length >= 5}
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
              disabled={isPending || tagsList.length >= 5}
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
          <p className='font-mono-custom text-xs text-red-600'>{formError}</p>
        )}

        <div className='flex justify-end gap-3 border-t border-[#111111]/5 pt-4'>
          <button
            type='button'
            onClick={handleClose}
            className='outline-btn font-mono-custom border-transparent bg-transparent px-5 py-2.5 text-[10px] tracking-wider uppercase'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isPending}
            className='magnetic-btn font-mono-custom flex items-center gap-2 bg-[#111111] px-5 py-2.5 text-[10px] tracking-wider text-white uppercase disabled:opacity-50'
          >
            {isPending ? (
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
  );
}
