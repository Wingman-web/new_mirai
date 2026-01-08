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
    <footer className="relative w-full h-96">
      <img 
        src="https://azure-baboon-302476.hostingersite.com/mirai_latest/media/lobby.png"
        alt="Footer"
        className="w-full h-full object-cover"
      />
    </footer>
  );
}
