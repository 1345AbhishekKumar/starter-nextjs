import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserTheme = 'journal' | 'dark' | 'midnight' | 'classic-light';
export type UserFont = 'handwritten' | 'serif' | 'sans' | 'mono';

interface PreferencesState {
  theme: UserTheme;
  fontFamily: UserFont;
  zenMode: boolean;
  autosave: boolean;
  weeklyDigest: boolean;
  setTheme: (theme: UserTheme) => void;
  setFontFamily: (fontFamily: UserFont) => void;
  setZenMode: (enabled: boolean) => void;
  setAutosave: (enabled: boolean) => void;
  setWeeklyDigest: (enabled: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'journal',
      fontFamily: 'handwritten',
      zenMode: false,
      autosave: true,
      weeklyDigest: false,
      setTheme: (theme) => set({ theme }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setZenMode: (zenMode) => set({ zenMode }),
      setAutosave: (autosave) => set({ autosave }),
      setWeeklyDigest: (weeklyDigest) => set({ weeklyDigest }),
    }),
    {
      name: 'starter-nextjs-preferences',
    },
  ),
);
