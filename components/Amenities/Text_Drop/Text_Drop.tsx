'use client';

import { useEffect, useRef, useState } from 'react';

const textDropLines = [
  { text: 'Indulgence', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
  { text: 'That Helps', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80' },
  { text: 'You to Stay in', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80' },
  { text: 'Your Element', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80' },
];

export default function MiraiAmenitiesShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Refs for smooth interpolation (Lerping)
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const requestRef = useRef<number>();

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const startPoint = windowHeight * 0.30;
      const endPoint = windowHeight * -0.30;
      const totalDistance = startPoint - endPoint;
      const currentPos = startPoint - rect.top;
      
      const rawProgress = Math.max(0, Math.min(1, currentPos / totalDistance));
      targetProgress.current = rawProgress;
    };

    // This loop creates the "smooth catch-up" effect
    const smoothLoop = () => {
      const lerpFactor = 0.1; // Lower = smoother/slower, Higher = snappier
      const diff = targetProgress.current - currentProgress.current;
      
      if (Math.abs(diff) > 0.0001) {
        currentProgress.current += diff * lerpFactor;
        setScrollProgress(currentProgress.current);
      }
      requestRef.current = requestAnimationFrame(smoothLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    requestRef.current = requestAnimationFrame(smoothLoop);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const getTextProgress = (index: number) => {
    if (index === 0) return 1;
    const staggerDelay = 0.20;
    const lineDuration = 0.50;
    const lineStart = (index - 1) * staggerDelay;
    const lineEnd = lineStart + lineDuration;
    return Math.max(0, Math.min(1, (scrollProgress - lineStart) / (lineEnd - lineStart)));
  };

  const getImageProgress = (index: number) => {
    const staggerDelay = 0.12;
    const imageDuration = 0.6;
    const imageStart = index * staggerDelay;
    const imageEnd = imageStart + imageDuration;
    return Math.max(0, Math.min(1, (scrollProgress - imageStart) / (imageEnd - imageStart)));
  };

  const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen pb-48 md:pb-64 lg:pb-80 bg-white overflow-hidden"
    >
      {/* Background Images */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        {textDropLines.map((item, idx) => (
          <div
            key={`img-${idx}`}
            className={`absolute w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl will-change-transform ${
              idx === 0 ? 'top-8 left-8' : 
              idx === 1 ? 'top-[20%] left-1/2 -translate-x-1/2' :
              idx === 2 ? 'bottom-8 right-[10%]' : 'bottom-8 left-[10%]'
            }`}
            style={{
              opacity: easeOutQuint(getImageProgress(idx)) * 0.8,
              transform: `scale(${0.8 + easeOutQuint(getImageProgress(idx)) * 0.2}) translateZ(0)`,
              transition: 'transform 0.2s ease-out, opacity 0.2s ease-out', // Smoothing micro-jitters
            }}
          >
            <img src={item.image} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Big Text Container */}
      <div 
        className="relative z-10 flex flex-col items-center pt-12 gap-8 md:gap-14"
        style={{ perspective: '2000px' }} // Deepened perspective for smoother looking rotation
      >
        {textDropLines.map((item, idx) => {
          const progress = getTextProgress(idx);
          const easedProgress = easeOutQuint(progress);
          
          return (
            <div 
              key={idx}
              className="will-change-transform"
              style={{ 
                transformStyle: 'preserve-3d',
                transformOrigin: '50% 0%',
                backfaceVisibility: 'hidden',
                opacity: idx === 0 ? 1 : easedProgress,
                transform: idx === 0 
                  ? 'rotateX(0deg) translateZ(0)' 
                  : `rotateX(${-90 + easedProgress * 90}deg) translateZ(0)`,
                transition: 'transform 0.1s linear', // Final polish for frame gaps
              }}
            >
              <div
                className="text-[clamp(3.5rem,10vw,8rem)] font-light tracking-[-0.02em] text-[#6B2C3E] leading-[1.1] text-center whitespace-nowrap"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                {item.text}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500&display=swap');
      `}</style>
    </section>
  );
}
