'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth, useUser } from '@clerk/nextjs';

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className='floating-nav'>
      <Link
        href='/'
        className='flex items-center gap-2 text-lg font-semibold tracking-tight text-[#111111]'
      >
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#111111'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
        </svg>
        Meadow
      </Link>
      <div className='hidden items-center gap-6 md:flex'>
        <Link
          href='/#philosophy'
          className='nav-link text-sm font-medium text-[#111111] opacity-55 transition-opacity duration-300 hover:opacity-100'
        >
          Philosophy
        </Link>
        <Link
          href='/#gallery'
          className='nav-link text-sm font-medium text-[#111111] opacity-55 transition-opacity duration-300 hover:opacity-100'
        >
          Gallery
        </Link>
        <Link
          href='/#voices'
          className='nav-link text-sm font-medium text-[#111111] opacity-55 transition-opacity duration-300 hover:opacity-100'
        >
          Voices
        </Link>

        {isSignedIn ? (
          <>
            <Link
              href='/dashboard'
              className='nav-link text-sm font-medium text-[#111111] opacity-55 transition-opacity duration-300 hover:opacity-100'
            >
              Dashboard
            </Link>
            <button
              onClick={() => signOut()}
              className='nav-link cursor-pointer border-none bg-transparent p-0 text-sm font-medium text-[#111111] opacity-55 transition-opacity duration-300 hover:opacity-100'
            >
              Sign Out
            </button>
            <div className='font-mono-custom flex size-6 items-center justify-center overflow-hidden rounded-full border border-[#111111]/10 bg-[#6e9c4e]/20 text-[10px] text-[#6e9c4e]'>
              {user?.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={user.imageUrl}
                  alt='User avatar'
                  className='size-full object-cover'
                />
              ) : (
                user?.firstName?.[0] || 'M'
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              href='/sign-in'
              className='nav-link text-sm font-medium text-[#111111] opacity-55 transition-opacity duration-300 hover:opacity-100'
            >
              Sign In
            </Link>
            <Link
              href='/sign-up'
              className='nav-link text-sm font-medium text-[#111111] opacity-55 transition-opacity duration-300 hover:opacity-100'
            >
              Join
            </Link>
          </>
        )}
      </div>
      <button
        onClick={toggleMenu}
        className='p-2 text-[#111111] focus:outline-none md:hidden'
        aria-label='Toggle Menu'
      >
        {isOpen ? (
          <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <line x1='18' y1='6' x2='6' y2='18'></line>
            <line x1='6' y1='6' x2='18' y2='18'></line>
          </svg>
        ) : (
          <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <line x1='3' y1='12' x2='21' y2='12'></line>
            <line x1='3' y1='6' x2='21' y2='6'></line>
            <line x1='3' y1='18' x2='21' y2='18'></line>
          </svg>
        )}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className='absolute top-17 left-0 z-50 flex w-full flex-col gap-4 rounded-2xl border border-white/80 bg-white/95 p-6 shadow-lg backdrop-blur-md md:hidden'>
          <Link
            href='/#philosophy'
            onClick={toggleMenu}
            className='text-base font-medium text-[#111111] opacity-70 transition-opacity hover:opacity-100'
          >
            Philosophy
          </Link>
          <Link
            href='/#gallery'
            onClick={toggleMenu}
            className='text-base font-medium text-[#111111] opacity-70 transition-opacity hover:opacity-100'
          >
            Gallery
          </Link>
          <Link
            href='/#voices'
            onClick={toggleMenu}
            className='text-base font-medium text-[#111111] opacity-70 transition-opacity hover:opacity-100'
          >
            Voices
          </Link>

          {isSignedIn ? (
            <>
              <Link
                href='/dashboard'
                onClick={toggleMenu}
                className='text-base font-medium text-[#111111] opacity-70 transition-opacity hover:opacity-100'
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  signOut();
                  toggleMenu();
                }}
                className='cursor-pointer border-none bg-transparent p-0 text-left text-base font-medium text-[#111111] opacity-70 transition-opacity hover:opacity-100'
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href='/sign-in'
                onClick={toggleMenu}
                className='text-base font-medium text-[#111111] opacity-70 transition-opacity hover:opacity-100'
              >
                Sign In
              </Link>
              <Link
                href='/sign-up'
                onClick={toggleMenu}
                className='text-base font-medium text-[#111111] opacity-70 transition-opacity hover:opacity-100'
              >
                Join
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export { Navbar1 };
