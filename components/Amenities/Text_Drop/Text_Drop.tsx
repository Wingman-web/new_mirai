'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const textDropLines = [
  { text: 'Indulgence', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
  { text: 'That Helps', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80' },
  { text: 'You to Stay in', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80' },
  { text: 'Your Element', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80' },
];

// Inner component that handles the animation
function AnimatedContent({ animationKey }: { animationKey: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Register plugin
    gsap.registerPlugin(ScrollTrigger);
    
    const section = sectionRef.current;
    const textContainer = textContainerRef.current;
    if (!section || !textContainer) return;

    // Small delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Set initial states for text
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

        // Set initial states for images
        imageRefs.current.forEach((imgEl) => {
          if (!imgEl) return;
          gsap.set(imgEl, { scale: 0.8, opacity: 0 });
        });

        // Refresh ScrollTrigger
        ScrollTrigger.refresh(true);

        // Text animation timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1,
            invalidateOnRefresh: true,
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

        // Images animation timeline
        const tlImages = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'center center',
            scrub: 1,
            invalidateOnRefresh: true,
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

      // Store context for cleanup
      (section as any).__gsapContext = ctx;
    }, 100);

    return () => {
      clearTimeout(initTimer);
      const ctx = (section as any)?.__gsapContext;
      if (ctx) {
        ctx.revert();
      }
      // Kill all ScrollTriggers associated with this section
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section) {
          st.kill();
        }
      });
    };
  }, [animationKey]); // Re-run when key changes

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
          <img
            src={textDropLines[0].image}
            alt={textDropLines[0].text}
            className="w-full h-full object-cover"
          />
        </div>

        <div
          ref={(el) => { imageRefs.current[1] = el; }}
          className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl will-change-transform"
          style={{ opacity: 0, transform: 'scale(0.8)' }}
        >
          <img
            src={textDropLines[1].image}
            alt={textDropLines[1].text}
            className="w-full h-full object-cover"
          />
        </div>

        <div
          ref={(el) => { imageRefs.current[2] = el; }}
          className="absolute bottom-4 right-[10%] md:bottom-6 md:right-[10%] lg:bottom-8 lg:right-[10%] w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl will-change-transform"
          style={{ opacity: 0, transform: 'scale(0.8)' }}
        >
          <img
            src={textDropLines[2].image}
            alt={textDropLines[2].text}
            className="w-full h-full object-cover"
          />
        </div>

        <div
          ref={(el) => { imageRefs.current[3] = el; }}
          className="absolute bottom-4 left-[10%] md:bottom-6 md:left-[10%] lg:bottom-8 lg:left-[10%] w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl will-change-transform"
          style={{ opacity: 0, transform: 'scale(0.8)' }}
        >
          <img
            src={textDropLines[3].image}
            alt={textDropLines[3].text}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Big Text */}
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
              opacity: idx === 0 ? 1 : 0,
              transform: idx === 0 ? 'rotateX(0deg)' : 'rotateX(-90deg)',
            }}
          >
            <div
              className="text-[clamp(3.5rem,10vw,8rem)] font-light tracking-[-0.02em] text-[#6B2C3E] leading-[1.1] text-center whitespace-nowrap"
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
              }}
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

// Wrapper component that forces remount on navigation
export default function MiraiAmenitiesShowcase() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Generate new key on mount to force fresh animation
    setKey(Date.now());
    
    // Also listen for route changes (Next.js)
    const handleRouteChange = () => {
      setKey(Date.now());
    };

    // For Next.js App Router
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      // Clean up all ScrollTriggers on unmount
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return <AnimatedContent key={key} animationKey={key} />;
}
