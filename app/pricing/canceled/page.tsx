import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Navbar1 } from '@/components/sections/navbar-1';

export const metadata = {
  title: 'Subscription Canceled | Meadow',
};

export default function CanceledPage() {
  return (
    <div className='relative flex min-h-screen flex-col bg-[#f9f8f6]'>
      <div className='paper-texture'></div>
      <Navbar1 />

      <main className='relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-24 text-center'>
        <div className='bento-cell max-w-md p-8 shadow-md md:p-10'>
          <div className='mx-auto mb-6 flex size-12 items-center justify-center rounded-full bg-red-500/10 text-red-500'>
            <XCircle size={20} />
          </div>

          <p className='font-mono-custom mb-3 text-[11px] tracking-[0.2em] text-red-500 uppercase'>
            Checkout Canceled
          </p>
          <h1 className='font-handwritten mb-6 text-5xl font-normal text-[#111111]'>
            Transaction Stopped.
          </h1>
          <p className='font-mono-custom mb-8 text-[13px] leading-relaxed tracking-wider text-[#525252]'>
            Your payment checkout has been canceled and your account has not
            been charged. Whenever you are ready, the plans are always
            available.
          </p>

          <Link href='/pricing'>
            <button className='outline-btn font-mono-custom flex w-full items-center justify-center gap-2 border-[#111111]/30 py-3.5 text-[10px] tracking-wider uppercase hover:border-[#111111]'>
              <ArrowLeft size={12} />
              Return to Pricing
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
