'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useQueryState, parseAsString } from 'nuqs';
import {
  Search,
  LayoutGrid,
  CreditCard,
  Settings,
  Bell,
  Home,
  UploadCloud,
  Terminal,
  ShieldCheck,
  LogOut,
  FileText,
  File,
  Loader2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  searchAll,
  type SearchResultItem,
  type GroupedSearchResults,
} from '@/actions/search';
import { useUIStore } from '@/store/ui';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const openAIChat = useUIStore((state) => state.openAIChat);

  // Type-safe URL query state with nuqs
  const [query, setQuery] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({ shallow: true }),
  );
  const [groupedResults, setGroupedResults] = useState<GroupedSearchResults>({
    pages: [],
    actions: [],
    files: [],
    drafts: [],
    notifications: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper to close modal and clean up query param if needed
  const handleCloseModal = useCallback(() => {
    setQuery(null);
    setSelectedIndex(0);
    onClose();
  }, [setQuery, onClose]);

  // Flattened array of visible items for keyboard index navigation
  const flatResults = React.useMemo(() => {
    const list: SearchResultItem[] = [];
    if (groupedResults.pages.length > 0) list.push(...groupedResults.pages);
    if (groupedResults.actions.length > 0) list.push(...groupedResults.actions);
    if (groupedResults.files.length > 0) list.push(...groupedResults.files);
    if (groupedResults.drafts.length > 0) list.push(...groupedResults.drafts);
    if (groupedResults.notifications.length > 0)
      list.push(...groupedResults.notifications);
    return list;
  }, [groupedResults]);

  const handleAskAI = useCallback(
    (promptToUse?: string) => {
      const prompt = promptToUse || query.trim();
      handleCloseModal();
      openAIChat(prompt);
    },
    [query, handleCloseModal, openAIChat],
  );

  // Global Keyboard shortcuts: Cmd+K / Ctrl+K or '/' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Cmd+K or Ctrl+K or '/'
      if (
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') ||
        (e.key === '/' && !isInput)
      ) {
        e.preventDefault();
        if (isOpen) {
          handleCloseModal();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleCloseModal]);

  const performSearch = useCallback(async (searchTerm: string) => {
    setIsLoading(true);
    const res = await searchAll({ query: searchTerm, category: 'all' });
    setIsLoading(false);

    if (res.success && res.data) {
      setGroupedResults(res.data.grouped);
      setSelectedIndex(0);
    } else {
      setGroupedResults({
        pages: [],
        actions: [],
        files: [],
        drafts: [],
        notifications: [],
      });
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      performSearch(query);
    }, 200);

    return () => clearTimeout(timer);
  }, [isOpen, query, performSearch]);

  const handleSelectResult = useCallback(
    (item: SearchResultItem) => {
      if (item.actionType === 'signout') {
        handleCloseModal();
        signOut();
      } else if (item.actionType === 'ai') {
        handleCloseModal();
        openAIChat(query);
      } else if (item.url) {
        router.push(item.url);
      } else {
        handleCloseModal();
      }
    },
    [handleCloseModal, signOut, openAIChat, query, router],
  );

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (flatResults.length > 0) {
        setSelectedIndex((prev) =>
          prev < flatResults.length - 1 ? prev + 1 : 0,
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (flatResults.length > 0) {
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : flatResults.length - 1,
        );
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatResults.length > 0 && flatResults[selectedIndex]) {
        handleSelectResult(flatResults[selectedIndex]);
      } else {
        // No direct match found -> prompt AI directly on Enter
        handleAskAI(query);
      }
    }
  };

  if (!isOpen) return null;

  const renderIcon = (item: SearchResultItem) => {
    if (item.id === 'page-dashboard')
      return <LayoutGrid size={18} className='text-[#111827]' />;
    if (item.id === 'page-billing')
      return <CreditCard size={18} className='text-[#111827]' />;
    if (item.id === 'page-settings')
      return <Settings size={18} className='text-[#111827]' />;
    if (item.id === 'page-notifications')
      return <Bell size={18} className='text-[#111827]' />;
    if (item.id === 'page-manifesto')
      return <Home size={18} className='text-[#111827]' />;

    if (item.id === 'action-upload')
      return <UploadCloud size={18} className='text-orange-600' />;
    if (item.id === 'action-ai')
      return <Terminal size={18} className='text-orange-600' />;
    if (item.id === 'action-security')
      return <ShieldCheck size={18} className='text-slate-700' />;
    if (item.id === 'action-signout')
      return <LogOut size={18} className='text-slate-700' />;

    if (item.type === 'file')
      return <File size={18} className='text-blue-600' />;
    if (item.type === 'draft')
      return <FileText size={18} className='text-[#6e9c4e]' />;

    return <Search size={18} className='text-slate-600' />;
  };

  let globalIndexCounter = 0;

  const renderSection = (title: string, items: SearchResultItem[]) => {
    if (items.length === 0) return null;

    return (
      <div className='mb-4'>
        <div className='font-mono-custom mb-2 flex items-center justify-between px-3 text-[11px] font-bold tracking-widest text-slate-500 uppercase'>
          <span>{title}</span>
          <span>{items.length}</span>
        </div>
        <div className='space-y-1'>
          {items.map((item) => {
            const currentIndex = globalIndexCounter++;
            const isSelected = selectedIndex === currentIndex;
            const isAction =
              item.actionType === 'signout' || item.actionType === 'ai';

            const itemContent = (
              <>
                <div className='flex min-w-0 items-center gap-3 pr-4'>
                  <div
                    className={`flex shrink-0 items-center justify-center rounded-lg border p-2.5 transition-colors ${
                      isSelected
                        ? 'border-slate-700 bg-white/10'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    {renderIcon(item)}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <h4
                        className={`font-mono-custom truncate text-xs font-bold ${
                          isSelected ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {item.title}
                      </h4>
                      {item.badgeText && (
                        <span
                          className={`shrink-0 rounded border px-1.5 py-0.25 font-mono text-[9px] tracking-wider uppercase ${
                            isSelected
                              ? 'border-slate-600 bg-slate-800 text-slate-200'
                              : 'border-slate-300 bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badgeText}
                        </span>
                      )}
                    </div>
                    <p
                      className={`font-mono-custom mt-0.5 truncate text-[11px] ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className='font-mono-custom flex shrink-0 items-center gap-1.5 rounded bg-slate-800 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase'>
                    SELECT <ArrowRight size={12} />
                  </div>
                )}
              </>
            );

            const className = `group flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors ${
              isSelected
                ? 'bg-[#0B132B] text-white'
                : 'bg-white hover:bg-slate-100/80 text-slate-800'
            }`;

            if (item.url && !isAction) {
              return (
                <Link
                  key={item.id}
                  href={item.url}
                  onMouseEnter={() => setSelectedIndex(currentIndex)}
                  className={className}
                >
                  {itemContent}
                </Link>
              );
            }

            return (
              <div
                key={item.id}
                onClick={() => handleSelectResult(item)}
                onMouseEnter={() => setSelectedIndex(currentIndex)}
                className={className}
              >
                {itemContent}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 px-4 pt-12 backdrop-blur-xs sm:pt-20'
      onClick={handleCloseModal}
    >
      <div
        className='w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-[#F4F6F8] shadow-2xl transition-all'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Search Input Bar */}
        <div className='flex items-center border-b border-slate-200 bg-white px-4 py-3.5'>
          <Search size={20} className='mr-3 text-slate-400' />
          <input
            ref={inputRef}
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value || null)}
            onKeyDown={handleKeyDownInput}
            placeholder="Search pages, files, actions, or ask AI (e.g., 'billing', 'pdf', ...)"
            className='font-mono-custom w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 outline-none'
          />
          {isLoading && (
            <Loader2 size={16} className='ml-2 animate-spin text-slate-400' />
          )}
          <button
            onClick={handleCloseModal}
            className='ml-3 rounded border border-slate-300 bg-slate-100 px-2 py-1 font-mono text-[10px] font-semibold text-slate-600 uppercase hover:bg-slate-200'
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className='max-h-[460px] overflow-y-auto p-4'>
          {flatResults.length === 0 && !isLoading ? (
            <div className='space-y-4 py-6'>
              <div className='font-mono-custom text-center text-xs text-slate-500'>
                {query.trim()
                  ? `No direct file or route matches found for "${query}"`
                  : 'Start typing to search across Meadow...'}
              </div>

              {/* Ask AI Assistant Button / Option */}
              <div
                onClick={() => handleAskAI(query)}
                className='group flex cursor-pointer items-center justify-between rounded-xl border border-slate-300 bg-white p-4 shadow-xs transition-all hover:border-[#111111] hover:shadow-md'
              >
                <div className='flex min-w-0 items-center gap-3.5'>
                  <div className='flex shrink-0 items-center justify-center rounded-lg bg-[#111111] p-3 text-white shadow-xs transition-transform group-hover:scale-105'>
                    <Sparkles size={20} />
                  </div>
                  <div className='min-w-0'>
                    <div className='flex items-center gap-2'>
                      <h4 className='font-mono-custom text-xs font-bold text-slate-900 group-hover:text-[#111111]'>
                        Ask AI Assistant
                      </h4>
                      <span className='rounded border border-emerald-200 bg-emerald-100 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wider text-emerald-800 uppercase'>
                        AI MODEL
                      </span>
                    </div>
                    <p className='font-mono-custom mt-1 truncate text-[11px] text-slate-600'>
                      {query.trim()
                        ? `Prompt AI model directly about "${query}"`
                        : 'Open AI Assistant sidebar to chat'}
                    </p>
                  </div>
                </div>

                <div className='font-mono-custom flex shrink-0 items-center gap-1.5 rounded-lg bg-[#111111] px-3 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase transition-colors group-hover:bg-slate-800'>
                  ASK AI <ArrowRight size={12} />
                </div>
              </div>
            </div>
          ) : (
            <>
              {renderSection('PAGES', groupedResults.pages)}
              {renderSection('ACTIONS', groupedResults.actions)}
              {renderSection('FILES', groupedResults.files)}
              {renderSection('DRAFTS & POSTS', groupedResults.drafts)}
              {renderSection('NOTIFICATIONS', groupedResults.notifications)}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className='font-mono-custom flex items-center justify-between border-t border-slate-200 bg-white px-4 py-2.5 text-[10px] text-slate-500 uppercase'>
          <span>
            {flatResults.length === 0
              ? 'Press ↵ to Ask AI Assistant'
              : 'Use ↑ ↓ to navigate, ↵ to select'}
          </span>
          <span>{flatResults.length} item(s)</span>
        </div>
      </div>
    </div>
  );
}
