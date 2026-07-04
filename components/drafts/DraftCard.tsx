'use client';

import React from 'react';
import {
  Folder,
  Calendar,
  Edit,
  Trash2,
  Hash,
  Sparkles,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import {
  useDeleteDraft,
  useSummarizeDraft,
  type Draft,
} from '@/hooks/use-drafts';

interface DraftCardProps {
  draft: Draft;
  activeModel: string;
  onEdit: (draft: Draft) => void;
}

export function DraftCard({ draft, activeModel, onEdit }: DraftCardProps) {
  const deleteDraftMutation = useDeleteDraft();
  const summarizeMutation = useSummarizeDraft();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleDelete = async () => {
    if (
      confirm('Are you sure you want to return this creation to the earth?')
    ) {
      try {
        await deleteDraftMutation.mutateAsync(draft.id);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete draft');
      }
    }
  };

  const handleSummarize = async () => {
    setErrorMsg(null);
    try {
      await summarizeMutation.mutateAsync({
        id: draft.id,
        model: activeModel,
      });
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Failed to generate summary',
      );
    }
  };

  return (
    <div className='bento-cell flex min-h-40 flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-0.5'>
      <div>
        {/* Top Category, Date, and Actions */}
        <div className='mb-3 flex items-center justify-between'>
          <span className='font-mono-custom inline-flex items-center gap-1 text-[10px] tracking-wider text-[#6e9c4e] uppercase'>
            <Folder size={10} />
            {draft.category}
          </span>

          <div className='flex items-center gap-3'>
            <span className='font-mono-custom inline-flex items-center gap-1 text-[10px] text-[#525252]/60'>
              <Calendar size={10} />
              {new Date(draft.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>

            <div className='flex items-center gap-1 border-l border-[#111111]/10 pl-3'>
              <button
                onClick={() => onEdit(draft)}
                className='rounded-full p-1 text-[#525252] hover:bg-[#111111]/5 hover:text-[#111111]'
                title='Edit Draft'
              >
                <Edit size={12} />
              </button>
              <button
                onClick={handleDelete}
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
        <p className='font-sans text-[13px] leading-relaxed break-words text-[#525252]'>
          {draft.content}
        </p>
      </div>

      {/* Bottom section: Tags and AI Summary */}
      <div className='mt-4 space-y-3'>
        {/* Tags */}
        {draft.tags && draft.tags.length > 0 && (
          <div className='flex flex-wrap gap-1 border-t border-[#111111]/5 pt-3'>
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

        {/* AI Summary Block */}
        {draft.summary ? (
          <div
            className={
              draft.tags && draft.tags.length > 0
                ? ''
                : 'border-t border-[#111111]/5 pt-3'
            }
          >
            <div className='group relative rounded-xl border border-[#6e9c4e]/15 bg-[#6e9c4e]/5 p-5 md:p-6'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='font-mono-custom flex items-center gap-1 text-[9px] tracking-wider text-[#6e9c4e] uppercase'>
                  <Sparkles size={8} /> Meadow Echo
                </span>
                <button
                  onClick={handleSummarize}
                  disabled={summarizeMutation.isPending}
                  className='rounded p-0.5 text-[#525252]/60 opacity-0 transition-colors group-hover:opacity-100 hover:bg-[#6e9c4e]/10 hover:text-[#6e9c4e] focus:opacity-100'
                  title='Regenerate summary with current model'
                >
                  <RefreshCw
                    size={10}
                    className={
                      summarizeMutation.isPending ? 'animate-spin' : ''
                    }
                  />
                </button>
              </div>
              <p className='font-sans text-[13px] leading-relaxed text-[#525252] italic'>
                &ldquo;{draft.summary}&rdquo;
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`flex items-center justify-between gap-4 pt-3 ${draft.tags && draft.tags.length > 0 ? '' : 'border-t border-[#111111]/5'}`}
          >
            <span className='font-mono-custom text-[9px] tracking-wide text-[#525252]/40 uppercase'>
              No reflection yet
            </span>
            <button
              onClick={handleSummarize}
              disabled={summarizeMutation.isPending}
              className='outline-btn font-mono-custom flex items-center gap-1.5 border-[#111111]/20 bg-transparent px-3 py-1.5 text-[10px] uppercase hover:border-[#111111] disabled:opacity-50'
            >
              {summarizeMutation.isPending ? (
                <>
                  <Loader2 size={10} className='animate-spin' />
                  Echoing...
                </>
              ) : (
                <>
                  <Sparkles size={10} className='text-[#6e9c4e]' />
                  Summarize
                </>
              )}
            </button>
          </div>
        )}

        {errorMsg && (
          <p className='font-mono-custom mt-1 text-[10px] text-red-600'>
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}
