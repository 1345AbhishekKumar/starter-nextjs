'use client';

import React from 'react';
import { useQueryState } from 'nuqs';
import {
  useMarkAllAsReadMutation,
  useUnreadCountQuery,
} from '@/hooks/use-notifications';
import { NotificationList } from './NotificationList';
import { Search, Check } from 'lucide-react';

export function NotificationPage() {
  const [tab, setTab] = useQueryState('tab', { defaultValue: 'all' });
  const [priority, setPriority] = useQueryState('priority', {
    defaultValue: 'all',
  });
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });

  const { data: unreadCount = 0 } = useUnreadCountQuery();
  const markAllAsRead = useMarkAllAsReadMutation();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value || null);
  };

  const getFilters = () => {
    return {
      readStatus:
        tab === 'unread'
          ? ('unread' as const)
          : tab === 'archived'
            ? ('all' as const)
            : ('all' as const),
      archivedStatus:
        tab === 'archived' ? ('archived' as const) : ('active' as const),
      priority: priority !== 'all' ? priority : undefined,
      search: search || undefined,
    };
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* Header cell */}
      <div className='bento-cell bg-white/70 p-6 backdrop-blur-md'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <p className='font-mono-custom text-[10px] tracking-widest text-[#525252] uppercase'>
              User Workspace
            </p>
            <h1 className='mt-1 text-xl font-bold text-[#111111]'>
              Notification Stream
            </h1>
            <p className='mt-0.5 text-xs text-[#525252]'>
              Harvesting and sifting through your updates and system events.
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-3'>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
                className='outline-btn font-mono-custom flex items-center gap-1.5 border-[#6e9c4e]/30 bg-transparent px-4 py-2.5 text-[10px] tracking-wider uppercase hover:border-[#6e9c4e] hover:bg-[#6e9c4e]/5'
              >
                <Check size={12} />
                Mark All Harvested
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters row */}
        <div className='mt-6 grid grid-cols-1 gap-4 border-t border-[#111111]/5 pt-5 md:grid-cols-3'>
          {/* Search Input */}
          <div className='relative md:col-span-2'>
            <span className='absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#525252]/60'>
              <Search size={14} />
            </span>
            <input
              type='text'
              value={search}
              onChange={handleSearchChange}
              placeholder='Sift notifications by variables...'
              className='font-mono-custom w-full rounded-full border border-[#111111]/15 bg-white/80 py-2.5 pr-4 pl-10 text-xs text-[#111111] placeholder:text-[#99A1AF] focus:border-[#111111]/30 focus:outline-none'
            />
          </div>

          {/* Priority selector */}
          <div className='flex items-center gap-2'>
            <label className='font-mono-custom shrink-0 text-[10px] tracking-widest text-[#525252] uppercase'>
              Priority:
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className='font-mono-custom w-full rounded-full border border-[#111111]/15 bg-white/80 px-4 py-2 text-xs text-[#111111] focus:border-[#111111]/30 focus:outline-none'
            >
              <option value='all'>ALL STREAMS</option>
              <option value='low'>LOW</option>
              <option value='normal'>NORMAL</option>
              <option value='high'>HIGH</option>
              <option value='urgent'>URGENT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className='flex gap-2 border-b border-[#111111]/10 pb-1'>
        <button
          onClick={() => setTab('all')}
          className={`font-mono-custom border-b-2 px-4 py-2 text-[10px] tracking-widest uppercase transition-all focus:outline-none ${
            tab === 'all'
              ? 'border-[#6e9c4e] font-bold text-[#6e9c4e]'
              : 'border-transparent text-[#525252] hover:text-[#111111]'
          }`}
        >
          All Updates
        </button>
        <button
          onClick={() => setTab('unread')}
          className={`font-mono-custom border-b-2 px-4 py-2 text-[10px] tracking-widest uppercase transition-all focus:outline-none ${
            tab === 'unread'
              ? 'border-[#6e9c4e] font-bold text-[#6e9c4e]'
              : 'border-transparent text-[#525252] hover:text-[#111111]'
          }`}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
        <button
          onClick={() => setTab('archived')}
          className={`font-mono-custom border-b-2 px-4 py-2 text-[10px] tracking-widest uppercase transition-all focus:outline-none ${
            tab === 'archived'
              ? 'border-[#6e9c4e] font-bold text-[#6e9c4e]'
              : 'border-transparent text-[#525252] hover:text-[#111111]'
          }`}
        >
          Archived
        </button>
      </div>

      {/* Main List */}
      <div className='flex flex-col gap-4'>
        <NotificationList filters={getFilters()} />
      </div>
    </div>
  );
}
