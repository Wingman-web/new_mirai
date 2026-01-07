'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
const dayViewPath = '/images/day_view.png';

export default function ContactForm() {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgError, setBgError] = useState(false);
  const [opacity, setOpacity] = useState(0);

  // Preload background image
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      console.log('Background image loaded successfully');
      setBgLoaded(true);
    };
    img.onerror = (e) => {
      console.error('Background image failed to load:', e);
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
      
      // Calculate distance from bottom
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      
      // Start showing when within 300px of bottom, fully visible at 50px
      if (distanceFromBottom > 300) {
        setOpacity(0);
      } else if (distanceFromBottom <= 50) {
        setOpacity(1);
      } else {
        const fadeProgress = 1 - ((distanceFromBottom - 50) / 250);
        setOpacity(Math.max(0, Math.min(1, fadeProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render if not visible
  if (opacity === 0) {
    return null;
  }

  return (
    <section
      id="contact-section"
      className="fixed inset-0 flex items-center justify-start"
      style={{ 
        zIndex: 4, // Lower than Hero (5) so it sits behind everything
        opacity: opacity,
        transition: 'opacity 0.3s ease-out',
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
      }}
    >
      {/* Fallback solid background - always render this first */}
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundColor: bgError ? '#f3f4f6' : '#1a1a2e',
          zIndex: 0 
        }} 
      />

      {/* Background Image */}
      {bgLoaded && !bgError && (
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <Image
            src={dayViewPath}
            alt="Day view"
            fill
            priority
            unoptimized
            className="object-cover object-center"
            onError={() => setBgError(true)}
          />
        </div>
      )}
      
      {/* Gradient overlay for better text readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" 
        style={{ zIndex: 2 }}
      />
      
      {/* Content */}
      <div className="relative h-full pl-6 lg:pl-12" style={{ zIndex: 3 }}>
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
