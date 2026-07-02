'use client';

import React, { useState } from 'react';
import { useSignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logger } from '@/lib/logger';

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

  const handleGoogleSignIn = async () => {
    if (!signIn) return;
    setGeneralError('');
    try {
      logger.info('Initiating Google OAuth sign-in');
      const res = await signIn.sso({
        strategy: 'oauth_google',
        redirectUrl: '/dashboard',
        redirectCallbackUrl: '/sso-callback',
      });
      if (res.error) {
        logger.warn(
          { error: res.error },
          'Google OAuth sign-in returned error',
        );
        setGeneralError(res.error.message || 'Google sign-in failed.');
      }
    } catch (err: unknown) {
      const errorDetails =
        err instanceof Error
          ? { message: err.message, name: err.name, stack: err.stack }
          : err;
      logger.error(
        { error: errorDetails },
        'Google OAuth sign-in unexpected error',
      );
      setGeneralError(
        err instanceof Error ? err.message : 'Google sign-in failed.',
      );
    }
  };

  const handleGithubSignIn = async () => {
    if (!signIn) return;
    setGeneralError('');
    try {
      logger.info('Initiating GitHub OAuth sign-in');
      const res = await signIn.sso({
        strategy: 'oauth_github',
        redirectUrl: '/dashboard',
        redirectCallbackUrl: '/sso-callback',
      });
      if (res.error) {
        logger.warn(
          { error: res.error },
          'GitHub OAuth sign-in returned error',
        );
        setGeneralError(res.error.message || 'GitHub sign-in failed.');
      }
    } catch (err: unknown) {
      const errorDetails =
        err instanceof Error
          ? { message: err.message, name: err.name, stack: err.stack }
          : err;
      logger.error(
        { error: errorDetails },
        'GitHub OAuth sign-in unexpected error',
      );
      setGeneralError(
        err instanceof Error ? err.message : 'GitHub sign-in failed.',
      );
    }
  };

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;
    setGeneralError('');

    try {
      logger.info({ email }, 'Attempting password sign-in');
      const res = await signIn.password({
        identifier: email,
        password: password,
      });

      if (res.error) {
        logger.warn(
          { error: res.error, email },
          'Clerk password sign-in returned error status',
        );
        setGeneralError(
          res.error.message ||
            'Failed to sign in. Please check your credentials.',
        );
        return;
      }

      if (signIn.status === 'needs_second_factor') {
        logger.info(
          { email },
          'Password sign-in requires second factor verification',
        );
        // Send verification code for phone/SMS MFA if configured,
        // or just let user enter TOTP code.
        const firstPhoneFactor = signIn.supportedSecondFactors?.find(
          (f) => f.strategy === 'phone_code',
        );
        if (firstPhoneFactor) {
          await signIn.mfa.sendPhoneCode();
        }
      } else if (signIn.status === 'complete') {
        logger.info({ email }, 'Password sign-in successful');
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
      logger.error(
        { error: err, email },
        'Unexpected error during password sign-in',
      );
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
      logger.info('Attempting MFA verification');
      // Try to verify using phone code first, then fallback to TOTP
      const phoneFactorActive = signIn.supportedSecondFactors?.some(
        (f) => f.strategy === 'phone_code',
      );

      const res = phoneFactorActive
        ? await signIn.mfa.verifyPhoneCode({ code: mfaCode })
        : await signIn.mfa.verifyTOTP({ code: mfaCode });

      if (res.error) {
        logger.warn(
          { error: res.error },
          'Clerk MFA verification returned error status',
        );
        setGeneralError(res.error.message || 'Invalid verification code.');
        return;
      }

      if (signIn.status === 'complete') {
        logger.info('MFA verification successful');
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
      logger.error({ error: err }, 'Unexpected error during MFA verification');
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
              logger.info('MFA sign-in flow cancelled by user');
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

      {/* Social OAuth Buttons */}
      <div className='flex flex-col gap-3'>
        {/* Google OAuth */}
        <button
          type='button'
          onClick={handleGoogleSignIn}
          disabled={!signIn || fetchStatus === 'fetching'}
          className='outline-btn font-mono-custom flex w-full items-center justify-center gap-3 px-6 py-3.5 text-xs tracking-wider uppercase disabled:cursor-not-allowed disabled:opacity-50'
        >
          <svg viewBox='0 0 24 24' width='16' height='16' className='mr-1'>
            <path
              fill='#4285F4'
              d='M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.5-.1.37-.9 2.51l3.05 2.37c1.78-1.64 2.81-4.06 2.81-6.73z'
            />
            <path
              fill='#34A853'
              d='M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.05-2.37c-.9.6-2.01.96-3.21.96-3.11 0-5.74-2.1-6.68-4.96L3.9 17.58C5.88 21.5 9.95 24 12 24z'
            />
            <path
              fill='#FBBC05'
              d='M5.32 14.72c-.24-.7-.38-1.46-.38-2.22s.14-1.52.38-2.22L1.82 7.56C.66 9.89 0 12.06 0 12.5s.66 2.61 1.82 4.94l3.5-2.72z'
            />
            <path
              fill='#EA4335'
              d='M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 9.95 0 5.88 2.5 3.9 6.42l3.5 2.72c.94-2.86 3.57-4.96 6.6--4.96z'
            />
          </svg>
          {fetchStatus === 'fetching'
            ? 'Redirecting...'
            : 'Sign in with Google'}
        </button>

        {/* GitHub OAuth */}
        <button
          type='button'
          onClick={handleGithubSignIn}
          disabled={!signIn || fetchStatus === 'fetching'}
          className='outline-btn font-mono-custom flex w-full items-center justify-center gap-3 px-6 py-3.5 text-xs tracking-wider uppercase disabled:cursor-not-allowed disabled:opacity-50'
        >
          <svg
            viewBox='0 0 24 24'
            width='16'
            height='16'
            className='mr-1'
            fill='currentColor'
          >
            <path d='M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z' />
          </svg>
          {fetchStatus === 'fetching'
            ? 'Redirecting...'
            : 'Sign in with GitHub'}
        </button>
      </div>

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
