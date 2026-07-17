'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { NotificationBadge } from './NotificationBadge';
import { NotificationDropdown } from './NotificationDropdown';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        aria-label='Toggle notifications menu'
        className='relative flex size-8 items-center justify-center rounded-full border border-[#111111]/15 bg-white/60 text-[#111111] transition-all hover:border-[#111111]/30 hover:bg-[#111111]/5 focus:outline-none'
      >
        <Bell
          size={14}
          className={isOpen ? 'text-[#6e9c4e]' : 'text-[#111111]'}
        />
        <NotificationBadge />
      </button>

      {isOpen && (
        /* eslint-disable-next-line tailwindcss/no-custom-classname */
        <div className='animate-in fade-in slide-in-from-top-2 absolute right-0 z-50 mt-2 duration-200'>
          <NotificationDropdown onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}
