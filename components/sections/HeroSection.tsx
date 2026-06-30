'use client';

import { useEffect } from 'react';
import { MagneticButton } from './MagneticButton';
import Image from 'next/image';

export function HeroSection() {
  // Set up Intersection Observer for fade-in animations on mount
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    );

    const elements = document.querySelectorAll('.fade-in-up');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <main className='relative z-10 flex flex-1 flex-col justify-center px-6 pt-32 pb-16 md:pt-40 md:pb-24'>
        <div className='mx-auto w-full max-w-300'>
          <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16'>
            {/* Left Column */}
            <div className='fade-in-up flex flex-col justify-center space-y-10 lg:col-span-5'>
              <div className='space-y-6'>
                <h1
                  className='font-handwritten font-normal text-[#111111]'
                  style={{
                    fontSize: 'clamp(3rem, 7vw, 6.5rem)',
                    lineHeight: 1.3,
                  }}
                >
                  Create from the Heart.
                </h1>
                <p className='font-mono-custom max-w-md text-[15px] leading-relaxed tracking-[0.12em] text-[#525252]'>
                  A gentle space for artists, dreamers, and wanderers to find
                  their rhythm in the quiet meadows of imagination.
                </p>
              </div>
              <div className='pt-2'>
                <MagneticButton className='group'>
                  Join the Flock
                  <svg
                    className='size-4 transition-transform duration-300 group-hover:translate-x-1'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <line x1='5' y1='12' x2='19' y2='12'></line>
                    <polyline points='12 5 19 12 12 19'></polyline>
                  </svg>
                </MagneticButton>
              </div>
              <div className='flex items-center gap-4 pt-4 opacity-70'>
                <div className='flex -space-x-3'>
                  <div className='size-8 rounded-full border-[3px] border-[#F9F8F6] bg-[#6E9C4E]'></div>
                  <div className='size-8 rounded-full border-[3px] border-[#F9F8F6] bg-[#8FBC6A]'></div>
                  <div className='size-8 rounded-full border-[3px] border-[#F9F8F6] bg-[#A8D08D]'></div>
                </div>
                <span className='font-mono-custom text-[11px] tracking-wider text-[#525252] uppercase'>
                  1,240 creators joined
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div
              className='fade-in-up relative lg:col-span-7'
              style={{ transitionDelay: '0.15s' }}
            >
              <div
                className='grid grid-cols-4 grid-rows-2 gap-4'
                style={{ minHeight: '480px' }}
              >
                {/* Large Image Card */}
                <div className='bento-cell-img relative col-span-3 row-span-2'>
                  <Image
                    src='/1.png'
                    alt='Artist painting sheep in a meadow'
                    fill
                    className='object-cover'
                    priority
                  />
                  <div className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/15 via-transparent to-transparent'></div>
                  <div className='absolute inset-x-5 bottom-5 flex items-end justify-between'>
                    <div className='rounded-2xl border border-white/50 bg-white/85 px-5 py-3.5 shadow-sm backdrop-blur-md'>
                      <p className='font-mono-custom text-[10px] tracking-widest text-[#525252] uppercase'>
                        Pastoral Series
                      </p>
                      <p className='font-handwritten mt-0.5 text-2xl leading-none text-[#111111]'>
                        Morning Light
                      </p>
                    </div>
                    <button
                      className='cursor-pointer rounded-full border border-white/50 bg-white/85 p-3 shadow-sm backdrop-blur-md transition-colors duration-300 hover:bg-white'
                      aria-label='Like illustration'
                    >
                      <svg
                        className='size-4 text-[#111111]'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'></path>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Small Info Card 1 */}
                <div className='bento-cell col-span-1 row-span-1 flex flex-col justify-between p-6'>
                  <div className='flex size-8 items-center justify-center rounded-full bg-[#6E9C4E]/15'>
                    <svg
                      className='size-4 text-[#6E9C4E]'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
                    </svg>
                  </div>
                  <div>
                    <p className='font-mono-custom text-[10px] tracking-widest text-[#525252] uppercase'>
                      New Drop
                    </p>
                    <p className='mt-1 text-sm font-semibold text-[#111111]'>
                      Spring Collection
                    </p>
                  </div>
                </div>

                {/* Small Quote Card 2 */}
                <div className='bento-cell col-span-1 row-span-1 flex flex-col justify-between bg-[#6E9C4E]/5 p-6'>
                  <div className='flex size-8 items-center justify-center rounded-full bg-white shadow-sm'>
                    <svg
                      className='size-4 text-[#111111]'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path>
                    </svg>
                  </div>
                  <div>
                    <p className='font-handwritten text-xl leading-tight text-[#111111]'>
                      &quot;Art is the
                      <br />
                      shepherd of
                      <br />
                      the soul.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className='section-divider'></div>

      {/* Section 2: Philosophy */}
      <section id='philosophy' className='relative z-10 px-6 py-24 md:py-32'>
        <div className='mx-auto max-w-300'>
          <div className='fade-in-up mb-16 md:mb-20'>
            <p className='font-mono-custom mb-4 text-[11px] tracking-[0.2em] text-[#6E9C4E] uppercase'>
              Our Philosophy
            </p>
            <h2
              className='font-handwritten font-normal text-[#111111]'
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                lineHeight: 1.2,
              }}
            >
              Rooted in Nature.
            </h2>
            <p className='font-mono-custom mt-6 max-w-lg text-[15px] leading-relaxed tracking-widest text-[#525252]'>
              Every piece is born from the quiet rhythms of the meadow. We
              believe in slow creation, sustainable materials, and the gentle
              art of living well.
            </p>
          </div>

          <div
            className='fade-in-up grid grid-cols-1 gap-4 md:grid-cols-3'
            style={{ transitionDelay: '0.1s' }}
          >
            {/* Large Cell with Image */}
            <div
              className='bento-cell-img relative md:col-span-2'
              style={{ minHeight: '400px' }}
            >
              <Image
                src='/2.png'
                alt='Handcrafted pottery in meadow'
                fill
                className='object-cover'
              />
              <div className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent'></div>
              <div className='absolute inset-x-6 bottom-6'>
                <div className='inline-block rounded-2xl border border-white/50 bg-white/85 px-5 py-4 shadow-sm backdrop-blur-md'>
                  <p className='font-mono-custom text-[10px] tracking-widest text-[#525252] uppercase'>
                    Handcrafted
                  </p>
                  <p className='font-handwritten mt-1 text-2xl leading-none text-[#111111]'>
                    Earth & Clay
                  </p>
                </div>
              </div>
            </div>

            {/* Text Cells */}
            <div className='flex flex-col gap-4 md:col-span-1'>
              <div className='bento-cell flex flex-1 flex-col justify-between p-8'>
                <div className='mb-6 flex size-10 items-center justify-center rounded-full bg-[#6E9C4E]/15'>
                  <svg
                    className='size-5 text-[#6E9C4E]'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'></path>
                  </svg>
                </div>
                <div>
                  <h3 className='mb-2 text-lg font-semibold text-[#111111]'>
                    Sustainable Roots
                  </h3>
                  <p className='font-mono-custom text-[13px] leading-relaxed tracking-wide text-[#525252]'>
                    Materials sourced from the earth, returned to the earth.
                    Zero waste, infinite care.
                  </p>
                </div>
              </div>
              <div className='bento-cell flex flex-1 flex-col justify-between bg-[#6E9C4E]/5 p-8'>
                <div className='mb-6 flex size-10 items-center justify-center rounded-full bg-white shadow-sm'>
                  <svg
                    className='size-5 text-[#111111]'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <circle cx='12' cy='12' r='10'></circle>
                    <polyline points='12 6 12 12 16 14'></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className='mb-2 text-lg font-semibold text-[#111111]'>
                    Slow Creation
                  </h3>
                  <p className='font-mono-custom text-[13px] leading-relaxed tracking-wide text-[#525252]'>
                    No rush. Every piece takes the time it needs to breathe and
                    become.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className='section-divider'></div>

      {/* Section 3: Gallery */}
      <section id='gallery' className='relative z-10 px-6 py-24 md:py-32'>
        <div className='mx-auto max-w-300'>
          <div className='fade-in-up mb-16 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between'>
            <div>
              <p className='font-mono-custom mb-4 text-[11px] tracking-[0.2em] text-[#6E9C4E] uppercase'>
                The Meadow Gallery
              </p>
              <h2
                className='font-handwritten font-normal text-[#111111]'
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  lineHeight: 1.2,
                }}
              >
                From the Meadow.
              </h2>
            </div>
            <button className='outline-btn self-start md:self-auto'>
              View All Works
              <svg
                className='ml-2 size-4'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line x1='5' y1='12' x2='19' y2='12'></line>
                <polyline points='12 5 19 12 12 19'></polyline>
              </svg>
            </button>
          </div>

          <div
            className='fade-in-up grid grid-cols-1 gap-4 md:grid-cols-4'
            style={{ transitionDelay: '0.1s' }}
          >
            {/* Large Cabin */}
            <div
              className='bento-cell-img relative md:col-span-2 md:row-span-2'
              style={{ minHeight: '500px' }}
            >
              <Image
                src='/3.png'
                alt='Rustic cabin in rolling hills'
                fill
                className='object-cover'
              />
              <div className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent'></div>
              <div className='absolute bottom-6 left-6'>
                <div className='rounded-2xl border border-white/50 bg-white/85 px-5 py-3.5 shadow-sm backdrop-blur-md'>
                  <p className='font-mono-custom text-[10px] tracking-widest text-[#525252] uppercase'>
                    Watercolor
                  </p>
                  <p className='font-handwritten mt-1 text-xl leading-none text-[#111111]'>
                    The Quiet Cabin
                  </p>
                </div>
              </div>
            </div>

            {/* Sheep */}
            <div
              className='bento-cell-img relative md:col-span-1 md:row-span-2'
              style={{ minHeight: '240px' }}
            >
              <Image
                src='/4.png'
                alt='White sheep with wildflowers'
                fill
                className='object-cover'
              />
              <div className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/15 via-transparent to-transparent'></div>
              <div className='absolute inset-x-5 bottom-5'>
                <div className='rounded-xl border border-white/50 bg-white/85 px-4 py-3 shadow-sm backdrop-blur-md'>
                  <p className='font-handwritten text-lg leading-none text-[#111111]'>
                    Gentle Grazer
                  </p>
                </div>
              </div>
            </div>

            {/* Artist */}
            <div
              className='bento-cell-img relative md:col-span-1 md:row-span-2'
              style={{ minHeight: '240px' }}
            >
              <Image
                src='/5.png'
                alt='Artist painting landscape'
                fill
                className='object-cover'
              />
              <div className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/15 via-transparent to-transparent'></div>
              <div className='absolute inset-x-5 bottom-5'>
                <div className='rounded-xl border border-white/50 bg-white/85 px-4 py-3 shadow-sm backdrop-blur-md'>
                  <p className='font-handwritten text-lg leading-none text-[#111111]'>
                    In Progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className='section-divider'></div>

      {/* Section 4: Testimonials */}
      <section id='voices' className='relative z-10 px-6 py-24 md:py-32'>
        <div className='mx-auto max-w-300'>
          <div className='fade-in-up mb-16 text-center md:mb-20'>
            <p className='font-mono-custom mb-4 text-[11px] tracking-[0.2em] text-[#6E9C4E] uppercase'>
              Community
            </p>
            <h2
              className='font-handwritten font-normal text-[#111111]'
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                lineHeight: 1.2,
              }}
            >
              Voices from the Flock.
            </h2>
          </div>

          <div
            className='fade-in-up grid grid-cols-1 gap-4 md:grid-cols-3'
            style={{ transitionDelay: '0.1s' }}
          >
            {/* Testimonial 1 */}
            <div
              className='bento-cell flex flex-col justify-between p-8'
              style={{ minHeight: '280px' }}
            >
              <div>
                <svg
                  className='mb-6 size-8 text-[#6E9C4E]/30'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z' />
                </svg>
                <p className='font-handwritten mb-6 text-2xl leading-snug text-[#111111]'>
                  &quot;Meadow gave me the space to breathe and create without
                  pressure. It&apos;s a sanctuary for the soul.&quot;
                </p>
              </div>
              <div className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-full bg-[#6E9C4E]/20'>
                  <span className='font-handwritten text-lg text-[#6E9C4E]'>
                    E
                  </span>
                </div>
                <div>
                  <p className='text-sm font-semibold text-[#111111]'>
                    Elena M.
                  </p>
                  <p className='font-mono-custom text-[11px] tracking-wider text-[#525252] uppercase'>
                    Illustrator
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div
              className='bento-cell flex flex-col justify-between bg-[#6E9C4E]/5 p-8'
              style={{ minHeight: '280px' }}
            >
              <div>
                <svg
                  className='mb-6 size-8 text-[#6E9C4E]/30'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z' />
                </svg>
                <p className='font-handwritten mb-6 text-2xl leading-snug text-[#111111]'>
                  &quot;The community here is unlike any other. Gentle,
                  supportive, and deeply inspiring.&quot;
                </p>
              </div>
              <div className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-full bg-[#8FBC6A]/20'>
                  <span className='font-handwritten text-lg text-[#8FBC6A]'>
                    J
                  </span>
                </div>
                <div>
                  <p className='text-sm font-semibold text-[#111111]'>
                    James T.
                  </p>
                  <p className='font-mono-custom text-[11px] tracking-wider text-[#525252] uppercase'>
                    Potter
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div
              className='bento-cell flex flex-col justify-between p-8'
              style={{ minHeight: '280px' }}
            >
              <div>
                <svg
                  className='mb-6 size-8 text-[#6E9C4E]/30'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z' />
                </svg>
                <p className='font-handwritten mb-6 text-2xl leading-snug text-[#111111]'>
                  &quot;Finally, a platform that values the process as much as
                  the product. Truly refreshing.&quot;
                </p>
              </div>
              <div className='flex items-center gap-3'>
                <div className='flex size-10 items-center justify-center rounded-full bg-[#A8D08D]/20'>
                  <span className='font-handwritten text-lg text-[#A8D08D]'>
                    S
                  </span>
                </div>
                <div>
                  <p className='text-sm font-semibold text-[#111111]'>
                    Sarah K.
                  </p>
                  <p className='font-mono-custom text-[11px] tracking-wider text-[#525252] uppercase'>
                    Writer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className='section-divider'></div>

      {/* Section 5: Newsletter / CTA */}
      <section id='join' className='relative z-10 px-6 py-24 md:py-32'>
        <div className='fade-in-up mx-auto max-w-300'>
          <div
            className='bento-cell relative overflow-hidden p-8 md:p-16'
            style={{
              background:
                'linear-gradient(135deg, rgba(110, 156, 78, 0.08) 0%, rgba(255, 255, 255, 0.7) 100%)',
            }}
          >
            {/* Decorative circles */}
            <div className='pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-[#6E9C4E]/10 blur-3xl'></div>
            <div className='pointer-events-none absolute -bottom-20 -left-20 size-48 rounded-full bg-[#8FBC6A]/10 blur-3xl'></div>

            <div className='relative z-10 max-w-2xl'>
              <p className='font-mono-custom mb-4 text-[11px] tracking-[0.2em] text-[#6E9C4E] uppercase'>
                Stay Connected
              </p>
              <h2
                className='font-handwritten mb-6 font-normal text-[#111111]'
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  lineHeight: 1.2,
                }}
              >
                Wander with us.
              </h2>
              <p className='font-mono-custom mb-10 max-w-lg text-[15px] leading-relaxed tracking-widest text-[#525252]'>
                Receive gentle letters from the meadow. New collections, artist
                stories, and quiet moments delivered to your inbox.
              </p>

              <form
                className='flex max-w-md flex-col gap-3 sm:flex-row'
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type='email'
                  placeholder='your@email.com'
                  className='font-mono-custom flex-1 rounded-full border border-[#111111]/10 bg-white/80 px-6 py-4 text-sm tracking-wide text-[#111111] placeholder-[#525252]/50 transition-colors focus:border-[#111111]/30 focus:outline-none'
                />
                <MagneticButton
                  type='submit'
                  className='group whitespace-nowrap'
                >
                  Subscribe
                  <svg
                    className='size-4 transition-transform duration-300 group-hover:translate-x-1'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <line x1='5' y1='12' x2='19' y2='12'></line>
                    <polyline points='12 5 19 12 12 19'></polyline>
                  </svg>
                </MagneticButton>
              </form>
              <p className='font-mono-custom mt-4 text-[11px] tracking-wider text-[#525252]/60'>
                No spam. Only meadow whispers. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='relative z-10 px-6 pt-16 pb-8'>
        <div className='mx-auto max-w-300'>
          <div className='mb-16 grid grid-cols-1 gap-12 md:grid-cols-4'>
            <div className='md:col-span-2'>
              <a
                href='#'
                className='mb-6 flex items-center gap-2 text-xl font-semibold tracking-tight text-[#111111]'
              >
                <svg
                  width='24'
                  height='24'
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
              </a>
              <p className='font-mono-custom max-w-sm text-[13px] leading-relaxed tracking-wide text-[#525252]'>
                A gentle space for artists, dreamers, and wanderers. Rooted in
                nature, crafted with care.
              </p>
            </div>
            <div>
              <p className='font-mono-custom mb-6 text-[11px] font-semibold tracking-[0.15em] text-[#111111] uppercase'>
                Explore
              </p>
              <ul className='space-y-3'>
                <li>
                  <a
                    href='#'
                    className='font-mono-custom text-[13px] tracking-wide text-[#525252] transition-colors hover:text-[#111111]'
                  >
                    Philosophy
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='font-mono-custom text-[13px] tracking-wide text-[#525252] transition-colors hover:text-[#111111]'
                  >
                    Gallery
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='font-mono-custom text-[13px] tracking-wide text-[#525252] transition-colors hover:text-[#111111]'
                  >
                    Journal
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='font-mono-custom text-[13px] tracking-wide text-[#525252] transition-colors hover:text-[#111111]'
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className='font-mono-custom mb-6 text-[11px] font-semibold tracking-[0.15em] text-[#111111] uppercase'>
                Connect
              </p>
              <ul className='space-y-3'>
                <li>
                  <a
                    href='#'
                    className='font-mono-custom text-[13px] tracking-wide text-[#525252] transition-colors hover:text-[#111111]'
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='font-mono-custom text-[13px] tracking-wide text-[#525252] transition-colors hover:text-[#111111]'
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='font-mono-custom text-[13px] tracking-wide text-[#525252] transition-colors hover:text-[#111111]'
                  >
                    Pinterest
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='font-mono-custom text-[13px] tracking-wide text-[#525252] transition-colors hover:text-[#111111]'
                  >
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='section-divider mb-8'></div>
          <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
            <p className='font-mono-custom text-[11px] tracking-wider text-[#525252]/60'>
              © 2024 Meadow. All rights reserved.
            </p>
            <p className='font-handwritten text-xl text-[#111111]/40'>
              Create from the heart.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
