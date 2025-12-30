'use client';

import { useEffect, useRef, useState } from 'react';

interface SparkleLogoProps {
  emoji: string;
  alt: string;
  delay: number;
}

const SparkleLogo = ({ emoji, alt, delay }: SparkleLogoProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (logoRef.current) {
      observer.observe(logoRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={logoRef}
      className={`
        w-16 h-16 md:w-24 md:h-24 lg:w-24 lg:h-24
        bg-gradient-to-br from-purple-500 to-purple-700
        rounded-2xl lg:rounded-[20px]
        flex items-center justify-center
        border border-transparent shadow-lg
        transition-all duration-600 ease-out
        text-4xl md:text-5xl
        ${isVisible ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-12'}
      `}
      title={alt}
    >
      {emoji}
    </div>
  );
};

interface IndulgenceCloudsProps {
  fullWindow?: boolean;
  embedded?: boolean;
}

export default function IndulgenceClouds({ 
  fullWindow = false, 
  embedded = false 
}: IndulgenceCloudsProps) {
  const [headingVisible, setHeadingVisible] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setHeadingVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );

    if (headingRef.current) {
      observer.observe(headingRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const logos = [
    { emoji: '☁️', alt: 'Cloud' },
    { emoji: '✨', alt: 'Sparkle' },
    { emoji: '🌙', alt: 'Moon' },
    { emoji: '⭐', alt: 'Star' },
  ];

  const sectionClasses = `
    flex flex-col justify-center items-center w-full
    bg-transparent gap-2
    ${fullWindow 
      ? 'min-h-screen py-12 px-4' 
      : 'min-h-0 py-5'
    }
  `;

  const headingClasses = `
    font-sans text-center mx-4 my-1.5
    text-[#78252f] font-normal
    transition-all duration-600 ease-out
    ${fullWindow ? 'text-6xl md:text-7xl my-2 mx-6' : 'text-2xl md:text-3xl'}
    ${headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'}
  `;

  return (
    <section className={sectionClasses}>
      <h1 ref={headingRef} className={headingClasses}>
        Indulgence Amidst
        <br />
        The Clouds
      </h1>
      
      <div className="flex justify-center items-center min-h-10 gap-8 md:gap-16 lg:gap-24 flex-wrap pt-1 pb-2 mt-2.5">
        {logos.map((logo, index) => (
          <SparkleLogo
            key={logo.alt}
            emoji={logo.emoji}
            alt={logo.alt}
            delay={index * 150}
          />
        ))}
      </div>
    </section>
  );
}