'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Mail } from 'lucide-react';

export function TestEmailButton() {
  const { user, isLoaded } = useUser();
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const primaryEmail = user?.primaryEmailAddress?.emailAddress;
  const name = user?.fullName || user?.firstName || 'there';

  const handleSendTestEmail = async () => {
    if (!primaryEmail) return;
    setSending(true);
    setStatus(null);
    try {
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: primaryEmail, name }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send test email');
      }

      setStatus({
        type: 'success',
        message: 'Test email queued successfully!',
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error sending email',
      });
    } finally {
      setSending(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className='animate-pulse rounded-xl border border-[#111111]/5 bg-[#111111]/5 p-4'>
        <div className='h-10 rounded-lg bg-gray-200/50'></div>
      </div>
    );
  }

  return (
    <div className='rounded-xl border border-[#111111]/5 bg-[#111111]/5 p-4'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-0.5'>
          <p className='text-xs font-semibold text-[#111111]'>
            Send Test Welcome Email
          </p>
          <p className='text-[10px] leading-relaxed text-[#525252]/75'>
            Sends a test email to your primary email address:{' '}
            <span className='font-semibold'>
              {primaryEmail || 'No email found'}
            </span>
          </p>
        </div>
        <button
          onClick={handleSendTestEmail}
          disabled={sending || !primaryEmail}
          className='font-mono-custom flex items-center justify-center gap-1.5 rounded-lg bg-[#111111] px-4 py-2 text-[11px] font-semibold tracking-wider text-white uppercase transition-all hover:bg-[#111111]/90 disabled:cursor-not-allowed disabled:bg-[#111111]/40'
        >
          <Mail size={12} />
          {sending ? 'Sending...' : 'Send Test'}
        </button>
      </div>
      {status && (
        <p
          className={`font-mono-custom mt-2 text-[9px] tracking-wider uppercase ${
            status.type === 'success' ? 'text-[#6e9c4e]' : 'text-red-500'
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
