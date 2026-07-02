'use client';

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';

export default function SSOCallbackPage() {
  return (
    <div className='flex min-h-[40vh] items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        {/* Simple minimal loader that fits the Alabaster background design */}
        <div className='size-6 animate-spin rounded-full border-2 border-[#111111]/10 border-t-[#111111]'></div>
        <p className='font-mono-custom text-xs tracking-widest text-[#525252]/80 uppercase'>
          Authenticating...
        </p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
