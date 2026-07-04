'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { createCheckoutSession } from '@/actions/stripe';

interface PricingClientProps {
  userId: string | null;
  currentPriceId: string | null;
  isSubscribed: boolean;
  proPriceId: string;
  enterprisePriceId: string;
}

export function PricingClient({
  userId,
  currentPriceId,
  isSubscribed,
  proPriceId,
  enterprisePriceId,
}: PricingClientProps) {
  const router = useRouter();
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    if (!userId) {
      router.push('/sign-in?redirect_url=/pricing');
      return;
    }

    setLoadingPriceId(priceId);
    setError(null);

    const result = await createCheckoutSession(priceId);

    if (result.success && result.url) {
      // eslint-disable-next-line react-hooks/immutability
      window.location.href = result.url;
    } else {
      setError(
        result.error || 'Failed to initiate purchase. Please try again.',
      );
      setLoadingPriceId(null);
    }
  };

  const plans = [
    {
      name: 'Free Plan',
      price: '$0',
      description: 'Quiet reflection for slow-paced thoughts.',
      features: [
        'Up to 3 active journal drafts',
        'Standard AI summarization models',
        'Normal priority processing',
      ],
      priceId: 'free',
      isFree: true,
      actionText: isSubscribed ? 'Downgrade' : 'Current Plan',
      isActive: !isSubscribed,
    },
    {
      name: 'Pro Creator',
      price: '$15',
      period: '/ month',
      description: 'Perfect for passionate, consistent writers.',
      features: [
        'Unlimited active journal drafts',
        'Priority NVIDIA NIM and OpenRouter models',
        'Fast summarization reflection speeds',
        'Custom category classification',
      ],
      priceId: proPriceId,
      isFree: false,
      actionText:
        currentPriceId === proPriceId ? 'Current Plan' : 'Subscribe to Pro',
      isActive: currentPriceId === proPriceId,
    },
    {
      name: 'Enterprise Flock',
      price: '$49',
      period: '/ month',
      description: 'Ideal for publishing teams and large workspaces.',
      features: [
        'Dedicated system prompt controls',
        'High-frequency model limit caps',
        'Multi-author team workflows',
        'Priority dedicated support',
      ],
      priceId: enterprisePriceId,
      isFree: false,
      actionText:
        currentPriceId === enterprisePriceId
          ? 'Current Plan'
          : 'Subscribe to Enterprise',
      isActive: currentPriceId === enterprisePriceId,
    },
  ];

  return (
    <div className='mx-auto w-full max-w-[1100px]'>
      {/* Title Header */}
      <div className='mb-16 text-center'>
        <p className='font-mono-custom mb-3 text-[11px] tracking-[0.2em] text-[#6e9c4e] uppercase'>
          Pricing & Subscriptions
        </p>
        <h1 className='font-handwritten text-6xl font-normal text-[#111111] md:text-7xl'>
          Choose Your Pace.
        </h1>
        <p className='font-mono-custom mx-auto mt-6 max-w-lg text-[13px] leading-relaxed tracking-wider text-[#525252]'>
          Select the model tier that matches your creative workflow. No locked
          contracts. Upgrade or cancel anytime.
        </p>
        {error && (
          <div className='font-mono-custom mt-6 text-xs tracking-wider text-red-500 uppercase'>
            {error}
          </div>
        )}
      </div>

      {/* Plans Layout Grid */}
      <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        {plans.map((plan) => {
          const isLoading = loadingPriceId === plan.priceId;

          return (
            <div
              key={plan.name}
              className={`bento-cell flex flex-col justify-between p-8 ${
                plan.name.includes('Pro')
                  ? 'border-2 border-[#6e9c4e]/40 shadow-md'
                  : ''
              }`}
            >
              <div>
                {/* Badge for Popularity */}
                {plan.name.includes('Pro') && (
                  <div className='mb-4 self-start'>
                    <span className='font-mono-custom rounded-full bg-[#6e9c4e]/15 px-3 py-1 text-[9px] tracking-wider text-[#6e9c4e] uppercase'>
                      Recommended
                    </span>
                  </div>
                )}

                <h3 className='font-mono-custom text-sm font-semibold tracking-wider text-[#111111] uppercase'>
                  {plan.name}
                </h3>

                <div className='mt-4 flex items-baseline text-[#111111]'>
                  <span className='font-handwritten text-6xl font-normal tracking-tight'>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className='font-mono-custom ml-1 text-[11px] tracking-widest text-[#525252]/60 uppercase'>
                      {plan.period}
                    </span>
                  )}
                </div>

                <p className='font-mono-custom mt-4 text-xs tracking-wide text-[#525252]'>
                  {plan.description}
                </p>

                {/* Features List */}
                <ul className='my-8 space-y-4'>
                  {plan.features.map((feature) => (
                    <li key={feature} className='flex items-start gap-3'>
                      <div className='mt-0.5 flex size-4 items-center justify-center rounded-full bg-[#6e9c4e]/10 text-[#6e9c4e]'>
                        <Check size={10} />
                      </div>
                      <span className='font-mono-custom text-[11px] tracking-wide text-[#525252]'>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              {plan.isFree ? (
                <button
                  disabled
                  className='outline-btn font-mono-custom w-full border-[#111111]/10 py-3 text-[10px] tracking-wider uppercase opacity-50'
                >
                  {plan.actionText}
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.priceId)}
                  disabled={plan.isActive || loadingPriceId !== null}
                  className={`font-mono-custom w-full py-3 text-[10px] tracking-wider uppercase transition-all ${
                    plan.isActive
                      ? 'outline-btn cursor-not-allowed border-[#111111]/20 opacity-70'
                      : 'magnetic-btn'
                  }`}
                >
                  {isLoading ? (
                    <span className='flex items-center justify-center gap-1.5'>
                      <Loader2 size={12} className='animate-spin' />
                      Processing...
                    </span>
                  ) : (
                    plan.actionText
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
