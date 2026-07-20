'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchTriggerProps {
  onClick: () => void;
  className?: string;
}

const subscribe = () => () => {};
const getIsMac = () =>
  typeof navigator !== 'undefined' &&
  navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const getServerIsMac = () => false;

export function SearchTrigger({ onClick, className = '' }: SearchTriggerProps) {
  const isMac = React.useSyncExternalStore(subscribe, getIsMac, getServerIsMac);

  return (
    <button
      type='button'
      onClick={onClick}
      className={`outline-btn font-mono-custom flex items-center gap-2 border-[#111111]/30 bg-transparent px-3.5 py-2 text-[10px] tracking-wider uppercase transition-colors hover:border-[#111111] ${className}`}
      aria-label='Open search dialog'
    >
      <Search size={12} className='text-[#111111]/70' />
      <span className='hidden sm:inline-block'>Search...</span>
      <kbd className='ml-1 inline-flex items-center rounded border border-[#111111]/20 bg-[#111111]/5 px-1.5 py-0.5 font-mono text-[9px] text-[#111111]/70'>
        {isMac ? '⌘K' : 'Ctrl+K'}
      </kbd>
    </button>
  );
}
