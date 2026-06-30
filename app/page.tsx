'use client';

import { HeroSection } from '@/components/sections/HeroSection';
import { Navbar1 } from '@/components/sections/navbar-1';

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="paper-texture"></div>
      <Navbar1 />
      <HeroSection />
    </div>
  );
}
