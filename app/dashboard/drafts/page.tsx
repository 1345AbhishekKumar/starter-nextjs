'use client';

import React from 'react';
import Link from 'next/link';
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import {
  Search,
  ArrowLeft,
  ArrowRight,
  Plus,
  Loader2,
  BookOpen,
  Sparkles,
} from 'lucide-react';

import { useUIStore } from '@/store/ui';
import { draftCategories } from '@/lib/validations/drafts';
import { useDrafts, useAIModels, type Draft } from '@/hooks/use-drafts';
import { DraftCard } from '@/components/drafts/DraftCard';
import { DraftForm } from '@/components/drafts/DraftForm';

function DraftsPageContent() {
  const isCreateDialogOpen = useUIStore((state) => state.isCreateDialogOpen);
  const setCreateDialogOpen = useUIStore((state) => state.setCreateDialogOpen);

  const [editingDraft, setEditingDraft] = React.useState<Draft | null>(null);
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
  const [aiModel, setAiModel] = useQueryState(
    'model',
    parseAsString.withDefault('nvidia/moonshotai/kimi-k2.6'),
  );

  // TanStack Queries
  const { data, isLoading, isPlaceholderData } = useDrafts({
    search,
    category,
    page,
    pageSize: 2, // 2 items per page to showcase pagination easily
  });

  const { data: models, isLoading: isLoadingModels } = useAIModels();

  // Normalize model ID to ensure it matches the prefixed format in the select options
  const normalizedAiModel =
    aiModel &&
    (aiModel.startsWith('nvidia/') ||
      aiModel.startsWith('openrouter/') ||
      aiModel.startsWith('gemini/'))
      ? aiModel
      : `nvidia/${aiModel}`;

  const nvidiaModels = models?.filter((m) => m.provider === 'nvidia') || [];
  const openrouterModels =
    models?.filter((m) => m.provider === 'openrouter') || [];
  const geminiModels = models?.filter((m) => m.provider === 'gemini') || [];

  const handleCloseForm = () => {
    setCreateDialogOpen(false);
    setEditingDraft(null);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  };

  return (
    <div className='relative flex min-h-screen flex-col bg-[#f9f8f6] px-6 py-12 md:py-20'>
      <div className='paper-texture'></div>

      <div className='relative z-10 mx-auto w-full max-w-275'>
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
              }}
              className='magnetic-btn font-mono-custom flex items-center gap-2 bg-[#111111] px-6 py-3.5 text-xs tracking-wider text-white uppercase hover:opacity-90'
            >
              <Plus size={14} />
              Sow New Draft
            </button>
          )}
        </div>

        {/* Core Layout */}
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
                    setPage(1);
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

            {/* AI Model Selector Bento */}
            <div className='bento-cell p-6'>
              <h3 className='font-mono-custom mb-3 flex items-center gap-1.5 text-xs tracking-wider text-[#111111] uppercase'>
                <Sparkles size={12} className='text-[#6e9c4e]' /> AI Reflection
                Model
              </h3>
              <div className='space-y-2'>
                <label className='font-mono-custom block text-[9px] tracking-wider text-[#525252]/80 uppercase'>
                  Selected Catalog NIM
                </label>
                {isLoadingModels ? (
                  <div className='font-mono-custom flex items-center gap-2 py-2 text-xs text-[#525252]/60'>
                    <Loader2
                      size={12}
                      className='animate-spin text-[#6e9c4e]'
                    />
                    Fetching live catalog...
                  </div>
                ) : (
                  <select
                    value={normalizedAiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className='font-mono-custom w-full rounded-xl border border-[#111111]/10 bg-white/80 p-2.5 text-xs text-[#111111] outline-none focus:border-[#111111]/30'
                  >
                    {nvidiaModels.length > 0 && (
                      <optgroup label='NVIDIA NIM'>
                        {nvidiaModels.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {openrouterModels.length > 0 && (
                      <optgroup label='OpenRouter'>
                        {openrouterModels.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {geminiModels.length > 0 && (
                      <optgroup label='Google Gemini'>
                        {geminiModels.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                )}
                <p className='font-mono-custom text-[9px] leading-relaxed text-[#525252]/50'>
                  Switch models dynamically. The selected model writes the
                  &quot;Meadow Echo&quot; reflection on demand.
                </p>
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
            {isFormOpen && (
              <DraftForm
                key={editingDraft?.id || 'new'}
                editingDraft={editingDraft}
                onClose={handleCloseForm}
              />
            )}

            {/* List and States */}
            {isLoading ? (
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
                  <DraftCard
                    key={draft.id}
                    draft={draft}
                    activeModel={aiModel}
                    onEdit={(d) => {
                      setEditingDraft(d);
                      setCreateDialogOpen(false);
                    }}
                  />
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
