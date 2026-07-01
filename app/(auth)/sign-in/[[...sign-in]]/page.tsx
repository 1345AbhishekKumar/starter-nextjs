'use client';

import React, { useState } from 'react';
import { useSignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { isLoaded: isUserLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [generalError, setGeneralError] = useState('');

  React.useEffect(() => {
    if (isUserLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isUserLoaded, isSignedIn, router]);

  if (isUserLoaded && isSignedIn) {
    return null;
  }

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;
    setGeneralError('');

    try {
      const res = await signIn.password({
        identifier: email,
        password: password,
      });

      if (res.error) {
        setGeneralError(
          res.error.message ||
            'Failed to sign in. Please check your credentials.',
        );
        return;
      }

      if (signIn.status === 'needs_second_factor') {
        // Send verification code for phone/SMS MFA if configured,
        // or just let user enter TOTP code.
        const firstPhoneFactor = signIn.supportedSecondFactors?.find(
          (f) => f.strategy === 'phone_code',
        );
        if (firstPhoneFactor) {
          await signIn.mfa.sendPhoneCode();
        }
      } else if (signIn.status === 'complete') {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl('/dashboard');
            if (url.startsWith('http')) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      setGeneralError(message);
    }
  };

  const handleMFAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;
    setGeneralError('');

    try {
      // Try to verify using phone code first, then fallback to TOTP
      const phoneFactorActive = signIn.supportedSecondFactors?.some(
        (f) => f.strategy === 'phone_code',
      );

      const res = phoneFactorActive
        ? await signIn.mfa.verifyPhoneCode({ code: mfaCode })
        : await signIn.mfa.verifyTOTP({ code: mfaCode });

      if (res.error) {
        setGeneralError(res.error.message || 'Invalid verification code.');
        return;
      }

      if (signIn.status === 'complete') {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl('/dashboard');
            if (url.startsWith('http')) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during verification.';
      setGeneralError(message);
    }
  };

  // Render MFA state if required
  if (signIn.status === 'needs_second_factor') {
    return (
      <div className='flex w-full flex-col'>
        <h2 className='font-handwritten mb-2 text-center text-3xl text-[#111111]'>
          Verify Account
        </h2>
        <p className='font-mono-custom mb-6 text-center text-[11px] tracking-wider text-[#525252] uppercase'>
          A second factor is required
        </p>

        <form onSubmit={handleMFAVerify} className='flex w-full flex-col'>
          <div className='mb-4'>
            <label
              htmlFor='mfa-code'
              className='font-mono-custom mb-1.5 block text-[11px] tracking-widest text-[#525252] uppercase'
            >
              Verification Code
            </label>
            <input
              id='mfa-code'
              type='text'
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              placeholder='123456'
              required
              className='font-mono-custom w-full rounded-full border border-[#111111]/10 bg-white/80 px-5 py-3 text-sm text-[#111111] placeholder-[#525252]/50 transition-colors focus:border-[#111111]/30 focus:outline-none'
            />
            {errors?.fields?.code && (
              <p className='font-mono-custom mt-1 text-xs text-red-600'>
                {errors.fields.code.message}
              </p>
            )}
          </div>

          {generalError && (
            <p className='font-mono-custom mb-4 text-center text-xs text-red-600'>
              {generalError}
            </p>
          )}

          <button
            type='submit'
            disabled={fetchStatus === 'fetching'}
            className='magnetic-btn font-mono-custom mt-2 w-full px-6 py-3.5 text-xs tracking-wider uppercase'
          >
            {fetchStatus === 'fetching' ? 'Verifying...' : 'Verify & Sign In'}
          </button>
        </form>

        <button
          onClick={() => {
            if (signIn) {
              signIn.reset();
            }
            setGeneralError('');
          }}
          className='font-mono-custom mt-6 block text-center text-[10px] tracking-widest text-[#525252]/70 uppercase transition-colors hover:text-[#111111]'
        >
          Cancel and Start Over
        </button>
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col'>
      <h2 className='font-handwritten mb-2 text-center text-3xl text-[#111111]'>
        Welcome Back
      </h2>
      <p className='font-mono-custom mb-6 text-center text-[11px] tracking-wider text-[#525252] uppercase'>
        Sign in to your creative space
      </p>

      <div className='relative flex items-center py-4'>
        <div className='grow border-t border-[#111111]/10'></div>
        <span className='font-mono-custom mx-4 shrink text-[10px] tracking-widest text-[#525252]/50 uppercase'>
          or
        </span>
        <div className='grow border-t border-[#111111]/10'></div>
      </div>

      <form onSubmit={handlePasswordSignIn} className='flex w-full flex-col'>
        {/* Email Field */}
        <div className='mb-4'>
          <label
            htmlFor='email'
            className='font-mono-custom mb-1.5 block text-[11px] tracking-widest text-[#525252] uppercase'
          >
            Email Address
          </label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='your@email.com'
            required
            className='font-mono-custom w-full rounded-full border border-[#111111]/10 bg-white/80 px-5 py-3 text-sm text-[#111111] placeholder-[#525252]/50 transition-colors focus:border-[#111111]/30 focus:outline-none'
          />
          {errors?.fields?.identifier && (
            <p className='font-mono-custom mt-1 text-xs text-red-600'>
              {errors.fields.identifier.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className='mb-6'>
          <label
            htmlFor='password'
            className='font-mono-custom mb-1.5 block text-[11px] tracking-widest text-[#525252] uppercase'
          >
            Password
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='••••••••'
            required
            className='font-mono-custom w-full rounded-full border border-[#111111]/10 bg-white/80 px-5 py-3 text-sm text-[#111111] placeholder-[#525252]/50 transition-colors focus:border-[#111111]/30 focus:outline-none'
          />
          {errors?.fields?.password && (
            <p className='font-mono-custom mt-1 text-xs text-red-600'>
              {errors.fields.password.message}
            </p>
          )}
        </div>

        {generalError && (
          <p className='font-mono-custom mb-4 text-center text-xs text-red-600'>
            {generalError}
          </p>
        )}

        <button
          type='submit'
          disabled={fetchStatus === 'fetching'}
          className='magnetic-btn font-mono-custom mt-2 w-full px-6 py-3.5 text-xs tracking-wider uppercase'
        >
          {fetchStatus === 'fetching' ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <span className='font-mono-custom mt-8 block text-center text-xs text-[#525252]/70'>
        New to the meadow?{' '}
        <Link
          href='/sign-up'
          className='font-semibold text-[#6e9c4e] hover:underline'
        >
          Join the flock
        </Link>
      </span>
    </div>
  );
}
