'use client';

import React, { useEffect, useRef, useState } from 'react';

const MiraiAmenities: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    // Intersection Observer for reveal animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(box);
          }
        });
      },
      { threshold: 0.18 }
    );

    observer.observe(box);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    // Check if device supports hover
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    if (!supportsHover) return;

    const handleMouseMove = (e: MouseEvent) => {
      const r = box.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      
      box.style.transform = `translateX(${x * 8}px) translateY(${-y * 8}px) rotateX(${-y * 2}deg) rotateY(${x * 2}deg)`;
    };

    const handleMouseLeave = () => {
      box.style.transform = '';
    };

    box.addEventListener('mousemove', handleMouseMove);
    box.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      box.removeEventListener('mousemove', handleMouseMove);
      box.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-12 bg-white">
      <div className="w-full max-w-[1100px]">
        <div
          ref={boxRef}
          className={`
            relative
            text-center
            transition-all duration-[800ms] ease-[cubic-bezier(0.2,0.9,0.2,1)]
            motion-reduce:transition-none
            ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
          `}
          style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-[#8b4f4f] mb-8 sm:mb-12" style={{ fontFamily: 'serif' }}>
            Limitless Indulgence<br />For the Limited Few
          </h1>
          
          <p className="text-[#5a5a5a] text-base sm:text-lg lg:text-xl leading-relaxed mb-6 max-w-4xl mx-auto" style={{ fontFamily: 'sans-serif' }}>
            Experience leisure in every corner at Mirai with 2,00,000 sq. ft. amenities curated just for you.
          </p>
          
          <p className="text-[#5a5a5a] text-base sm:text-lg lg:text-xl leading-relaxed mb-6 max-w-4xl mx-auto" style={{ fontFamily: 'sans-serif' }}>
            From the podium to the element pods & the gigantic Clubhouse, Mirai has everything you desire to beat moments of monotony and transform them into core memories.
          </p>
          
          <p className="text-[#5a5a5a] text-base sm:text-lg lg:text-xl leading-relaxed m-0 max-w-4xl mx-auto" style={{ fontFamily: 'sans-serif' }}>
            The Podium-level amenities comprise varied landscapes and lush gardens to keep you rooted to nature. The lavish Clubhouse spread across 1,01,415 host a myriad of amenities spread across 4 dynamic levels. The Pods on the terrace are an extension of space where one can truly connect and feel one with the different elements that birthed Mirai.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MiraiAmenities;