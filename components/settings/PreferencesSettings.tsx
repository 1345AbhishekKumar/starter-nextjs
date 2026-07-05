'use client';

import React from 'react';
import {
  Sliders,
  Sun,
  Moon,
  Laptop,
  Type,
  Eye,
  Save,
  Mail,
} from 'lucide-react';
import { usePreferencesStore } from '@/store/use-preferences-store';
import { TestEmailButton } from '@/components/settings/TestEmailButton';

export function PreferencesSettings() {
  const {
    theme,
    fontFamily,
    zenMode,
    autosave,
    weeklyDigest,
    setTheme,
    setFontFamily,
    setZenMode,
    setAutosave,
    setWeeklyDigest,
  } = usePreferencesStore();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const themes = [
    {
      id: 'journal' as const,
      name: 'Journal',
      desc: 'Warm textured paper',
      icon: Sun,
      bg: 'bg-[#fcfbf9]',
      border: 'border-[#111111]/10',
    },
    {
      id: 'dark' as const,
      name: 'Dark',
      desc: 'Jet black styling',
      icon: Moon,
      bg: 'bg-[#09090b]',
      border: 'border-zinc-800',
    },
    {
      id: 'midnight' as const,
      name: 'Midnight',
      desc: 'Deep navy & slate',
      icon: Moon,
      bg: 'bg-[#0f1115]',
      border: 'border-white/10',
    },
    {
      id: 'classic-light' as const,
      name: 'Classic Light',
      desc: 'Clean modern layout',
      icon: Laptop,
      bg: 'bg-white',
      border: 'border-slate-200',
    },
  ];

  if (!mounted) {
    return (
      <div className='flex h-48 items-center justify-center'>
        <div className='size-6 animate-spin rounded-full border-2 border-[#111111]/10 border-t-[#6e9c4e]'></div>
      </div>
    );
  }

  const fonts = [
    {
      id: 'handwritten' as const,
      name: 'Handwritten',
      class: 'font-handwritten text-lg',
    },
    {
      id: 'serif' as const,
      name: 'Classic Serif',
      class: 'font-serif text-sm',
    },
    { id: 'sans' as const, name: 'Modern Sans', class: 'font-sans text-sm' },
    {
      id: 'mono' as const,
      name: 'Monospace',
      class: 'font-mono-custom text-xs',
    },
  ];

  return (
    <div className='space-y-8 text-[#111111]'>
      {/* 1. THEME SELECTION */}
      <div className='space-y-4'>
        <div className='flex items-start gap-4'>
          <div className='mt-0.5 flex size-9 items-center justify-center rounded-full bg-[#111111]/5 text-[#111111]'>
            <Sliders size={16} />
          </div>
          <div className='flex-1'>
            <h4 className='text-sm font-semibold text-[#111111]'>
              Visual Theme
            </h4>
            <p className='font-mono-custom mt-1 text-[9px] tracking-widest text-[#525252]/60 uppercase'>
              Choose the visual canvas for your workspace
            </p>

            <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3'>
              {themes.map((t) => {
                const Icon = t.icon;
                const isSelected = theme === t.id;

                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-[#6e9c4e] bg-[#6e9c4e]/5 ring-1 ring-[#6e9c4e]'
                        : 'border-[#111111]/10 bg-transparent hover:bg-[#111111]/5'
                    }`}
                  >
                    <div className='mb-3 flex size-8 items-center justify-center rounded-xl bg-[#111111]/5 text-[#111111]'>
                      <Icon size={16} />
                    </div>
                    <div className='font-sans text-xs font-semibold text-[#111111]'>
                      {t.name}
                    </div>
                    <div className='font-mono-custom mt-1 text-[9px] text-[#525252]/70 uppercase'>
                      {t.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. TYPOGRAPHY SELECTION */}
      <div className='space-y-4 border-t border-[#111111]/5 pt-6'>
        <div className='flex items-start gap-4'>
          <div className='mt-0.5 flex size-9 items-center justify-center rounded-full bg-[#111111]/5 text-[#111111]'>
            <Type size={16} />
          </div>
          <div className='flex-1'>
            <h4 className='text-sm font-semibold text-[#111111]'>Typography</h4>
            <p className='font-mono-custom mt-1 text-[9px] tracking-widest text-[#525252]/60 uppercase'>
              Select your preferred layout font family
            </p>

            <div className='mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4'>
              {fonts.map((f) => {
                const isSelected = fontFamily === f.id;

                return (
                  <button
                    key={f.id}
                    onClick={() => setFontFamily(f.id)}
                    className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-[#6e9c4e] bg-[#6e9c4e]/5 ring-1 ring-[#6e9c4e]'
                        : 'border-[#111111]/10 bg-transparent hover:bg-[#111111]/5'
                    }`}
                  >
                    <div className='font-sans text-xs font-semibold text-[#111111]'>
                      {f.name}
                    </div>
                    <div
                      className={`mt-4 truncate rounded-lg bg-[#111111]/5 p-2 text-center text-[#111111]/70 ${f.class}`}
                    >
                      Aa
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. DISTRACTION FREE PREFERENCES */}
      <div className='space-y-4 border-t border-[#111111]/5 pt-6'>
        <div className='flex items-start gap-4'>
          <div className='mt-0.5 flex size-9 items-center justify-center rounded-full bg-[#111111]/5 text-[#111111]'>
            <Eye size={16} />
          </div>
          <div className='flex-1 space-y-4'>
            <div>
              <h4 className='text-sm font-semibold text-[#111111]'>
                Writing & Focus
              </h4>
              <p className='font-mono-custom mt-1 text-[9px] tracking-widest text-[#525252]/60 uppercase'>
                Configure distraction-free environment options
              </p>
            </div>

            <div className='space-y-4'>
              {/* Zen Mode */}
              <div className='flex items-center justify-between rounded-xl border border-[#111111]/5 bg-[#111111]/5 p-4'>
                <div className='flex items-start gap-3'>
                  <div className='mt-0.5 flex size-8 items-center justify-center rounded-lg bg-[#111111]/5 text-[#111111]'>
                    <Eye size={14} />
                  </div>
                  <div>
                    <p className='text-xs font-semibold text-[#111111]'>
                      Zen Mode
                    </p>
                    <p className='mt-0.5 text-[10px] leading-relaxed text-[#525252]/75'>
                      Hides all background layout panels during active editor
                      sessions.
                    </p>
                  </div>
                </div>
                <input
                  type='checkbox'
                  checked={zenMode}
                  onChange={(e) => setZenMode(e.target.checked)}
                  className='size-4 cursor-pointer rounded border-[#111111]/20 bg-white text-[#111111] focus:ring-0 focus:ring-offset-0'
                />
              </div>

              {/* Autosave */}
              <div className='flex items-center justify-between rounded-xl border border-[#111111]/5 bg-[#111111]/5 p-4'>
                <div className='flex items-start gap-3'>
                  <div className='mt-0.5 flex size-8 items-center justify-center rounded-lg bg-[#111111]/5 text-[#111111]'>
                    <Save size={14} />
                  </div>
                  <div>
                    <p className='text-xs font-semibold text-[#111111]'>
                      Auto-save Drafts
                    </p>
                    <p className='mt-0.5 text-[10px] leading-relaxed text-[#525252]/75'>
                      Automatically commit active draft changes to database
                      every 30 seconds.
                    </p>
                  </div>
                </div>
                <input
                  type='checkbox'
                  checked={autosave}
                  onChange={(e) => setAutosave(e.target.checked)}
                  className='size-4 cursor-pointer rounded border-[#111111]/20 bg-white text-[#111111] focus:ring-0 focus:ring-offset-0'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. EMAIL NOTIFICATIONS */}
      <div className='space-y-4 border-t border-[#111111]/5 pt-6'>
        <div className='flex items-start gap-4'>
          <div className='mt-0.5 flex size-9 items-center justify-center rounded-full bg-[#111111]/5 text-[#111111]'>
            <Mail size={16} />
          </div>
          <div className='flex-1 space-y-4'>
            <div>
              <h4 className='text-sm font-semibold text-[#111111]'>
                Email Notifications
              </h4>
              <p className='font-mono-custom mt-1 text-[9px] tracking-widest text-[#525252]/60 uppercase'>
                Configure email settings and dispatch test notifications
              </p>
            </div>

            <div className='flex items-center justify-between rounded-xl border border-[#111111]/5 bg-[#111111]/5 p-4'>
              <div className='flex items-start gap-3'>
                <div className='mt-0.5 flex size-8 items-center justify-center rounded-lg bg-[#111111]/5 text-[#111111]'>
                  <Mail size={14} />
                </div>
                <div>
                  <p className='text-xs font-semibold text-[#111111]'>
                    Weekly Digest
                  </p>
                  <p className='mt-0.5 text-[10px] leading-relaxed text-[#525252]/75'>
                    Opt-in to weekly emails detailing your draft analytics and
                    journal archives.
                  </p>
                </div>
              </div>
              <input
                type='checkbox'
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className='size-4 cursor-pointer rounded border-[#111111]/20 bg-white text-[#111111] focus:ring-0 focus:ring-offset-0'
              />
            </div>

            <TestEmailButton />
          </div>
        </div>
      </div>
    </div>
  );
}
