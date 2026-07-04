'use client';

import React, { useState, useRef } from 'react';
import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';
import { clientEnv } from '@/config/env.client';
import { useSyncFile } from '@/hooks/use-files';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface UploadcareFile {
  status: string;
  cdnUrl: string | null;
  uuid: string | null;
  name?: string | null;
  size?: number | null;
}

interface UploadcareChangeEvent {
  allEntries: UploadcareFile[];
}

interface UploadcareErrorEvent {
  errors: { message: string }[];
}

export function FileUploader() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pubKey = clientEnv.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;
  const syncedFilesRef = useRef<Set<string>>(new Set());
  const syncFileMutation = useSyncFile();

  const handleChangeEvent = async (e: UploadcareChangeEvent) => {
    const successfulFiles = e.allEntries.filter(
      (file: UploadcareFile) => file.status === 'success',
    );

    if (successfulFiles.length === 0) return;

    for (const file of successfulFiles) {
      if (file.cdnUrl && file.uuid) {
        if (syncedFilesRef.current.has(file.uuid)) {
          continue;
        }

        syncedFilesRef.current.add(file.uuid);

        try {
          // Sync metadata to Neon PostgreSQL using TanStack Query Mutation
          await syncFileMutation.mutateAsync({
            fileId: file.uuid,
            fileUrl: file.cdnUrl,
            fileName: file.name || 'unnamed_file',
            fileSize: file.size || 0,
          });

          setSuccessMessage(
            `File "${file.name}" uploaded successfully and synced with Neon database!`,
          );
          setErrorMessage(null);
          setTimeout(() => setSuccessMessage(null), 5000);
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          setErrorMessage(
            `Failed to sync "${file.name}" to the database: ${errMsg}`,
          );
          setSuccessMessage(null);
          setTimeout(() => setErrorMessage(null), 5000);
        }
      }
    }
  };

  const handleUploadFailed = (e: UploadcareErrorEvent) => {
    const errorDetail = e.errors?.[0]?.message || 'File upload failed';
    setErrorMessage(`Upload error: ${errorDetail}`);
    setSuccessMessage(null);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  return (
    <div className='space-y-4'>
      {successMessage && (
        <div className='font-mono-custom flex items-center gap-2 rounded-2xl border border-[var(--brand-green)]/20 bg-[var(--bg-alabaster)] p-4 text-xs tracking-wide text-[var(--brand-green)]'>
          <CheckCircle2 size={16} className='text-[var(--brand-green)]' />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className='font-mono-custom flex items-center gap-2 rounded-2xl border border-red-600/20 bg-[var(--bg-alabaster)] p-4 text-xs tracking-wide text-red-600'>
          <AlertCircle size={16} className='text-red-600' />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <div className='uploadcare-custom-theme flex justify-center py-6'>
        <FileUploaderRegular
          pubkey={pubKey}
          onChange={handleChangeEvent}
          onFileUploadFailed={handleUploadFailed}
          maxLocalFileSizeBytes={5000000} // 5MB limit
        />
      </div>
    </div>
  );
}
