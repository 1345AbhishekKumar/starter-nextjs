'use client';

import React, { useState } from 'react';
import { useSignUp, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

  const handlePasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    setGeneralError('');

    try {
      const res = await signUp.create({
        username: username,
        emailAddress: email,
        password: password,
      });

      if (res.error) {
        setGeneralError(res.error.message || 'Failed to create account.');
        return;
      }

      // Send the email verification code
      const sendCodeRes = await signUp.verifications.sendEmailCode();
      if (sendCodeRes.error) {
        setGeneralError(
          sendCodeRes.error.message || 'Failed to send verification code.',
        );
        return;
      }

      setMode('verify-otp');
    } catch (err: unknown) {
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
      const res = await signUp.verifications.verifyEmailCode({
        code: otpCode,
      });

      if (res.error) {
        setGeneralError(res.error.message || 'Invalid verification code.');
        return;
      }

      // Check both the verification result error and final status
      if (!res.error) {
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
      const message =
        err instanceof Error ? err.message : 'Verification error.';
      setGeneralError(message);
    }
  };

  const handleResendCode = async () => {
    if (!signUp) return;
    setGeneralError('');
    try {
      const res = await signUp.verifications.sendEmailCode();
      if (res.error) {
        setGeneralError(res.error.message || 'Failed to resend code.');
      } else {
        alert('A new verification code has been sent to your email.');
      }
    } catch (err: unknown) {
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
