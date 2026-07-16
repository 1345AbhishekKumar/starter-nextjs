import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className='relative flex min-h-screen flex-col bg-[#f9f8f6] px-6 py-12 md:py-20'>
          {/* Paper texture overlay */}
          <div className='paper-texture'></div>
          <div className='relative z-10 mx-auto flex min-h-[50vh] w-full max-w-[1000px] items-center justify-center'>
            <Loader2 className='animate-spin text-[#6e9c4e]' size={32} />
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
