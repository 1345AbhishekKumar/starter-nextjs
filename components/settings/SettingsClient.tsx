'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sliders } from 'lucide-react';

import {
  SettingsSidebar,
  type SettingsTab,
} from '@/components/settings/SettingsSidebar';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { SecuritySettings } from '@/components/settings/SecuritySettings';

type ProfileData = {
  id: string;
  name: string;
  bio: string;
  website: string;
  avatarUrl: string;
};

interface SettingsClientProps {
  initialProfile: ProfileData;
}

export function SettingsClient({ initialProfile }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  return (
    <div className='relative flex min-h-screen flex-col bg-[#f9f8f6] px-6 py-12 md:py-20'>
      {/* Paper texture overlay */}
      <div className='paper-texture'></div>

      <div className='relative z-10 mx-auto w-full max-w-[1000px]'>
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
            Settings Workspace
          </div>
        </header>

        {/* Page Title */}
        <div className='mb-10'>
          <p className='font-mono-custom mb-2 text-[11px] tracking-[0.2em] text-[#6e9c4e] uppercase'>
            Personalization
          </p>
          <h1 className='font-handwritten text-5xl font-normal text-[#111111] md:text-6xl'>
            My Settings.
          </h1>
          <p className='font-mono-custom mt-4 max-w-md text-[13px] leading-relaxed tracking-wider text-[#525252]'>
            Align your creative profile, notification frequencies, and
            authentication preferences.
          </p>
        </div>

        {/* Content Layout Grid */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          {/* Sidebar Tabs (1 Span on Desktop) */}
          <div className='md:col-span-1'>
            <SettingsSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Active Settings Panel (2 Spans on Desktop) */}
          <div className='md:col-span-2'>
            <div className='bento-cell p-6 md:p-8'>
              {activeTab === 'profile' && (
                <div>
                  <h3 className='mb-6 text-lg font-semibold text-[#111111]'>
                    Profile Information
                  </h3>
                  <ProfileForm initialProfile={initialProfile} />
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className='flex flex-col items-center justify-center py-12 text-center'>
                  <div className='mb-4 flex size-12 items-center justify-center rounded-full bg-[#6e9c4e]/10 text-[#6e9c4e]'>
                    <Sliders size={20} />
                  </div>
                  <h3 className='mb-2 text-base font-semibold text-[#111111]'>
                    Preferences Settings
                  </h3>
                  <p className='font-mono-custom max-w-sm text-xs leading-relaxed tracking-wide text-[#525252]/80'>
                    Custom themes, font sizing, and email notifications will
                    bloom here soon.
                  </p>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h3 className='mb-6 text-lg font-semibold text-[#111111]'>
                    Security Settings
                  </h3>
                  <SecuritySettings />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
