'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const textDropLines = [
  { text: 'Indulgence', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
  { text: 'That Helps', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80' },
  { text: 'You to Stay in', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80' },
  { text: 'Your Element', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80' },
];

export default function MiraiAmenitiesShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const textContainer = textContainerRef.current;
    if (!section || !textContainer) return;

    textRefs.current.forEach((textEl, idx) => {
      if (!textEl) return;
      if (idx === 0) {
        gsap.set(textEl, { 
          rotateX: 0,
          opacity: 1,
          transformOrigin: 'center top',
        });
      } else {
        gsap.set(textEl, { 
          rotateX: -90,
          opacity: 0,
          transformOrigin: 'center top',
        });
      }
    });

    gsap.set(imageRefs.current, { scale: 0.8, opacity: 0 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1,
        },
      });

      textRefs.current.forEach((textEl, idx) => {
        if (!textEl || idx === 0) return;
        
        tl.to(
          textEl,
          {
            rotateX: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
          },
          (idx - 1) * 0.25
        );
      });

      const tlImages = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'center center',
          scrub: 1,
        },
      });

      imageRefs.current.forEach((imgEl, idx) => {
        if (!imgEl) return;
        tlImages.to(
          imgEl,
          {
            scale: 1,
            opacity: 0.8,
            duration: 1,
            ease: 'power2.out',
          },
          idx * 0.15
        );
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen pb-48 md:pb-64 lg:pb-80 bg-white overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Background Images - Positioned behind text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Top Left Image - At corner */}
        <div
          ref={(el) => { imageRefs.current[0] = el; }}
          className="absolute top-4 left-4 md:top-6 md:left-6 lg:top-8 lg:left-8 w-[180px] h-[220px] sm:w-[220px] sm:h-[280px] lg:w-[280px] lg:h-[350px] rounded-lg overflow-hidden shadow-xl will-change-transform"
        >
          <img
            src={textDropLines[0].image}
            alt={textDropLines[0].text}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Center Image - Behind text, moved left */}
        <div
          ref={(el) => { imageRefs.current[1] = el; }}
          className="absolute top-[20%] left-[40%] -translate-x-1/2 w-[180px] h-[220px] sm:w-[220px] sm:h-[280px] lg:w-[280px] lg:h-[350px] rounded-lg overflow-hidden shadow-xl will-change-transform"
        >
          <img
            src={textDropLines[1].image}
            alt={textDropLines[1].text}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bottom Left Image */}
        <div
          ref={(el) => { imageRefs.current[2] = el; }}
          className="absolute bottom-56 left-[15%] w-[180px] h-[220px] sm:w-[220px] sm:h-[280px] lg:w-[280px] lg:h-[350px] rounded-lg overflow-hidden shadow-xl will-change-transform"
        >
          <img
            src={textDropLines[2].image}
            alt={textDropLines[2].text}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bottom Right Image */}
        <div
          ref={(el) => { imageRefs.current[3] = el; }}
          className="absolute bottom-40 right-[15%] w-[180px] h-[220px] sm:w-[220px] sm:h-[280px] lg:w-[280px] lg:h-[350px] rounded-lg overflow-hidden shadow-xl will-change-transform"
        >
          <img
            src={textDropLines[3].image}
            alt={textDropLines[3].text}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Big Text - At the top */}
      <div 
        ref={textContainerRef}
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
            }}
          >
            <div
              className="text-[clamp(2.5rem,8vw,6rem)] font-light tracking-[-0.02em] text-[#6B2C3E] leading-[1.1] text-center whitespace-nowrap"
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
              }}
            >
              {item.text}
            </div>
          </div>
        ))}
      </div>

      {/* Font import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500&display=swap');
      `}</style>
    </section>
  );
}
