'use client';

import React from 'react';
import { User, Shield, Sliders } from 'lucide-react';

export type SettingsTab = 'profile' | 'preferences' | 'security';

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  setActiveTab: (tab: SettingsTab) => void;
}

export function SettingsSidebar({
  activeTab,
  setActiveTab,
}: SettingsSidebarProps) {
  const tabs = [
    {
      id: 'profile' as SettingsTab,
      label: 'Profile Info',
      icon: <User size={14} />,
    },
    {
      id: 'preferences' as SettingsTab,
      label: 'Preferences',
      icon: <Sliders size={14} />,
    },
    {
      id: 'security' as SettingsTab,
      label: 'Security & Auth',
      icon: <Shield size={14} />,
    },
  ];

  return (
    <aside className='bento-cell flex flex-row gap-2 overflow-x-auto p-5 md:flex-col md:gap-3 md:overflow-visible'>
      <div className='mb-2 hidden px-3 md:block'>
        <p className='font-mono-custom text-[10px] tracking-widest text-[#525252]/60 uppercase'>
          Settings
        </p>
      </div>

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`font-mono-custom flex items-center gap-2.5 rounded-full px-4 py-2.5 text-left text-xs tracking-wider whitespace-nowrap uppercase transition-all outline-none ${
              isActive
                ? 'bg-[#6e9c4e]/15 font-semibold text-[#6e9c4e]'
                : 'text-[#525252]/70 hover:bg-[#111111]/5 hover:text-[#111111]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </aside>
  );
}
