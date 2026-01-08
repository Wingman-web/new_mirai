'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const textDropLines = [
  { text: 'Indulgence', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
  { text: 'That Helps', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80' },
  { text: 'You to Stay in', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80' },
  { text: 'Your Element', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80' },
];

export default function MiraiAmenitiesShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    // Kill any existing ScrollTriggers for clean slate
    ScrollTrigger.getAll().forEach(st => st.kill());

    const ctx = gsap.context(() => {
      // Set initial states for text elements
      textRefs.current.forEach((textEl, idx) => {
        if (!textEl) return;
        gsap.set(textEl, {
          rotateX: idx === 0 ? 0 : -90,
          opacity: idx === 0 ? 1 : 0,
          transformOrigin: 'center top',
          force3D: true,
        });
      });

      // Set initial states for image elements
      imageRefs.current.forEach((imgEl) => {
        if (!imgEl) return;
        gsap.set(imgEl, { 
          scale: 0.8, 
          opacity: 0,
          force3D: true,
        });
      });

      // Text animation timeline
      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 60%', // Animation starts when top of section reaches 60% from top of viewport
          toggleActions: 'play none none reverse', // play on enter, reverse on leave back
        },
      });

      textRefs.current.forEach((textEl, idx) => {
        if (!textEl || idx === 0) return;
        textTl.to(
          textEl,
          {
            rotateX: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
          },
          (idx - 1) * 0.2
        );
      });

      // Image animation timeline
      const imageTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%', // Images start slightly earlier
          toggleActions: 'play none none reverse',
        },
      });

      imageRefs.current.forEach((imgEl, idx) => {
        if (!imgEl) return;
        imageTl.to(
          imgEl,
          {
            scale: 1,
            opacity: 0.8,
            duration: 0.8,
            ease: 'power2.out',
          },
          idx * 0.1
        );
      });

    }, section);

    // Refresh ScrollTrigger after setup
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen pb-48 md:pb-64 lg:pb-80 bg-white overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Background Images */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          ref={(el) => { imageRefs.current[0] = el; }}
          className="absolute top-4 left-4 md:top-6 md:left-6 lg:top-8 lg:left-8 w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl will-change-transform"
          style={{ opacity: 0, transform: 'scale(0.8)' }}
        >
          <img src={textDropLines[0].image} alt={textDropLines[0].text} className="w-full h-full object-cover" />
        </div>

        <div
          ref={(el) => { imageRefs.current[1] = el; }}
          className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl will-change-transform"
          style={{ opacity: 0, transform: 'scale(0.8)' }}
        >
          <img src={textDropLines[1].image} alt={textDropLines[1].text} className="w-full h-full object-cover" />
        </div>

        <div
          ref={(el) => { imageRefs.current[2] = el; }}
          className="absolute bottom-4 right-[10%] md:bottom-6 md:right-[10%] lg:bottom-8 lg:right-[10%] w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl will-change-transform"
          style={{ opacity: 0, transform: 'scale(0.8)' }}
        >
          <img src={textDropLines[2].image} alt={textDropLines[2].text} className="w-full h-full object-cover" />
        </div>

        <div
          ref={(el) => { imageRefs.current[3] = el; }}
          className="absolute bottom-4 left-[10%] md:bottom-6 md:left-[10%] lg:bottom-8 lg:left-[10%] w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl will-change-transform"
          style={{ opacity: 0, transform: 'scale(0.8)' }}
        >
          <img src={textDropLines[3].image} alt={textDropLines[3].text} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Big Text */}
      <div 
        className="relative z-10 flex flex-col items-center pt-4 md:pt-6 lg:pt-8 gap-6 md:gap-10 lg:gap-14"
        style={{ perspective: '1000px' }}
      >
        {textDropLines.map((item, idx) => (
          <div 
            key={idx}
            ref={(el) => { textRefs.current[idx] = el; }}
            className="will-change-transform"
            style={{ 
              transformStyle: 'preserve-3d',
              transformOrigin: 'center top',
              opacity: idx === 0 ? 1 : 0,
              transform: idx === 0 ? 'rotateX(0deg)' : 'rotateX(-90deg)',
            }}
          >
            <div
              className="text-[clamp(3.5rem,10vw,8rem)] font-light tracking-[-0.02em] text-[#6B2C3E] leading-[1.1] text-center whitespace-nowrap"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              {item.text}
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500&display=swap');
      `}</style>
    </section>
  );
}
