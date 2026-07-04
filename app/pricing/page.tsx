import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { PricingClient } from '@/components/pricing/PricingClient';
import { Navbar1 } from '@/components/sections/navbar-1';

export const metadata = {
  title: 'Pricing & Plans | Meadow',
};

export default async function PricingPage() {
  const { userId } = await auth();

  let currentPriceId: string | null = null;
  let isSubscribed = false;

  if (userId) {
    const subRecord = await db.query.subscriptions.findFirst({
      where: (s, { eq, and, or }) =>
        and(
          eq(s.userId, userId),
          or(eq(s.status, 'active'), eq(s.status, 'trialing')),
        ),
    });
    if (subRecord) {
      currentPriceId = subRecord.priceId;
      isSubscribed = true;
    }
  }

  return (
    <div className='relative flex min-h-screen flex-col bg-[#f9f8f6]'>
      <div className='paper-texture'></div>
      <Navbar1 />
      <main className='relative z-10 flex-1 px-6 py-24 md:py-32'>
        <PricingClient
          userId={userId}
          currentPriceId={currentPriceId}
          isSubscribed={isSubscribed}
          proPriceId={
            process.env.STRIPE_PRO_PRICE_ID || 'price_pro_placeholder'
          }
          enterprisePriceId={
            process.env.STRIPE_ENTERPRISE_PRICE_ID ||
            'price_enterprise_placeholder'
          }
        />
      </main>
    </div>
  );
}
