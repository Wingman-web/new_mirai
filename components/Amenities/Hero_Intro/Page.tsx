'use client';

import React, { useEffect, useRef, useState } from 'react';

const AnimatedElement = ({ delay = 0, children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
        } else {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setIsVisible(false);
        }
      },
      { 
        rootMargin: '0px 0px -12% 0px', 
        threshold: 0 
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-[0.99]'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default function MiraiAmenities() {
  return (
    <section className="relative py-16 lg:py-32 bg-white overflow-hidden min-h-screen flex items-center">
      <div className="container max-w-[1100px] mx-auto px-4 lg:px-6 relative z-10 w-full">
        <div className="text-center">
          <AnimatedElement delay={0} className="mb-6">
            <h2 
              style={{ 
                fontFamily: 'Georgia, serif',
                fontSize: '4rem',
                lineHeight: '1.1',
                fontWeight: 500,
                color: '#78252f',
                marginBottom: '2rem'
              }}
            >
              Limitless Indulgence<br />For the Limited Few
            </h2>
          </AnimatedElement>

          <AnimatedElement delay={150} className="max-w-4xl mx-auto" style={{ marginTop: '30px' }}>
            <p style={{ 
              fontSize: '20px',
              lineHeight: '1.4',
              fontWeight: '300',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              display: 'block',
              marginBlockStart: '1em',
              marginBlockEnd: '1em',
              marginInlineStart: '0px',
              marginInlineEnd: '0px',
              unicodeBidi: 'isolate',
              color: '#000000'
            }}>
              Experience leisure in every corner at Mirai with 2,00,000 sq. ft. amenities curated just for you.
            </p>
            
            <p style={{ 
              fontSize: '20px',
              lineHeight: '1.4',
              fontWeight: '300',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              display: 'block',
              marginBlockStart: '1em',
              marginBlockEnd: '1em',
              marginInlineStart: '0px',
              marginInlineEnd: '0px',
              unicodeBidi: 'isolate',
              color: '#000000'
            }}>
              From the podium to the element pods & the gigantic Clubhouse, Mirai has everything you desire to beat moments of monotony and transform them into core memories.
            </p>
            
            <p style={{ 
              fontSize: '20px',
              lineHeight: '1.4',
              fontWeight: '300',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              display: 'block',
              marginBlockStart: '1em',
              marginBlockEnd: '1em',
              marginInlineStart: '0px',
              marginInlineEnd: '0px',
              unicodeBidi: 'isolate',
              color: '#000000'
            }}>
              The Podium-level amenities comprise varied landscapes and lush gardens to keep you rooted to nature. The lavish Clubhouse spread across 1,01,415 host a myriad of amenities spread across 4 dynamic levels. The Pods on the terrace are an extension of space where one can truly connect and feel one with the different elements that birthed Mirai.
            </p>
          </AnimatedElement>
        </div>
      </div>
    </section>
  );
}
