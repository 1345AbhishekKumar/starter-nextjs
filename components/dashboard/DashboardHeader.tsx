'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { Settings, Sparkles } from 'lucide-react';
import { useQueryState, parseAsBoolean, parseAsString } from 'nuqs';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { SearchTrigger, SearchModal } from '@/components/search';
import { AIChatSidebar } from '@/components/ai';
import { useUIStore } from '@/store/ui';

export function DashboardHeader() {
  const { signOut } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useQueryState(
    'searchOpen',
    parseAsBoolean.withDefault(false).withOptions({ shallow: true }),
  );
  const [query, setQuery] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({ shallow: true }),
  );
  const openAIChat = useUIStore((state) => state.openAIChat);

  // Auto-open search modal if either searchOpen parameter is true or a query string is present in URL
  const isModalOpen = isSearchOpen || query.trim().length > 0;

  const handleCloseSearch = () => {
    setIsSearchOpen(null);
    setQuery(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  return (
    <>
      <header className='mb-12 flex items-center justify-between'>
        <Link
          href='/'
          className='flex items-center gap-2 text-lg font-semibold tracking-tight text-[#111111]'
        >
          <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#111111'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
          </svg>
          <span className='font-mono-custom text-base tracking-[0.15em] uppercase'>
            Meadow
          </span>
        </Link>

        <div className='flex items-center gap-3'>
          <SearchTrigger onClick={() => setIsSearchOpen(true)} />
          <button
            onClick={() => openAIChat()}
            className='outline-btn font-mono-custom flex items-center gap-1.5 border-[#111111]/30 bg-transparent px-3 py-2.5 text-[10px] tracking-wider uppercase hover:border-[#111111]'
            title='Ask AI Assistant'
          >
            <Sparkles size={12} className='text-[#6e9c4e]' />
            Ask AI
          </button>
          <NotificationBell />
          <Link
            href='/settings'
            className='outline-btn font-mono-custom flex items-center gap-1.5 border-[#111111]/30 bg-transparent px-4 py-2.5 text-[10px] tracking-wider uppercase hover:border-[#111111]'
          >
            <Settings size={12} />
            Settings
          </Link>
          <button
            onClick={() => signOut()}
            className='outline-btn font-mono-custom border-[#111111]/30 bg-transparent px-5 py-2.5 text-[10px] tracking-wider uppercase hover:border-[#111111]'
          >
            Sign Out
          </button>
        </div>
      </header>

      <SearchModal isOpen={isModalOpen} onClose={handleCloseSearch} />

      <AIChatSidebar />
    </>
  );
}
