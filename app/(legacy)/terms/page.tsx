'use client';

import React from 'react';
import { LegalLayout } from '@/components/legal/LegalLayout';

export default function TermsOfServicePage() {
  return (
    <LegalLayout title='Terms of Service' lastUpdated='July 1, 2026'>
      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          1. Terms of Entry
        </h2>
        <p>
          By entering our digital meadow, you agree to comply with and be bound
          by the following terms and conditions. If you do not agree to these
          terms, you may not join the flock or access our services.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          2. Account Registration
        </h2>
        <p>
          To fully participate in the community, you must register for an
          account using our secure authentication portal. You are responsible
          for keeping your credentials confidential and for all activities that
          occur under your account.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          3. Meadow Code of Conduct
        </h2>
        <p>
          We strive to keep our meadow a peaceful, collaborative, and creative
          space. You agree not to engage in harmful, abusive, or disruptive
          behaviors, nor use our services for any illegal activities or
          unauthorized commercial gain.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          4. Intellectual Property
        </h2>
        <p>
          All assets, designs, templates, and content provided on Meadow are
          owned by or licensed to us. You may not copy, distribute, or modify
          our designs without explicit written permission from the shepherd.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='font-mono-custom border-b border-[var(--accent-black)]/5 pb-2 text-base font-semibold tracking-widest text-[var(--accent-black)] uppercase'>
          5. Termination
        </h2>
        <p>
          We reserve the right to suspend or terminate your access to the meadow
          at our sole discretion, without notice, for conduct that violates
          these Terms of Service or is harmful to other members of the flock.
        </p>
      </section>
    </LegalLayout>
  );
}
