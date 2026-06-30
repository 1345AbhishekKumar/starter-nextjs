'use client';

import { useState } from 'react';
import Link from 'next/link'

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="floating-nav">
      <Link href="#" className="text-lg font-semibold tracking-tight text-[#111111] flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        Meadow
      </Link>
      <div className="hidden md:flex items-center gap-6">
        <Link href="#philosophy" className="nav-link text-[#111111] text-sm font-medium opacity-55 hover:opacity-100 transition-opacity duration-300">Philosophy</Link>
        <Link href="#gallery" className="nav-link text-[#111111] text-sm font-medium opacity-55 hover:opacity-100 transition-opacity duration-300">Gallery</Link>
        <Link href="#voices" className="nav-link text-[#111111] text-sm font-medium opacity-55 hover:opacity-100 transition-opacity duration-300">Voices</Link>
        <Link href="/sign-up" className="nav-link text-[#111111] text-sm font-medium opacity-55 hover:opacity-100 transition-opacity duration-300">Join</Link>
      </div>
      <button onClick={toggleMenu} className="md:hidden text-[#111111] p-2 focus:outline-none" aria-label="Toggle Menu">
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-17 left-0 w-full bg-white/95 backdrop-blur-md border border-white/80 rounded-2xl p-6 shadow-lg flex flex-col gap-4 md:hidden z-50">
          <Link href="#philosophy" onClick={toggleMenu} className="text-[#111111] text-base font-medium opacity-70 hover:opacity-100 transition-opacity">Philosophy</Link>
          <Link href="#gallery" onClick={toggleMenu} className="text-[#111111] text-base font-medium opacity-70 hover:opacity-100 transition-opacity">Gallery</Link>
          <Link href="#voices" onClick={toggleMenu} className="text-[#111111] text-base font-medium opacity-70 hover:opacity-100 transition-opacity">Voices</Link>
          <Link href="/sign-up" onClick={toggleMenu} className="text-[#111111] text-base font-medium opacity-70 hover:opacity-100 transition-opacity">Join</Link>
        </div>
      )}
    </nav>
  );
};

export { Navbar1 };
