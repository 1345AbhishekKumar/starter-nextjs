'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getSubscriptionStatus, createPortalSession } from '@/actions/stripe';
import { CreditCard, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function BillingSettings() {
  const [portalError, setPortalError] = useState<string | null>(null);

  // 1. Fetch Subscription Status via TanStack Query
  const {
    data: subscription,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const res = await getSubscriptionStatus();
      if (!res.success) {
        throw new Error(res.error || 'Failed to fetch subscription');
      }
      return res.data;
    },
  });

  // 2. Redirect to Customer Portal Mutation
  const portalMutation = useMutation({
    mutationFn: async () => {
      setPortalError(null);
      const res = await createPortalSession();
      if (!res.success || !res.url) {
        throw new Error(res.error || 'Failed to create portal session');
      }
      return res.url;
    },
    onSuccess: (url) => {
      window.location.href = url;
    },
    onError: (err: Error) => {
      setPortalError(
        err.message || 'Failed to open billing portal. Please try again.',
      );
    },
  });

  if (isLoading) {
    return (
      <div className='flex h-48 flex-col items-center justify-center gap-3'>
        <Loader2 size={24} className='animate-spin text-[#6e9c4e]' />
        <p className='font-mono-custom text-[10px] tracking-widest text-[#525252]/60 uppercase'>
          Loading billing records...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-6 text-center'>
        <p className='font-mono-custom text-xs tracking-wider text-red-500 uppercase'>
          Failed to load subscription info.
        </p>
      </div>
    );
  }

  const isPro = !!subscription?.isPro;
  const isEnterprise = !!subscription?.isEnterprise;
  const isActive =
    subscription?.status === 'active' || subscription?.status === 'trialing';

  let tierName = 'Free Plan';
  let tierDesc =
    'Quiet reflection for slow-paced thoughts. Limited active drafts.';

  if (isActive) {
    if (isPro) {
      tierName = 'Pro Creator';
      tierDesc =
        'Unlimited draft creation, priority AI reflections, and fast models.';
    } else if (isEnterprise) {
      tierName = 'Enterprise Flock';
      tierDesc =
        'Custom system prompt, dedicated support, and multi-author team space.';
    } else {
      tierName = 'Custom Plan';
      tierDesc = 'Active premium billing subscription.';
    }
  }

  return (
    <div className='space-y-8'>
      {/* Current Tier Overview */}
      <div className='flex flex-col gap-6 rounded-2xl border border-[#111111]/5 bg-[#6e9c4e]/5 p-6 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-start gap-4'>
          <div className='mt-1 flex size-10 items-center justify-center rounded-full bg-[#6e9c4e]/10 text-[#6e9c4e]'>
            {isActive ? <Sparkles size={18} /> : <CreditCard size={18} />}
          </div>
          <div>
            <p className='font-mono-custom text-[9px] tracking-widest text-[#6e9c4e] uppercase'>
              Current Plan
            </p>
            <h4 className='font-handwritten mt-1 text-3xl font-normal text-[#111111]'>
              {tierName}
            </h4>
            <p className='font-mono-custom mt-2 text-xs tracking-wide text-[#525252] md:max-w-md'>
              {tierDesc}
            </p>
          </div>
        </div>

        {isActive ? (
          <button
            onClick={() => portalMutation.mutate()}
            disabled={portalMutation.isPending}
            className='outline-btn font-mono-custom self-start border-[#111111]/30 bg-transparent px-5 py-3 text-[10px] tracking-wider uppercase hover:border-[#111111] md:self-auto'
          >
            {portalMutation.isPending ? (
              <span className='flex items-center gap-1.5'>
                <Loader2 size={12} className='animate-spin' />
                Opening...
              </span>
            ) : (
              <span className='flex items-center gap-1.5'>
                Manage Billing
                <ExternalLink size={11} />
              </span>
            )}
          </button>
        ) : (
          <Link href='/pricing' className='self-start md:self-auto'>
            <button className='magnetic-btn font-mono-custom px-5 py-3 text-[10px] tracking-wider uppercase'>
              Upgrade Plan
            </button>
          </Link>
        )}
      </div>

      {portalError && (
        <div className='font-mono-custom text-xs tracking-wider text-red-500 uppercase'>
          {portalError}
        </div>
      )}

      {/* Subscription Expiry Details */}
      {isActive && subscription?.currentPeriodEnd && (
        <div className='border-t border-[#111111]/5 pt-6'>
          <div className='flex items-center justify-between text-xs'>
            <span className='font-mono-custom tracking-wider text-[#525252] uppercase'>
              Renewal / Expiry Date
            </span>
            <span className='font-mono-custom font-semibold text-[#111111]'>
              {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                undefined,
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                },
              )}
            </span>
          </div>
          <div className='mt-2 flex items-center justify-between text-xs'>
            <span className='font-mono-custom tracking-wider text-[#525252] uppercase'>
              Status
            </span>
            <span className='font-mono-custom rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-[#009966] uppercase'>
              {subscription.status}
            </span>
          </div>
          <div className='mt-2 flex items-center justify-between text-xs'>
            <span className='font-mono-custom tracking-wider text-[#525252] uppercase'>
              Plan
            </span>
            <span className='font-mono-custom font-semibold text-[#111111] uppercase'>
              {isPro ? 'Pro' : isEnterprise ? 'Enterprise' : 'Custom'}
            </span>
          </div>
        </div>
      )}

      {/* FAQs or Billing Notes */}
      <div className='rounded-2xl border border-[#111111]/5 p-6'>
        <h5 className='font-mono-custom text-xs font-semibold tracking-wider text-[#111111] uppercase'>
          Billing Questions
        </h5>
        <div className='font-mono-custom mt-4 space-y-4 text-xs text-[#525252]'>
          <div>
            <p className='font-semibold text-[#111111]'>
              Can I change plans mid-billing cycle?
            </p>
            <p className='mt-1 leading-relaxed'>
              Yes, Stripe handles proration automatically. Upgrading takes
              effect instantly, and downgrades apply at the end of the current
              period.
            </p>
          </div>
          <div>
            <p className='font-semibold text-[#111111]'>
              How do I update payment cards?
            </p>
            <p className='mt-1 leading-relaxed'>
              Use the &quot;Manage Billing&quot; button above to access the
              secure customer portal where you can update card details and
              download invoices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
