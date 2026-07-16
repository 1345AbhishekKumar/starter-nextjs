'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CheckCircle2, Camera, UploadCloud } from 'lucide-react';
import * as Sentry from '@sentry/nextjs';
import { logger } from '@/lib/logger';

import {
  profileFormSchema,
  type ProfileFormInput,
} from '@/lib/validations/profile';
import { updateProfile } from '@/actions/profile';

type ProfileData = {
  id: string;
  name: string;
  bio: string;
  website: string;
  avatarUrl: string;
};

type ProfileFormProps = {
  initialProfile: ProfileData;
};

export function ProfileForm({
  initialProfile,
}: ProfileFormProps): React.JSX.Element {
  const { user, isLoaded } = useUser();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Avatar states
  const avatarPreview = user?.imageUrl || initialProfile.avatarUrl || null;
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormInput>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: initialProfile.name,
      email: user?.primaryEmailAddress?.emailAddress || '',
      bio: initialProfile.bio,
      website: initialProfile.website,
    },
  });

  // Reset form once Clerk user loads
  useEffect(() => {
    if (isLoaded && user) {
      reset({
        name:
          initialProfile.name ||
          user.fullName ||
          `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
          'Meadow Creator',
        email: user.primaryEmailAddress?.emailAddress || '',
        bio: initialProfile.bio,
        website: initialProfile.website,
      });
    }
  }, [isLoaded, user, reset, initialProfile]);

  // Handle avatar upload click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle file select and upload to Clerk
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WEBP).');
      if (e.target) e.target.value = '';
      return;
    }

    // Validate file size (2MB)
    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert(
        'File size exceeds the 2MB limit. Please compress your image first.',
      );
      if (e.target) e.target.value = '';
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    try {
      if (user) {
        await user.setProfileImage({ file });
        clearInterval(interval);
        setUploadProgress(100);
        setSuccessMessage(
          'Avatar uploaded successfully! It will sync shortly.',
        );
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      clearInterval(interval);
      logger.error({ err }, 'Error uploading avatar to Clerk');
      Sentry.captureException(err);
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to upload profile portrait. Please try again.';
      alert(message);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormInput) => {
    setSuccessMessage(null);

    const res = await updateProfile(data);

    if (res.success) {
      setSuccessMessage(
        'Your profile settings have been updated in the meadow.',
      );
    } else {
      alert(res.error || 'Failed to update profile.');
    }

    // Clear message after 4s
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  if (!isLoaded) {
    return (
      <div className='flex h-48 items-center justify-center'>
        <Loader2 className='size-6 animate-spin text-[#6e9c4e]' />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {successMessage && (
        <div className='font-mono-custom flex items-center gap-2 rounded-2xl border border-[#047857]/20 bg-[#ECFDF5] p-4 text-xs tracking-wide text-[#047857]'>
          <CheckCircle2 size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Avatar Upload Panel */}
      <div className='flex flex-col items-center gap-6 border-b border-[#111111]/5 pb-4 sm:flex-row'>
        <div className='group relative flex size-24 items-center justify-center overflow-hidden rounded-full border-[3px] border-[#6e9c4e] bg-[#6e9c4e]/10'>
          {avatarPreview ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={avatarPreview}
              alt='Profile avatar'
              className='size-full object-cover'
            />
          ) : (
            <span className='font-handwritten text-4xl text-[#6e9c4e]'>
              {user?.firstName?.[0] || 'C'}
            </span>
          )}

          {/* Hover overlay */}
          <button
            type='button'
            onClick={triggerFileInput}
            className='absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-[#111111]/60 text-white opacity-0 transition-all duration-200 group-hover:opacity-100'
          >
            <Camera size={18} className='mb-1' />
            <span className='font-mono-custom text-[8px] tracking-wider uppercase'>
              Change
            </span>
          </button>
        </div>

        <div className='flex flex-1 flex-col items-center text-center sm:items-start sm:text-left'>
          <h4 className='text-sm font-semibold text-[#111111]'>
            Profile Portrait
          </h4>
          <p className='font-mono-custom mt-1 max-w-xs text-[10px] leading-normal text-[#525252]/80'>
            Upload a square JPEG or PNG. Max size 2MB.
          </p>

          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileChange}
            accept='image/*'
            className='hidden'
          />

          <button
            type='button'
            onClick={triggerFileInput}
            disabled={uploading}
            className='outline-btn font-mono-custom mt-3 flex items-center gap-1.5 border-[#111111]/20 px-4 py-2 text-[9px] tracking-wider uppercase hover:border-[#111111] disabled:opacity-50'
          >
            <UploadCloud size={12} />
            {uploading ? `Uploading ${uploadProgress}%` : 'Upload New Photo'}
          </button>

          {/* Progress bar */}
          {uploading && (
            <div className='mt-3 h-[3px] w-full max-w-[200px] overflow-hidden rounded-full bg-[#111111]/5'>
              <div
                className='h-full bg-[#6e9c4e] transition-all duration-150'
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Grid Fields */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Name Field */}
        <div className='flex flex-col gap-2'>
          <label
            htmlFor='name'
            className='font-mono-custom pl-1 text-[10px] tracking-widest text-[#525252]/80 uppercase'
          >
            Display Name
          </label>
          <input
            id='name'
            type='text'
            placeholder='Your name'
            {...register('name')}
            className={`font-mono-custom w-full rounded-full border bg-white/80 px-5 py-3 text-xs tracking-wide text-[#111111] transition-colors outline-none focus:border-[#111111]/30 ${
              errors.name
                ? 'border-[#dc2626]/50 focus:border-[#dc2626]'
                : 'border-[#111111]/10'
            }`}
          />
          {errors.name && (
            <span className='font-mono-custom pl-2 text-[9px] tracking-wider text-[#dc2626] uppercase'>
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Read-only Email Field */}
        <div className='flex flex-col gap-2'>
          <label
            htmlFor='email'
            className='font-mono-custom pl-1 text-[10px] tracking-widest text-[#525252]/80 uppercase'
          >
            Email Address (Read-only)
          </label>
          <input
            id='email'
            type='email'
            readOnly
            {...register('email')}
            className='font-mono-custom w-full cursor-not-allowed rounded-full border border-[#111111]/10 bg-[#111111]/5 px-5 py-3 text-xs tracking-wide text-[#525252]/80 outline-none'
          />
        </div>
      </div>

      {/* Website Field */}
      <div className='flex flex-col gap-2'>
        <label
          htmlFor='website'
          className='font-mono-custom pl-1 text-[10px] tracking-widest text-[#525252]/80 uppercase'
        >
          Website Link
        </label>
        <input
          id='website'
          type='text'
          placeholder='https://yourwebsite.com'
          {...register('website')}
          className={`font-mono-custom w-full rounded-full border bg-white/80 px-5 py-3 text-xs tracking-wide text-[#111111] transition-colors outline-none focus:border-[#111111]/30 ${
            errors.website
              ? 'border-[#dc2626]/50 focus:border-[#dc2626]'
              : 'border-[#111111]/10'
          }`}
        />
        {errors.website && (
          <span className='font-mono-custom pl-2 text-[9px] tracking-wider text-[#dc2626] uppercase'>
            {errors.website.message}
          </span>
        )}
      </div>

      {/* Bio Field */}
      <div className='flex flex-col gap-2'>
        <label
          htmlFor='bio'
          className='font-mono-custom pl-1 text-[10px] tracking-widest text-[#525252]/80 uppercase'
        >
          Short Biography
        </label>
        <textarea
          id='bio'
          rows={4}
          placeholder='Tell the meadow about yourself...'
          {...register('bio')}
          className={`font-mono-custom w-full resize-none rounded-3xl border bg-white/80 px-5 py-4 text-xs tracking-wide text-[#111111] transition-colors outline-none focus:border-[#111111]/30 ${
            errors.bio
              ? 'border-[#dc2626]/50 focus:border-[#dc2626]'
              : 'border-[#111111]/10'
          }`}
        />
        {errors.bio && (
          <span className='font-mono-custom pl-2 text-[9px] tracking-wider text-[#dc2626] uppercase'>
            {errors.bio.message}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className='flex justify-end gap-3 pt-2'>
        <button
          type='submit'
          disabled={isSubmitting}
          className='magnetic-btn font-mono-custom flex items-center justify-center gap-2 px-6 py-3.5 text-xs tracking-wider text-white uppercase hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isSubmitting ? (
            <>
              <Loader2 className='size-3.5 animate-spin' />
              Cultivating...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}
