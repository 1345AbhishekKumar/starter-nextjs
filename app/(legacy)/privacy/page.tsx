'use client';

import React from 'react';
import { LegalLayout } from '@/components/legal/LegalLayout';

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title='Privacy Policy' lastUpdated='July 1, 2026'>
      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          1. Information We Collect
        </h2>
        <p>
          In the quiet meadows of our digital sanctuary, we respect your quiet
          reflection and privacy. We collect information that you voluntarily
          provide to us when you join the flock, such as your name, email
          address, and profile details.
        </p>
        <p>
          We also automatically collect technical details like your IP address,
          browser type, and navigation patterns to keep our meadows running
          smoothly and securely.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          2. How We Use Your Information
        </h2>
        <p>
          We use the information we gather solely to cultivate a better
          experience for our community. This includes authenticating your
          access, verifying credentials, processing transactions, and sending
          gentle updates or newsletters about new collections and artists.
        </p>
        <p>
          We never sell, rent, or trade your personal information to third
          parties. Your presence in the meadow remains private and secure.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          3. Caching and Cookies
        </h2>
        <p>
          We use cookies and cache components to remember your preferences and
          ensure rapid page loading. You can manage your cookie preferences
          through your browser settings, though some features of the meadow may
          not function as intended without them.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          4. Contacting the Shepherd
        </h2>
        <p>
          If you have any questions, concerns, or requests regarding this
          Privacy Policy, please reach out to our flock administrator at
          shepherd@meadow.app.
        </p>
      </section>
    </LegalLayout>
  );
}
