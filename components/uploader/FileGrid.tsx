'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useQueryState, parseAsString } from 'nuqs';
import { useFiles, useDeleteFile } from '@/hooks/use-files';
import {
  Loader2,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Search,
  Filter,
  ArrowUpDown,
  FileCode,
  FileText,
} from 'lucide-react';

export function FileGrid() {
  const { data: files = [], isLoading: loading } = useFiles();
  const deleteFileMutation = useDeleteFile();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Type-safe URL state management via nuqs
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    parseAsString.withDefault(''),
  );
  const [categoryFilter, setCategoryFilter] = useQueryState(
    'category',
    parseAsString.withDefault('all'),
  );
  const [sortOrder, setSortOrder] = useQueryState(
    'sort',
    parseAsString.withDefault('newest'),
  );

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

  // Helper to detect file category from extension
  const getFileCategory = (
    filename: string,
  ): 'images' | 'docs' | 'code' | 'other' => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext))
      return 'images';
    if (['pdf', 'doc', 'docx', 'txt', 'md', 'rtf'].includes(ext)) return 'docs';
    if (['json', 'csv', 'ts', 'js', 'py', 'sql', 'xml', 'html'].includes(ext))
      return 'code';
    return 'other';
  };

  // Filter and sort files based on nuqs URL parameters
  const filteredFiles = useMemo(() => {
    return files
      .filter((file) => {
        // Keyword match
        const matchesSearch =
          !searchQuery.trim() ||
          file.fileName
            .toLowerCase()
            .includes(searchQuery.toLowerCase().trim());

        // Category match
        const fileCat = getFileCategory(file.fileName);
        const matchesCategory =
          categoryFilter === 'all' || fileCat === categoryFilter;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortOrder === 'newest') {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        if (sortOrder === 'oldest') {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        if (sortOrder === 'name') {
          return a.fileName.localeCompare(b.fileName);
        }
        if (sortOrder === 'size') {
          return b.fileSize - a.fileSize;
        }
        return 0;
      });
  }, [files, searchQuery, categoryFilter, sortOrder]);

  if (loading) {
    return (
      <div className='flex justify-center py-12'>
        <Loader2 className='size-8 animate-spin text-[var(--brand-green)]' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Type-Safe URL-Synced In-Page Filter Controls powered by nuqs */}
      <div className='flex flex-col gap-4 rounded-2xl border border-[#111111]/10 bg-white/80 p-4 shadow-xs backdrop-blur-xs md:flex-row md:items-center md:justify-between'>
        {/* Search Input */}
        <div className='relative flex-1'>
          <Search
            size={16}
            className='absolute top-1/2 left-3 -translate-y-1/2 text-slate-400'
          />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value || null)}
            placeholder='Filter gallery files by name...'
            className='font-mono-custom w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#111111] focus:bg-white'
          />
        </div>

        {/* Filter Controls */}
        <div className='flex flex-wrap items-center gap-3'>
          {/* Category Dropdown */}
          <div className='font-mono-custom flex items-center gap-1.5 text-xs'>
            <Filter size={14} className='text-slate-500' />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value || null)}
              className='rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#111111]'
            >
              <option value='all'>All Categories</option>
              <option value='images'>Images</option>
              <option value='docs'>Documents (PDF/TXT)</option>
              <option value='code'>Code & Data (CSV/JSON)</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className='font-mono-custom flex items-center gap-1.5 text-xs'>
            <ArrowUpDown size={14} className='text-slate-500' />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value || null)}
              className='rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#111111]'
            >
              <option value='newest'>Newest First</option>
              <option value='oldest'>Oldest First</option>
              <option value='name'>Name (A-Z)</option>
              <option value='size'>Size (Largest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Display */}
      {filteredFiles.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-[var(--accent-black)]/10 bg-white/50 p-6 py-12 text-center backdrop-blur-xs'>
          <ImageIcon className='mx-auto mb-3 size-12 text-[var(--text-secondary)]/40' />
          <p className='font-mono-custom text-xs tracking-widest text-[var(--text-secondary)] uppercase'>
            No files match filter criteria
          </p>
          <p className='font-handwritten mt-2 text-lg text-[var(--text-secondary)]'>
            Try resetting your search query or category selection.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'>
          {filteredFiles.map((file) => {
            const cat = getFileCategory(file.fileName);
            const isImage = cat === 'images';

            return (
              <div
                key={file.id}
                className='bento-cell flex flex-col rounded-3xl border border-white/95 bg-white/70 p-4 shadow-xs backdrop-blur-md transition duration-300 hover:shadow-md'
              >
                {/* Clickable Image / Document Container */}
                <a
                  href={file.fileUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group relative block aspect-square w-full cursor-pointer overflow-hidden rounded-2xl border border-[var(--accent-black)]/5 bg-[var(--bg-alabaster)]'
                  title='Click to open original file'
                >
                  {isImage ? (
                    <Image
                      src={file.fileUrl}
                      alt={file.fileName}
                      fill
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      className='object-cover transition duration-500 group-hover:scale-102'
                      unoptimized
                    />
                  ) : (
                    <div className='flex size-full flex-col items-center justify-center bg-slate-100 p-4 text-center'>
                      {cat === 'docs' ? (
                        <FileText size={48} className='mb-2 text-blue-600' />
                      ) : (
                        <FileCode size={48} className='mb-2 text-orange-600' />
                      )}
                      <span className='font-mono-custom text-[10px] font-bold text-slate-600 uppercase'>
                        {file.fileName.split('.').pop()} FILE
                      </span>
                    </div>
                  )}

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
            );
          })}
        </div>
      )}
    </div>
  );
}
