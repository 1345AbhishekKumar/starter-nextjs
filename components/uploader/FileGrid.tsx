'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useFiles, useDeleteFile } from '@/hooks/use-files';
import {
  Loader2,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';

export function FileGrid() {
  const { data: files = [], isLoading: loading } = useFiles();
  const deleteFileMutation = useDeleteFile();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteFileMutation.mutateAsync(id);
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className='flex justify-center py-12'>
        <Loader2 className='size-8 animate-spin text-[var(--brand-green)]' />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className='rounded-2xl border border-dashed border-[var(--accent-black)]/10 bg-white/50 p-6 py-12 text-center backdrop-blur-xs'>
        <ImageIcon className='mx-auto mb-3 size-12 text-[var(--text-secondary)]/40' />
        <p className='font-mono-custom text-xs tracking-widest text-[var(--text-secondary)] uppercase'>
          No synced files found
        </p>
        <p className='font-handwritten mt-2 text-lg text-[var(--text-secondary)]'>
          Upload some files above to see them in the gallery.
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'>
      {files.map((file) => (
        <div
          key={file.id}
          className='bento-cell flex flex-col rounded-3xl border border-white/95 bg-white/70 p-4 shadow-xs backdrop-blur-md transition duration-300 hover:shadow-md'
        >
          {/* Clickable Image Container */}
          <a
            href={file.fileUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='group relative block aspect-square w-full cursor-pointer overflow-hidden rounded-2xl border border-[var(--accent-black)]/5 bg-[var(--bg-alabaster)]'
            title='Click to open full size image'
          >
            <Image
              src={file.fileUrl}
              alt={file.fileName}
              fill
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
              className='object-cover transition duration-500 group-hover:scale-102'
              unoptimized
            />
            {/* Hover overlay indicator */}
            <div className='absolute inset-0 flex items-center justify-center bg-[var(--accent-black)]/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
              <div className='font-mono-custom flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold tracking-wider text-[var(--accent-black)] uppercase shadow-xs'>
                <ExternalLink
                  size={11}
                  className='text-[var(--accent-black)]'
                />
                Open Original
              </div>
            </div>
          </a>

          {/* Details footer */}
          <div className='flex items-start justify-between gap-2 pt-3'>
            <div className='flex-1 truncate'>
              <h4
                className='truncate text-xs font-semibold text-[var(--accent-black)]'
                title={file.fileName}
              >
                {file.fileName}
              </h4>
              <div className='mt-1 flex items-center gap-2'>
                <span className='font-mono-custom shrink-0 text-[9px] font-semibold tracking-wider text-[var(--brand-green)] uppercase'>
                  {formatBytes(file.fileSize)}
                </span>
                <span className='size-1 rounded-full bg-[var(--text-secondary)]/20' />
                <span className='font-mono-custom truncate text-[8px] tracking-wider text-[var(--text-secondary)]/50 uppercase'>
                  {new Date(file.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(file.id)}
              disabled={deletingId === file.id}
              className='shrink-0 rounded-lg p-1.5 text-red-500 transition duration-200 hover:bg-red-50/50 hover:text-red-700'
              title='Delete file reference'
            >
              {deletingId === file.id ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <Trash2 className='size-4' />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
