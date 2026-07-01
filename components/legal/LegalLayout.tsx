'use client';

import React from 'react';
import Link from 'next/link';

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalLayout({
  title,
  lastUpdated,
  children,
}: LegalLayoutProps) {
  return (
    <div className='relative min-h-screen overflow-x-hidden bg-[var(--bg-alabaster)] px-6 py-20 text-[var(--accent-black)]'>
      {/* Paper Texture Overlay */}
      <div className='paper-texture'></div>

      <div className='relative z-10 mx-auto max-w-3xl'>
        {/* Navigation back to main */}
        <div className='mb-12'>
          <Link
            href='/'
            className='font-mono-custom text-[11px] tracking-[0.2em] text-[var(--text-secondary)] uppercase transition-colors hover:text-[var(--accent-black)]'
          >
            ← Back to Meadow
          </Link>
        </div>

        {/* Header Section */}
        <header className='mb-16 border-b border-[var(--accent-black)]/10 pb-8'>
          <span className='font-mono-custom text-[11px] tracking-[0.2em] text-[var(--brand-green)] uppercase'>
            Legal Document
          </span>
          <h1
            className='font-handwritten mt-2 mb-4 font-normal text-[var(--accent-black)]'
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 1.1,
            }}
          >
            {title}
          </h1>
          <p className='font-mono-custom text-[11px] tracking-wider text-[var(--text-secondary)]'>
            Last Updated: {lastUpdated}
          </p>
        </header>

        {/* Content Card */}
        <article className='bento-cell rounded-[24px] border border-white/90 bg-white/70 p-8 shadow-sm backdrop-blur-md md:p-12'>
          <div className='font-mono-custom max-w-none space-y-8 text-[13px] leading-relaxed tracking-wider text-[var(--text-secondary)]'>
            {children}
          </div>
        </article>

        {/* Footer */}
        <footer className='mt-16 border-t border-[var(--accent-black)]/10 pt-8 text-center'>
          <p className='font-mono-custom text-[10px] tracking-wider text-[var(--text-secondary)]/60'>
            If you have questions about these terms, please contact
            shepherd@meadow.app
          </p>
        </footer>
      </div>
    </div>
  );
}
