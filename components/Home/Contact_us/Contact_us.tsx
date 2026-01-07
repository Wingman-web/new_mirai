'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
const dayViewPath = '/images/day_view.png';

export default function ContactForm() {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgError, setBgError] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setBgLoaded(true);
    img.onerror = () => {
      setBgLoaded(true);
      setBgError(true);
    };
    img.src = dayViewPath;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;
      
      // Calculate how far from the absolute bottom we are
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      
      // Only start showing when within 100px of the bottom
      // Fully visible when at the very bottom (0px from bottom)
      if (distanceFromBottom > 100) {
        setOpacity(0);
      } else if (distanceFromBottom <= 0) {
        setOpacity(1);
      } else {
        // Fade in as we approach the bottom
        const fadeProgress = 1 - (distanceFromBottom / 100);
        setOpacity(fadeProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render at all if completely invisible
  if (opacity === 0) {
    return null;
  }

  return (
    <section
      id="contact-section"
      className="fixed inset-0 flex items-center justify-start"
      style={{ 
        zIndex: 20,
        opacity: opacity,
        transition: 'opacity 0.3s ease-out',
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
        backgroundColor: bgLoaded && !bgError ? 'black' : '#f3f4f6'
      }}
    >
      {/* Background Image */}
      {bgLoaded && !bgError && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={dayViewPath}
            alt="Day view"
            fill
            priority
            unoptimized
            className="object-cover object-center"
          />
        </div>
      )}
      
      {/* Fallback gradient */}
      {(!bgLoaded || bgError) && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-gray-100 to-white" aria-hidden="true" />
      )}
      
      <div className="relative z-10 h-full pl-6 lg:pl-12">
        <div className="flex items-center justify-start h-full">
          <div className="w-auto bg-white rounded-xl p-8 md:p-10 shadow-2xl" style={{ maxWidth: '340px' }}>
            <h2 className="text-3xl font-bold mb-8 text-gray-900 font-serif">Contact Us</h2>
            <div className="space-y-6">
              <input 
                placeholder="Name *" 
                className="w-full px-4 py-4 border-b-2 border-gray-200 outline-none text-black focus:border-blue-600 transition-colors" 
              />
              <input 
                placeholder="Email *" 
                className="w-full px-4 py-4 border-b-2 border-gray-200 outline-none text-black focus:border-blue-600 transition-colors" 
              />
              <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-all">
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
