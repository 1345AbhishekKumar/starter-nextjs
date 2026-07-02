'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useUser,
  useAuth,
  useSessionList,
  useReverification,
} from '@clerk/nextjs';
import { isReverificationCancelledError } from '@clerk/nextjs/errors';
import {
  Key,
  Shield,
  Smartphone,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  Laptop,
  CheckCircle2,
  Lock,
  Plus,
} from 'lucide-react';

import {
  changePasswordSchema,
  type ChangePasswordInput,
} from '@/lib/validations/security';
import { changePassword, revokeSessionAction } from '@/actions/security';
import { deleteAccount } from '@/actions/profile';

export function SecuritySettings() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { sessionId: currentSessionId, signOut } = useAuth();
  const { sessions, isLoaded: isSessionsLoaded } = useSessionList();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
      signOutOthers: false,
    },
  });

  const onSubmitPassword = async (data: ChangePasswordInput) => {
    setSuccessMessage(null);
    const res = await changePassword(data);

    if (res.success) {
      setSuccessMessage('Password changed successfully.');
      reset();
      setIsPasswordOpen(false);
    } else {
      alert(res.error || 'Failed to change password.');
    }

    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleRevokeDevice = async (id: string) => {
    try {
      const res = await revokeSessionAction(id);
      if (res.success) {
        setSuccessMessage('Device session revoked successfully.');
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        alert(res.error || 'Failed to revoke device session.');
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to revoke device session.';
      alert(message);
    }
  };

  const createPasskeyWithReverification = useReverification(async () => {
    if (user) {
      await user.createPasskey();
    }
  });

  const handleAddPasskey = async () => {
    try {
      if (user) {
        await createPasskeyWithReverification();
        setSuccessMessage('New passkey registered successfully.');
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      if (isReverificationCancelledError(err)) {
        return;
      }
      console.error('Error adding passkey:', err);
      const message =
        err instanceof Error ? err.message : 'Failed to register passkey.';
      alert(message);
    }
  };

  const handleDeletePasskey = async (id: string) => {
    try {
      const passkey = user?.passkeys.find((p) => p.id === id);
      if (passkey) {
        await passkey.delete();
        setSuccessMessage('Passkey deleted.');
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete passkey.';
      alert(message);
    }
  };

  const handleDeleteAccount = async () => {
    const doubleConfirm = window.confirm(
      'WARNING: This is permanent and irreversible. This will permanently delete your user record, active sessions, and database profile details. Are you absolutely sure you want to proceed?',
    );

    if (!doubleConfirm) return;

    try {
      const res = await deleteAccount();
      if (res.success) {
        await signOut();
        window.location.href = '/sign-in';
      } else {
        alert(res.error || 'Failed to delete account.');
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete account.';
      alert(message);
    }
  };

  if (!isUserLoaded || !isSessionsLoaded) {
    return (
      <div className='flex h-48 items-center justify-center'>
        <Loader2 className='size-6 animate-spin text-[#6e9c4e]' />
      </div>
    );
  }

  const passkeys = user?.passkeys || [];
  const activeSessions = sessions || [];

  return (
    <div className='space-y-8 text-[#111111]'>
      {successMessage && (
        <div className='font-mono-custom flex items-center gap-2 rounded-2xl border border-[#009966]/20 bg-[#ECFDF5] p-4 text-xs tracking-wide text-[#009966]'>
          <CheckCircle2 size={16} className='text-[#009966]' />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 1. PASSWORD SECTION */}
      <div className='space-y-4'>
        {!isPasswordOpen ? (
          <div className='flex items-center justify-between'>
            <div className='flex items-start gap-4'>
              <div className='mt-0.5 flex size-9 items-center justify-center rounded-full bg-[#111111]/5 text-[#111111]'>
                <Lock size={16} />
              </div>
              <div>
                <h4 className='text-sm font-semibold text-[#111111]'>
                  Password
                </h4>
                <p className='font-mono-custom mt-1 text-[9px] tracking-widest text-[#525252]/60 uppercase'>
                  Set a secure password for your account
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPasswordOpen(true)}
              className='outline-btn font-mono-custom border-[#111111]/25 bg-transparent px-4 py-2 text-[9px] tracking-wider text-[#111111] uppercase hover:border-[#111111]'
            >
              Change
            </button>
          </div>
        ) : (
          <div className='rounded-2xl border border-[#111111]/5 bg-[#111111]/5 p-5'>
            <h5 className='mb-5 text-sm font-semibold text-[#111111]'>
              Set password
            </h5>

            <form
              onSubmit={handleSubmit(onSubmitPassword)}
              className='max-w-md space-y-5'
            >
              {/* New Password */}
              <div className='flex flex-col gap-2'>
                <label className='text-xs font-semibold text-[#111111]'>
                  New password
                </label>
                <div className='relative'>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    {...register('newPassword')}
                    className={`w-full rounded-full border bg-white px-4 py-2.5 pr-10 text-xs text-[#111111] placeholder-[#525252]/30 transition-colors outline-none focus:border-[#111111]/30 ${
                      errors.newPassword
                        ? 'border-[#dc2626]'
                        : 'border-[#111111]/15'
                    }`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className='absolute top-3 right-3.5 text-[#525252]/50 hover:text-[#111111]'
                  >
                    {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <span className='font-mono-custom mt-1.5 flex items-center gap-1.5 text-[10px] tracking-wider text-[#dc2626] uppercase'>
                    <AlertCircle size={12} />
                    {errors.newPassword.message}
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div className='flex flex-col gap-2'>
                <label className='text-xs font-semibold text-[#111111]'>
                  Confirm password
                </label>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    className={`w-full rounded-full border bg-white px-4 py-2.5 pr-10 text-xs text-[#111111] placeholder-[#525252]/30 transition-colors outline-none focus:border-[#111111]/30 ${
                      errors.confirmPassword
                        ? 'border-[#dc2626]'
                        : 'border-[#111111]/15'
                    }`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute top-3 right-3.5 text-[#525252]/50 hover:text-[#111111]'
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className='font-mono-custom mt-1.5 flex items-center gap-1.5 text-[10px] tracking-wider text-[#dc2626] uppercase'>
                    <AlertCircle size={12} />
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              {/* Sign out Checkbox */}
              <div className='flex items-start gap-2.5 pt-2'>
                <input
                  type='checkbox'
                  id='signOutOthers'
                  {...register('signOutOthers')}
                  className='mt-1 size-4 cursor-pointer rounded border-[#111111]/20 bg-white text-[#111111] focus:ring-0 focus:ring-offset-0'
                />
                <div className='flex flex-col'>
                  <label
                    htmlFor='signOutOthers'
                    className='cursor-pointer text-xs leading-tight font-semibold text-[#111111]'
                  >
                    Sign out of all other devices
                  </label>
                  <span className='mt-1 text-[10px] leading-relaxed text-[#525252]/70'>
                    It is recommended to sign out of all other devices which may
                    have used your old password.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex items-center justify-end gap-5 pt-3'>
                <button
                  type='button'
                  onClick={() => {
                    setIsPasswordOpen(false);
                    reset();
                  }}
                  className='font-mono-custom text-xs tracking-wider text-[#525252] uppercase transition-colors hover:text-[#111111]'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='magnetic-btn font-mono-custom rounded-full bg-[#111111] px-5 py-2.5 text-[10px] tracking-wider text-white uppercase transition-colors hover:opacity-90 disabled:opacity-50'
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* 2. PASSKEYS SECTION */}
      <div className='space-y-4 border-t border-[#111111]/5 pt-6'>
        <div className='flex items-start gap-4'>
          <div className='mt-0.5 flex size-9 items-center justify-center rounded-full bg-[#111111]/5 text-[#111111]'>
            <Key size={16} />
          </div>
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-sm font-semibold text-[#111111]'>
                  Passkeys
                </h4>
                <p className='font-mono-custom mt-1 text-[9px] tracking-widest text-[#525252]/60 uppercase'>
                  Secure passwordless authentication
                </p>
              </div>
              <button
                onClick={handleAddPasskey}
                className='outline-btn font-mono-custom flex items-center gap-1 border-[#111111]/25 bg-transparent px-3 py-1.5 text-[9px] tracking-wider text-[#111111] uppercase hover:border-[#111111]'
              >
                <Plus size={10} />
                Add
              </button>
            </div>

            {/* Passkeys List */}
            <div className='mt-4 space-y-3'>
              {passkeys.length === 0 ? (
                <p className='font-mono-custom text-[10px] leading-relaxed tracking-wide text-[#525252]/60 uppercase'>
                  No passkeys registered yet.
                </p>
              ) : (
                passkeys.map((p) => (
                  <div
                    key={p.id}
                    className='flex items-center justify-between rounded-xl border border-[#111111]/5 bg-[#111111]/5 p-4'
                  >
                    <div>
                      <p className='text-xs font-semibold text-[#111111]'>
                        {p.name || 'Unnamed Passkey'}
                      </p>
                      <p className='font-mono-custom mt-0.5 text-[9px] text-[#525252]/60 uppercase'>
                        Added {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeletePasskey(p.id)}
                      className='font-mono-custom text-[9px] tracking-wider text-[#dc2626] uppercase hover:underline'
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. TWO-STEP VERIFICATION */}
      <div className='space-y-4 border-t border-[#111111]/5 pt-6'>
        <div className='flex items-start gap-4'>
          <div className='mt-0.5 flex size-9 items-center justify-center rounded-full bg-[#111111]/5 text-[#111111]'>
            <Shield size={16} />
          </div>
          <div className='flex flex-1 items-center justify-between'>
            <div>
              <h4 className='text-sm font-semibold text-[#111111]'>
                Two-step verification
              </h4>
              <p className='font-mono-custom mt-1 text-[9px] tracking-widest text-[#525252]/60 uppercase'>
                Add an extra layer of protection to your account
              </p>
            </div>
            <button
              onClick={() => {
                alert(
                  'Multi-factor Authentication (MFA) must be configured via your account security details by registering a TOTP app or SMS phone number.',
                );
              }}
              className={`font-mono-custom rounded-full px-4 py-2 text-[9px] tracking-wider uppercase transition-colors ${
                user?.twoFactorEnabled
                  ? 'bg-[#6e9c4e]/10 text-[#6e9c4e]'
                  : 'bg-[#525252]/10 text-[#525252]'
              }`}
            >
              {user?.twoFactorEnabled ? 'Enabled' : 'Setup Required'}
            </button>
          </div>
        </div>
      </div>

      {/* 4. ACTIVE DEVICES */}
      <div className='space-y-4 border-t border-[#111111]/5 pt-6'>
        <div className='flex items-start gap-4'>
          <div className='mt-0.5 flex size-9 items-center justify-center rounded-full bg-[#111111]/5 text-[#111111]'>
            <Smartphone size={16} />
          </div>
          <div className='flex-1'>
            <h4 className='mb-3 text-sm font-semibold text-[#111111]'>
              Active devices
            </h4>

            <div className='space-y-3'>
              {activeSessions.map((session) => {
                const isCurrent = session.id === currentSessionId;
                // const activity = (session as any).latestActivity;
                const activity = (
                  session as {
                    latestActivity?: {
                      browser?: string;
                      device?: string;
                      city?: string;
                      country?: string;
                      ipAddress?: string;
                    };
                  }
                ).latestActivity;

                const deviceName = activity?.browser
                  ? `${activity.browser} on ${activity.device || 'Unknown Device'}`
                  : 'Unknown Device';
                const location =
                  [activity?.city, activity?.country]
                    .filter(Boolean)
                    .join(', ') || 'Unknown Location';

                return (
                  <div
                    key={session.id}
                    className='flex items-center justify-between rounded-xl border border-[#111111]/5 bg-[#111111]/5 p-4'
                  >
                    <div className='flex items-start gap-3'>
                      <div className='mt-0.5 flex size-8 items-center justify-center rounded-lg bg-[#111111]/5 text-[#111111]'>
                        <Laptop size={14} />
                      </div>
                      <div>
                        <div className='flex items-center gap-2'>
                          <p className='text-xs font-semibold text-[#111111]'>
                            {deviceName}
                          </p>
                          {isCurrent && (
                            <span className='font-mono-custom rounded bg-[#6e9c4e]/15 px-1.5 py-0.5 text-[8px] text-[#6e9c4e] uppercase'>
                              Current
                            </span>
                          )}
                        </div>
                        <p className='font-mono-custom mt-0.5 text-[9px] text-[#525252]/60 uppercase'>
                          {location}{' '}
                          {activity?.ipAddress ? `(${activity.ipAddress})` : ''}
                        </p>
                      </div>
                    </div>

                    {!isCurrent && session.status === 'active' && (
                      <button
                        onClick={() => handleRevokeDevice(session.id)}
                        className='font-mono-custom text-[9px] tracking-wider text-[#dc2626] uppercase hover:underline'
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 5. DELETE ACCOUNT */}
      <div className='space-y-4 border-t border-[#dc2626]/10 pt-6'>
        <div className='flex items-start gap-4'>
          <div className='mt-0.5 flex size-9 items-center justify-center rounded-full bg-[#dc2626]/10 text-[#dc2626]'>
            <Trash2 size={16} />
          </div>
          <div className='flex-1'>
            <h4 className='text-sm font-semibold text-[#dc2626]'>
              Delete account
            </h4>
            <p className='font-mono-custom mt-1 text-[9px] tracking-widest text-[#dc2626]/60 uppercase'>
              Irreversible account termination
            </p>
            <p className='mt-2 max-w-md text-xs leading-relaxed text-[#525252]/80'>
              Deleting your account permanently removes all sowed drafts,
              preferences, and journals. This action cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              className='font-mono-custom mt-3 rounded-full bg-[#dc2626] px-5 py-2.5 text-xs text-[9px] font-semibold tracking-wider text-white uppercase outline-none hover:bg-[#e04343]'
            >
              Delete Account...
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple loader helper
function Loader2({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      {...props}
    >
      <path d='M21 12a9 9 0 1 1-6.219-8.56' />
    </svg>
  );
}
