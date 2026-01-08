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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Start when section top reaches 60% of viewport
      // End when section top reaches 10% of viewport
      const startPoint = windowHeight * 0.6;
      const endPoint = windowHeight * 0.1;
      
      // Calculate progress (0 to 1)
      const totalDistance = startPoint - endPoint;
      const currentPosition = startPoint - rect.top;
      
      let progress = currentPosition / totalDistance;
      progress = Math.max(0, Math.min(1, progress)); // Clamp between 0 and 1
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate individual element progress with stagger
  const getTextProgress = (index: number) => {
    if (index === 0) return 1; // First line always visible
    
    // Stagger each line - each starts after the previous is partially done
    const staggerDelay = 0.15; // 15% delay between each line
    const lineDuration = 0.4; // Each line takes 40% of total scroll to complete
    
    const lineStart = (index - 1) * staggerDelay;
    const lineEnd = lineStart + lineDuration;
    
    const lineProgress = (scrollProgress - lineStart) / (lineEnd - lineStart);
    return Math.max(0, Math.min(1, lineProgress));
  };

  const getImageProgress = (index: number) => {
    const staggerDelay = 0.1;
    const imageDuration = 0.5;
    
    const imageStart = index * staggerDelay;
    const imageEnd = imageStart + imageDuration;
    
    const imageProgress = (scrollProgress - imageStart) / (imageEnd - imageStart);
    return Math.max(0, Math.min(1, imageProgress));
  };

  // Easing function for smoother animation
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

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
          className="absolute top-4 left-4 md:top-6 md:left-6 lg:top-8 lg:left-8 w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl will-change-transform"
          style={{
            opacity: easeOutCubic(getImageProgress(0)) * 0.8,
            transform: `scale(${0.8 + easeOutCubic(getImageProgress(0)) * 0.2})`,
          }}
        >
          <img src={textDropLines[0].image} alt={textDropLines[0].text} className="w-full h-full object-cover" />
        </div>

        {/* Center Image */}
        <div
          className="absolute top-[20%] left-[50%] w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl will-change-transform"
          style={{
            opacity: easeOutCubic(getImageProgress(1)) * 0.8,
            transform: `translateX(-50%) scale(${0.8 + easeOutCubic(getImageProgress(1)) * 0.2})`,
          }}
        >
          <img src={textDropLines[1].image} alt={textDropLines[1].text} className="w-full h-full object-cover" />
        </div>

        {/* Bottom Right Image */}
        <div
          className="absolute bottom-4 right-[10%] md:bottom-6 md:right-[10%] lg:bottom-8 lg:right-[10%] w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl will-change-transform"
          style={{
            opacity: easeOutCubic(getImageProgress(2)) * 0.8,
            transform: `scale(${0.8 + easeOutCubic(getImageProgress(2)) * 0.2})`,
          }}
        >
          <img src={textDropLines[2].image} alt={textDropLines[2].text} className="w-full h-full object-cover" />
        </div>

        {/* Bottom Left Image */}
        <div
          className="absolute bottom-4 left-[10%] md:bottom-6 md:left-[10%] lg:bottom-8 lg:left-[10%] w-[220px] h-[280px] sm:w-[280px] sm:h-[350px] lg:w-[350px] lg:h-[440px] rounded-lg overflow-hidden shadow-xl will-change-transform"
          style={{
            opacity: easeOutCubic(getImageProgress(3)) * 0.8,
            transform: `scale(${0.8 + easeOutCubic(getImageProgress(3)) * 0.2})`,
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
        {textDropLines.map((item, idx) => {
          const progress = getTextProgress(idx);
          const easedProgress = easeOutCubic(progress);
          
          return (
            <div 
              key={idx}
              className="will-change-transform"
              style={{ 
                transformStyle: 'preserve-3d',
                transformOrigin: 'center top',
                opacity: idx === 0 ? 1 : easedProgress,
                transform: idx === 0 
                  ? 'rotateX(0deg)' 
                  : `rotateX(${-90 + easedProgress * 90}deg)`,
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
