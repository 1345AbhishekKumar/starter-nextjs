'use client';

import React from 'react';
import { LegalLayout } from '@/components/legal/LegalLayout';

export default function CookiesPolicyPage() {
  return (
    <LegalLayout title='Cookies Policy' lastUpdated='July 1, 2026'>
      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          1. What Are Cookies?
        </h2>
        <p>
          Cookies are small text files stored on your browser or device when you
          visit web pages. They are commonly used to remember your settings,
          keep you signed in, and understand how visitors interact with the
          site.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          2. How We Use Cookies
        </h2>
        <p>We use cookies to enhance your experience in the meadow:</p>
        <ul className='list-inside list-disc space-y-2 pl-4'>
          <li>
            <strong>Essential Cookies:</strong> Needed to run user sessions and
            secure login states.
          </li>
          <li>
            <strong>Preference Cookies:</strong> Used to remember choices like
            your preferred dark/light theme.
          </li>
          <li>
            <strong>Analytical Cookies:</strong> Help us measure how visitors
            navigate through our pages to make improvements.
          </li>
        </ul>
      </section>

      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          3. Third-Party Integrations
        </h2>
        <p>
          Some third-party tools we integrate, such as Clerk for secure logins,
          Stripe for payments, and PostHog for usage analytics, may also place
          cookies on your device. These cookies are subject to their respective
          privacy and cookie policies.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          4. Managing Cookie Settings
        </h2>
        <p>
          You have the right to block or delete cookies through your browser
          settings. However, doing so may affect your ability to stay logged in
          or access certain premium features of the starter kit.
        </p>
      </section>
    </LegalLayout>
  );
}
