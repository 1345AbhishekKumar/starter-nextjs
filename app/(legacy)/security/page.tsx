'use client';

import React from 'react';
import { LegalLayout } from '@/components/legal/LegalLayout';

export default function SecurityPolicyPage() {
  return (
    <LegalLayout title='Security Policy' lastUpdated='July 1, 2026'>
      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          1. Security Posture & Standards
        </h2>
        <p>
          We employ robust, industry-standard security measures to safeguard
          your personal data, credentials, and transactions in the meadow. Our
          stack features secure session management via Clerk and parameterized
          database queries with Drizzle to protect against unauthorized access
          and common injection vulnerabilities.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          2. Edge & Bot Protection
        </h2>
        <p>
          To secure our systems against bots, DDoS attacks, and excessive
          traffic spikes, we deploy Edge Middleware powered by Arcjet. Arcjet
          filters traffic at the network edge, ensuring that only authentic
          users can access our services while preventing malicious activity.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          3. Infrastructure & Payments
        </h2>
        <p>
          Our database sits behind Neon&apos;s secure cloud PostgreSQL
          architecture, utilizing strict SSL connection protocols. Additionally,
          all transactional billing information is securely routed through
          Stripe&apos;s verified PCI-compliant infrastructure; we never directly
          view or store your full card details.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          4. Reporting Vulnerabilities
        </h2>
        <p>
          We welcome feedback from security researchers. If you identify a
          vulnerability in our application, please disclose it responsibly by
          contacting us directly at security@meadow.app. Please do not publish
          the details publicly until we have had an opportunity to address and
          patch the issue.
        </p>
      </section>
    </LegalLayout>
  );
}
