'use client';

import { useEffect, useState } from 'react';

export default function Footer() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.pageYOffset || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, scroll / Math.max(1, height)));
      
      setScrollProgress(progress);
      setShowBackToTop(scroll > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pathLength = 307.919;

  return (
    <footer
      className="relative h-screen bg-[#050505]"
      style={{ zIndex: 10 }}
      role="contentinfo"
      aria-label="Footer - Pavani Mirai"
    >
      <div
        className="absolute inset-0 bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://azure-baboon-302476.hostingersite.com/mirai_latest/media/lobby.png')",
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed right-5 bottom-5 w-14 h-14 rounded-full bg-white/3 flex items-center justify-center cursor-pointer z-50 transition-all duration-300 hover:bg-white/6 ${
          showBackToTop ? 'opacity-95' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <svg 
          className="w-11 h-11" 
          viewBox="-1 -1 102 102"
        >
          <path
            d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
            fill="none"
            stroke="#ffffff"
            strokeWidth="6"
            strokeLinecap="round"
            style={{
              strokeDasharray: `${pathLength} ${pathLength}`,
              strokeDashoffset: pathLength * (1 - scrollProgress),
              transition: 'stroke-dashoffset 150ms linear'
            }}
          />
        </svg>
      </button>
    </footer>
  );
}
