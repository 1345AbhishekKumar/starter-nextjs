'use client';

import React from 'react';
import { usePreferencesStore } from '@/store/use-preferences-store';

export function PreferencesSync({ children }: { children: React.ReactNode }) {
  const theme = usePreferencesStore((state) => state.theme);
  const fontFamily = usePreferencesStore((state) => state.fontFamily);

  React.useEffect(() => {
    // Apply theme body class
    document.body.classList.remove(
      'theme-journal',
      'theme-dark',
      'theme-midnight',
      'theme-classic-light',
    );
    document.body.classList.add(`theme-${theme}`);

    // Apply font body class
    document.body.classList.remove(
      'theme-font-handwritten',
      'theme-font-serif',
      'theme-font-sans',
      'theme-font-mono',
    );
    document.body.classList.add(`theme-font-${fontFamily}`);
  }, [theme, fontFamily]);

  return <>{children}</>;
}
