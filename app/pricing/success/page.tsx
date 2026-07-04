import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Navbar1 } from '@/components/sections/navbar-1';

export const metadata = {
  title: 'Subscription Confirmed | Meadow',
};

export default function SuccessPage() {
  return (
    <div className='relative flex min-h-screen flex-col bg-[#f9f8f6]'>
      <div className='paper-texture'></div>
      <Navbar1 />

      <main className='relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-24 text-center'>
        <div className='bento-cell max-w-md p-8 shadow-md md:p-10'>
          <div className='mx-auto mb-6 flex size-12 items-center justify-center rounded-full bg-[#6e9c4e]/10 text-[#6e9c4e]'>
            <Sparkles size={20} />
          </div>

          <p className='font-mono-custom mb-3 text-[11px] tracking-[0.2em] text-[#6e9c4e] uppercase'>
            Transaction Successful
          </p>
          <h1 className='font-handwritten mb-6 text-5xl font-normal text-[#111111]'>
            Subscription Active.
          </h1>
          <p className='font-mono-custom mb-8 text-[13px] leading-relaxed tracking-wider text-[#525252]'>
            Thank you for supporting the meadow space. Your creative plan
            features are now active and ready for you on your dashboard.
          </p>

          <Link href='/dashboard'>
            <button className='magnetic-btn font-mono-custom flex w-full items-center justify-center gap-2 py-3.5 text-[10px] tracking-wider uppercase'>
              Go to Dashboard
              <ArrowRight size={12} />
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
