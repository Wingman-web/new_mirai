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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { 
        rootMargin: '0px 0px -20% 0px', // Triggers when section is 20% into viewport
        threshold: 0 
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
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
        {/* Top Left Image */}
        <div
          className="absolute top-4 left-4 md:top-6 md:left-6 lg:top-8 lg:left-8 w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 0.8 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.8)',
            transitionDelay: '0ms',
          }}
        >
          <img src={textDropLines[0].image} alt={textDropLines[0].text} className="w-full h-full object-cover" />
        </div>

        {/* Center Image */}
        <div
          className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 0.8 : 0,
            transform: isVisible ? 'scale(1) translateX(-50%)' : 'scale(0.8) translateX(-50%)',
            transitionDelay: '100ms',
          }}
        >
          <img src={textDropLines[1].image} alt={textDropLines[1].text} className="w-full h-full object-cover" />
        </div>

        {/* Bottom Right Image */}
        <div
          className="absolute bottom-4 right-[10%] md:bottom-6 md:right-[10%] lg:bottom-8 lg:right-[10%] w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 0.8 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.8)',
            transitionDelay: '200ms',
          }}
        >
          <img src={textDropLines[2].image} alt={textDropLines[2].text} className="w-full h-full object-cover" />
        </div>

        {/* Bottom Left Image */}
        <div
          className="absolute bottom-4 left-[10%] md:bottom-6 md:left-[10%] lg:bottom-8 lg:left-[10%] w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 0.8 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.8)',
            transitionDelay: '300ms',
          }}
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
            className="transition-all duration-700 ease-out"
            style={{ 
              transformStyle: 'preserve-3d',
              transformOrigin: 'center top',
              opacity: idx === 0 ? 1 : (isVisible ? 1 : 0),
              transform: idx === 0 ? 'rotateX(0deg)' : (isVisible ? 'rotateX(0deg)' : 'rotateX(-90deg)'),
              transitionDelay: idx === 0 ? '0ms' : `${(idx - 1) * 150}ms`,
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
