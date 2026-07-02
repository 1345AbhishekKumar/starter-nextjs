'use client';

import React, { useState } from 'react';
import { useSignUp, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logger } from '@/lib/logger';

export default function SignUpPage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isLoaded: isUserLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [mode, setMode] = useState<'signup' | 'verify-otp'>('signup');

  React.useEffect(() => {
    if (isUserLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isUserLoaded, isSignedIn, router]);

  if (isUserLoaded && isSignedIn) {
    return null;
  }

  const handleGoogleSignUp = async () => {
    if (!signUp) return;
    setGeneralError('');
    try {
      logger.info('Initiating Google OAuth sign-up');
      const res = await signUp.sso({
        strategy: 'oauth_google',
        redirectUrl: '/dashboard',
        redirectCallbackUrl: '/sso-callback',
      });
      if (res.error) {
        logger.warn(
          { error: res.error },
          'Google OAuth sign-up returned error',
        );
        setGeneralError(res.error.message || 'Google sign-up failed.');
      }
    } catch (err: unknown) {
      const errorDetails =
        err instanceof Error
          ? { message: err.message, name: err.name, stack: err.stack }
          : err;
      logger.error(
        { error: errorDetails },
        'Google OAuth sign-up unexpected error',
      );
      setGeneralError(
        err instanceof Error ? err.message : 'Google sign-up failed.',
      );
    }
  };

  const handleGithubSignUp = async () => {
    if (!signUp) return;
    setGeneralError('');
    try {
      logger.info('Initiating GitHub OAuth sign-up');
      const res = await signUp.sso({
        strategy: 'oauth_github',
        redirectUrl: '/dashboard',
        redirectCallbackUrl: '/sso-callback',
      });
      if (res.error) {
        logger.warn(
          { error: res.error },
          'GitHub OAuth sign-up returned error',
        );
        setGeneralError(res.error.message || 'GitHub sign-up failed.');
      }
    } catch (err: unknown) {
      const errorDetails =
        err instanceof Error
          ? { message: err.message, name: err.name, stack: err.stack }
          : err;
      logger.error(
        { error: errorDetails },
        'GitHub OAuth sign-up unexpected error',
      );
      setGeneralError(
        err instanceof Error ? err.message : 'GitHub sign-up failed.',
      );
    }
  };

  const handlePasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    setGeneralError('');

    try {
      logger.info({ username, email }, 'Attempting password sign-up');
      const res = await signUp.create({
        username: username,
        emailAddress: email,
        password: password,
      });

      if (res.error) {
        logger.warn(
          { error: res.error, username, email },
          'Clerk password sign-up returned error status',
        );
        setGeneralError(res.error.message || 'Failed to create account.');
        return;
      }

      // Send the email verification code
      logger.info({ email }, 'Sending email verification code');
      const sendCodeRes = await signUp.verifications.sendEmailCode();
      if (sendCodeRes.error) {
        logger.warn(
          { error: sendCodeRes.error, email },
          'Failed to send Clerk verification code',
        );
        setGeneralError(
          sendCodeRes.error.message || 'Failed to send verification code.',
        );
        return;
      }

      logger.info(
        { email },
        'Verification code sent successfully, switching to OTP verification mode',
      );
      setMode('verify-otp');
    } catch (err: unknown) {
      logger.error(
        { error: err, username, email },
        'Unexpected error during password sign-up',
      );
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      setGeneralError(message);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    setGeneralError('');

    try {
      logger.info({ email }, 'Attempting email OTP verification');
      const res = await signUp.verifications.verifyEmailCode({
        code: otpCode,
      });

      if (res.error) {
        logger.warn(
          { error: res.error, email },
          'Clerk OTP verification returned error status',
        );
        setGeneralError(res.error.message || 'Invalid verification code.');
        return;
      }

      // Check both the verification result error and final status
      if (!res.error) {
        logger.info({ email }, 'OTP verified successfully, finalizing sign-up');
        await signUp.finalize({
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
        'Unexpected error during email OTP verification',
      );
      const message =
        err instanceof Error ? err.message : 'Verification error.';
      setGeneralError(message);
    }
  };

  const handleResendCode = async () => {
    if (!signUp) return;
    setGeneralError('');
    try {
      logger.info({ email }, 'Attempting to resend verification code');
      const res = await signUp.verifications.sendEmailCode();
      if (res.error) {
        logger.warn(
          { error: res.error, email },
          'Failed to resend Clerk verification code',
        );
        setGeneralError(res.error.message || 'Failed to resend code.');
      } else {
        logger.info({ email }, 'Resent verification code successfully');
        alert('A new verification code has been sent to your email.');
      }
    } catch (err: unknown) {
      logger.error(
        { error: err, email },
        'Unexpected error during resending verification code',
      );
      const message =
        err instanceof Error ? err.message : 'Failed to resend code.';
      setGeneralError(message);
    }
  };

  // Render Verification OTP form if code is sent
  return (
    <div className='flex w-full flex-col'>
      {mode === 'verify-otp' ? (
        <>
          <h2 className='font-handwritten mb-2 text-center text-3xl text-[#111111]'>
            Verify Email
          </h2>
          <p className='font-mono-custom mb-6 text-center text-[11px] tracking-wider text-[#525252] uppercase'>
            Enter the code sent to {email}
          </p>

          <form onSubmit={handleVerifyOTP} className='flex w-full flex-col'>
            <div className='mb-4'>
              <label
                htmlFor='otp-code'
                className='font-mono-custom mb-1.5 block text-[11px] tracking-widest text-[#525252] uppercase'
              >
                One-Time Code
              </label>
              <input
                id='otp-code'
                type='text'
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
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
              {fetchStatus === 'fetching'
                ? 'Verifying...'
                : 'Verify & Complete'}
            </button>
          </form>

          <div className='mt-6 flex flex-col items-center gap-3'>
            <button
              onClick={handleResendCode}
              className='font-mono-custom text-[10px] font-semibold tracking-widest text-[#6e9c4e] uppercase hover:underline'
            >
              I need a new code
            </button>

            <button
              onClick={() => {
                if (signUp) {
                  logger.info(
                    { email },
                    'OTP verification flow cancelled by user',
                  );
                  signUp.reset();
                }
                setMode('signup');
                setGeneralError('');
              }}
              className='font-mono-custom text-[10px] tracking-widest text-[#525252]/70 uppercase transition-colors hover:text-[#111111]'
            >
              Cancel and Start Over
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className='font-handwritten mb-2 text-center text-3xl text-[#111111]'>
            Join the Flock
          </h2>
          <p className='font-mono-custom mb-6 text-center text-[11px] tracking-wider text-[#525252] uppercase'>
            Create your meadow account
          </p>

          {/* Social OAuth Buttons */}
          <div className='flex flex-col gap-3'>
            {/* Google OAuth */}
            <button
              type='button'
              onClick={handleGoogleSignUp}
              disabled={!signUp || fetchStatus === 'fetching'}
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
                : 'Sign up with Google'}
            </button>

            {/* GitHub OAuth */}
            <button
              type='button'
              onClick={handleGithubSignUp}
              disabled={!signUp || fetchStatus === 'fetching'}
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
                : 'Sign up with GitHub'}
            </button>
          </div>

          <div className='relative flex items-center py-4'>
            <div className='grow border-t border-[#111111]/10'></div>
            <span className='font-mono-custom mx-4 shrink text-[10px] tracking-widest text-[#525252]/50 uppercase'>
              or
            </span>
            <div className='grow border-t border-[#111111]/10'></div>
          </div>

          <form
            onSubmit={handlePasswordSignUp}
            className='flex w-full flex-col'
          >
            {/* Username Field */}
            <div className='mb-4'>
              <label
                htmlFor='username'
                className='font-mono-custom mb-1.5 block text-[11px] tracking-widest text-[#525252] uppercase'
              >
                Username
              </label>
              <input
                id='username'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='username'
                required
                className='font-mono-custom w-full rounded-full border border-[#111111]/10 bg-white/80 px-5 py-3 text-sm text-[#111111] placeholder-[#525252]/50 transition-colors focus:border-[#111111]/30 focus:outline-none'
              />
              {errors?.fields?.username && (
                <p className='font-mono-custom mt-1 text-xs text-red-600'>
                  {errors.fields.username.message}
                </p>
              )}
            </div>

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
              {errors?.fields?.emailAddress && (
                <p className='font-mono-custom mt-1 text-xs text-red-600'>
                  {errors.fields.emailAddress.message}
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
              {fetchStatus === 'fetching' ? 'Joining...' : 'Create Account'}
            </button>
          </form>

          <span className='font-mono-custom mt-8 block text-center text-xs text-[#525252]/70'>
            Already a creator?{' '}
            <Link
              href='/sign-in'
              className='font-semibold text-[#6e9c4e] hover:underline'
            >
              Sign in
            </Link>
          </span>
        </>
      )}

      {/* Required for sign-up flows with Clerk, always present in the DOM */}
      <div id='clerk-captcha' />
    </div>
  );
}
