'use client';

import {useEffect } from 'react';
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
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
      <main className="relative z-10 flex-1 flex flex-col justify-center px-6 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-300 mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-10 fade-in-up">
              <div className="space-y-6">
                <h1 className="font-handwritten text-[#111111] font-normal" style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', lineHeight: 1.3 }}>
                  Create from the Heart.
                </h1>
                <p className="font-mono-custom text-[15px] text-[#525252] tracking-[0.12em] leading-relaxed max-w-md">
                  A gentle space for artists, dreamers, and wanderers to find their rhythm in the quiet meadows of imagination.
                </p>
              </div>
              <div className="pt-2">
                <MagneticButton className="group">
                  Join the Flock
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </MagneticButton>
              </div>
              <div className="flex items-center gap-4 pt-4 opacity-70">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#6E9C4E] border-[3px] border-[#F9F8F6]"></div>
                  <div className="w-8 h-8 rounded-full bg-[#8FBC6A] border-[3px] border-[#F9F8F6]"></div>
                  <div className="w-8 h-8 rounded-full bg-[#A8D08D] border-[3px] border-[#F9F8F6]"></div>
                </div>
                <span className="font-mono-custom text-[11px] tracking-wider text-[#525252] uppercase">1,240 creators joined</span>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-7 relative fade-in-up" style={{ transitionDelay: '0.15s' }}>
              <div className="grid grid-cols-4 grid-rows-2 gap-4" style={{ minHeight: '480px' }}>
                {/* Large Image Card */}
                <div className="col-span-3 row-span-2 bento-cell-img relative">
                  <Image src="/1.png" alt="Artist painting sheep in a meadow" fill className="object-cover" priority/>
                  <div className="absolute inset-0 bg-linear-to-t from-black/15 via-transparent to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <div className="bg-white/85 backdrop-blur-md rounded-2xl px-5 py-3.5 shadow-sm border border-white/50">
                      <p className="font-mono-custom text-[10px] text-[#525252] tracking-widest uppercase">Pastoral Series</p>
                      <p className="font-handwritten text-2xl text-[#111111] mt-0.5 leading-none">Morning Light</p>
                    </div>
                    <button className="bg-white/85 backdrop-blur-md rounded-full p-3 shadow-sm border border-white/50 cursor-pointer hover:bg-white transition-colors duration-300" aria-label="Like illustration">
                      <svg className="w-4 h-4 text-[#111111]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Small Info Card 1 */}
                <div className="col-span-1 row-span-1 bento-cell p-6 flex flex-col justify-between">
                  <div className="w-8 h-8 rounded-full bg-[#6E9C4E]/15 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#6E9C4E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-mono-custom text-[10px] text-[#525252] tracking-widest uppercase">New Drop</p>
                    <p className="font-semibold text-sm text-[#111111] mt-1">Spring Collection</p>
                  </div>
                </div>

                {/* Small Quote Card 2 */}
                <div className="col-span-1 row-span-1 bento-cell p-6 flex flex-col justify-between bg-[#6E9C4E]/5">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-[#111111]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-handwritten text-xl text-[#111111] leading-tight">
                      &quot;Art is the<br />shepherd of<br />the soul.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="section-divider"></div>

      {/* Section 2: Philosophy */}
      <section id="philosophy" className="relative z-10 px-6 py-24 md:py-32">
        <div className="max-w-300 mx-auto">
          <div className="mb-16 md:mb-20 fade-in-up">
            <p className="font-mono-custom text-[11px] text-[#6E9C4E] tracking-[0.2em] uppercase mb-4">Our Philosophy</p>
            <h2 className="font-handwritten text-[#111111] font-normal" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.2 }}>
              Rooted in Nature.
            </h2>
            <p className="font-mono-custom text-[15px] text-[#525252] tracking-widest mt-6 max-w-lg leading-relaxed">
              Every piece is born from the quiet rhythms of the meadow. We believe in slow creation, sustainable materials, and the gentle art of living well.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 fade-in-up" style={{ transitionDelay: '0.1s' }}>
            {/* Large Cell with Image */}
            <div className="md:col-span-2 bento-cell-img relative" style={{ minHeight: '400px' }}>
              <Image src="/2.png" alt="Handcrafted pottery in meadow" fill className="object-cover"/>
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/85 backdrop-blur-md rounded-2xl px-5 py-4 shadow-sm border border-white/50 inline-block">
                  <p className="font-mono-custom text-[10px] text-[#525252] tracking-widest uppercase">Handcrafted</p>
                  <p className="font-handwritten text-2xl text-[#111111] mt-1 leading-none">Earth & Clay</p>
                </div>
              </div>
            </div>

            {/* Text Cells */}
            <div className="md:col-span-1 flex flex-col gap-4">
              <div className="bento-cell p-8 flex-1 flex flex-col justify-between">
                <div className="w-10 h-10 rounded-full bg-[#6E9C4E]/15 flex items-center justify-center mb-6">
                  <svg className="w-5 h-5 text-[#6E9C4E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[#111111] mb-2">Sustainable Roots</h3>
                  <p className="font-mono-custom text-[13px] text-[#525252] leading-relaxed tracking-wide">
                    Materials sourced from the earth, returned to the earth. Zero waste, infinite care.
                  </p>
                </div>
              </div>
              <div className="bento-cell p-8 flex-1 flex flex-col justify-between bg-[#6E9C4E]/5">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-6">
                  <svg className="w-5 h-5 text-[#111111]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[#111111] mb-2">Slow Creation</h3>
                  <p className="font-mono-custom text-[13px] text-[#525252] leading-relaxed tracking-wide">
                    No rush. Every piece takes the time it needs to breathe and become.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Section 3: Gallery */}
      <section id="gallery" className="relative z-10 px-6 py-24 md:py-32">
        <div className="max-w-300 mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-20 gap-8 fade-in-up">
            <div>
              <p className="font-mono-custom text-[11px] text-[#6E9C4E] tracking-[0.2em] uppercase mb-4">The Meadow Gallery</p>
              <h2 className="font-handwritten text-[#111111] font-normal" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.2 }}>
                From the Meadow.
              </h2>
            </div>
            <button className="outline-btn self-start md:self-auto">
              View All Works
              <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 fade-in-up" style={{ transitionDelay: '0.1s' }}>
            {/* Large Cabin */}
            <div className="md:col-span-2 md:row-span-2 bento-cell-img relative" style={{ minHeight: '500px' }}>
              <Image src="/3.png" alt="Rustic cabin in rolling hills" fill className="object-cover"/>
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-6 left-6">
                <div className="bg-white/85 backdrop-blur-md rounded-2xl px-5 py-3.5 shadow-sm border border-white/50">
                  <p className="font-mono-custom text-[10px] text-[#525252] tracking-widest uppercase">Watercolor</p>
                  <p className="font-handwritten text-xl text-[#111111] mt-1 leading-none">The Quiet Cabin</p>
                </div>
              </div>
            </div>

            {/* Sheep */}
            <div className="md:col-span-1 md:row-span-2 bento-cell-img relative" style={{ minHeight: '240px' }}>
              <Image src="/4.png" alt="White sheep with wildflowers" fill className="object-cover"/>
              <div className="absolute inset-0 bg-linear-to-t from-black/15 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-5 left-5 right-5">
                <div className="bg-white/85 backdrop-blur-md rounded-xl px-4 py-3 shadow-sm border border-white/50">
                  <p className="font-handwritten text-lg text-[#111111] leading-none">Gentle Grazer</p>
                </div>
              </div>
            </div>

            {/* Artist */}
            <div className="md:col-span-1 md:row-span-2 bento-cell-img relative" style={{ minHeight: '240px' }}>
              <Image src="/5.png" alt="Artist painting landscape" fill className="object-cover"/>
              <div className="absolute inset-0 bg-linear-to-t from-black/15 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-5 left-5 right-5">
                <div className="bg-white/85 backdrop-blur-md rounded-xl px-4 py-3 shadow-sm border border-white/50">
                  <p className="font-handwritten text-lg text-[#111111] leading-none">In Progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Section 4: Testimonials */}
      <section id="voices" className="relative z-10 px-6 py-24 md:py-32">
        <div className="max-w-300 mx-auto">
          <div className="text-center mb-16 md:mb-20 fade-in-up">
            <p className="font-mono-custom text-[11px] text-[#6E9C4E] tracking-[0.2em] uppercase mb-4">Community</p>
            <h2 className="font-handwritten text-[#111111] font-normal" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.2 }}>
              Voices from the Flock.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 fade-in-up" style={{ transitionDelay: '0.1s' }}>
            {/* Testimonial 1 */}
            <div className="bento-cell p-8 flex flex-col justify-between" style={{ minHeight: '280px' }}>
              <div>
                <svg className="w-8 h-8 text-[#6E9C4E]/30 mb-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p className="font-handwritten text-2xl text-[#111111] leading-snug mb-6">
                  &quot;Meadow gave me the space to breathe and create without pressure. It&apos;s a sanctuary for the soul.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6E9C4E]/20 flex items-center justify-center">
                  <span className="font-handwritten text-lg text-[#6E9C4E]">E</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#111111]">Elena M.</p>
                  <p className="font-mono-custom text-[11px] text-[#525252] tracking-wider uppercase">Illustrator</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bento-cell p-8 flex flex-col justify-between bg-[#6E9C4E]/5" style={{ minHeight: '280px' }}>
              <div>
                <svg className="w-8 h-8 text-[#6E9C4E]/30 mb-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p className="font-handwritten text-2xl text-[#111111] leading-snug mb-6">
                  &quot;The community here is unlike any other. Gentle, supportive, and deeply inspiring.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8FBC6A]/20 flex items-center justify-center">
                  <span className="font-handwritten text-lg text-[#8FBC6A]">J</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#111111]">James T.</p>
                  <p className="font-mono-custom text-[11px] text-[#525252] tracking-wider uppercase">Potter</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bento-cell p-8 flex flex-col justify-between" style={{ minHeight: '280px' }}>
              <div>
                <svg className="w-8 h-8 text-[#6E9C4E]/30 mb-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p className="font-handwritten text-2xl text-[#111111] leading-snug mb-6">
                  &quot;Finally, a platform that values the process as much as the product. Truly refreshing.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#A8D08D]/20 flex items-center justify-center">
                  <span className="font-handwritten text-lg text-[#A8D08D]">S</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#111111]">Sarah K.</p>
                  <p className="font-mono-custom text-[11px] text-[#525252] tracking-wider uppercase">Writer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Section 5: Newsletter / CTA */}
      <section id="join" className="relative z-10 px-6 py-24 md:py-32">
        <div className="max-w-300 mx-auto fade-in-up">
          <div className="bento-cell p-8 md:p-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(110, 156, 78, 0.08) 0%, rgba(255, 255, 255, 0.7) 100%)' }}>
            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#6E9C4E]/10 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-[#8FBC6A]/10 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl">
              <p className="font-mono-custom text-[11px] text-[#6E9C4E] tracking-[0.2em] uppercase mb-4">Stay Connected</p>
              <h2 className="font-handwritten text-[#111111] font-normal mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.2 }}>
                Wander with us.
              </h2>
              <p className="font-mono-custom text-[15px] text-[#525252] tracking-widest leading-relaxed mb-10 max-w-lg">
                Receive gentle letters from the meadow. New collections, artist stories, and quiet moments delivered to your inbox.
              </p>

              <form className="flex flex-col sm:flex-row gap-3 max-w-md" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="flex-1 px-6 py-4 rounded-full bg-white/80 border border-[#111111]/10 text-[#111111] font-mono-custom text-sm tracking-wide placeholder-[#525252]/50 focus:outline-none focus:border-[#111111]/30 transition-colors"
                />
                <MagneticButton type="submit" className="group whitespace-nowrap">
                  Subscribe
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </MagneticButton>
              </form>
              <p className="font-mono-custom text-[11px] text-[#525252]/60 tracking-wider mt-4">No spam. Only meadow whispers. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 pt-16 pb-8">
        <div className="max-w-300 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <a href="#" className="text-xl font-semibold tracking-tight text-[#111111] flex items-center gap-2 mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Meadow
              </a>
              <p className="font-mono-custom text-[13px] text-[#525252] tracking-wide leading-relaxed max-w-sm">
                A gentle space for artists, dreamers, and wanderers. Rooted in nature, crafted with care.
              </p>
            </div>
            <div>
              <p className="font-mono-custom text-[11px] text-[#111111] tracking-[0.15em] uppercase mb-6 font-semibold">Explore</p>
              <ul className="space-y-3">
                <li><a href="#" className="font-mono-custom text-[13px] text-[#525252] hover:text-[#111111] transition-colors tracking-wide">Philosophy</a></li>
                <li><a href="#" className="font-mono-custom text-[13px] text-[#525252] hover:text-[#111111] transition-colors tracking-wide">Gallery</a></li>
                <li><a href="#" className="font-mono-custom text-[13px] text-[#525252] hover:text-[#111111] transition-colors tracking-wide">Journal</a></li>
                <li><a href="#" className="font-mono-custom text-[13px] text-[#525252] hover:text-[#111111] transition-colors tracking-wide">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="font-mono-custom text-[11px] text-[#111111] tracking-[0.15em] uppercase mb-6 font-semibold">Connect</p>
              <ul className="space-y-3">
                <li><a href="#" className="font-mono-custom text-[13px] text-[#525252] hover:text-[#111111] transition-colors tracking-wide">Instagram</a></li>
                <li><a href="#" className="font-mono-custom text-[13px] text-[#525252] hover:text-[#111111] transition-colors tracking-wide">Twitter</a></li>
                <li><a href="#" className="font-mono-custom text-[13px] text-[#525252] hover:text-[#111111] transition-colors tracking-wide">Pinterest</a></li>
                <li><a href="#" className="font-mono-custom text-[13px] text-[#525252] hover:text-[#111111] transition-colors tracking-wide">Newsletter</a></li>
              </ul>
            </div>
          </div>
          <div className="section-divider mb-8"></div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-mono-custom text-[11px] text-[#525252]/60 tracking-wider">© 2024 Meadow. All rights reserved.</p>
            <p className="font-handwritten text-xl text-[#111111]/40">Create from the heart.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
