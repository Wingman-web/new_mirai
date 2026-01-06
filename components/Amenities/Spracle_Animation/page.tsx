'use client';

import { useEffect, useRef, useState } from 'react';

interface SparkleLogoProps {
  emoji?: string;
  imageUrl?: string;
  alt: string;
  delay: number;
}

const SparkleLogo = ({ emoji, imageUrl, alt, delay }: SparkleLogoProps) => {
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
        w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32
        ${imageUrl ? 'bg-transparent shadow-none' : 'bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg'}
        ${imageUrl ? '' : 'rounded-2xl lg:rounded-[24px]'}
        flex items-center justify-center
        transition-all duration-600 ease-out
        text-4xl md:text-5xl lg:text-6xl
        ${isVisible ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-12'}
      `}
      title={alt}
    >
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={alt} 
          className="w-full h-full object-contain"
        />
      ) : (
        emoji
      )}
    </div>
  );
};

interface IndulgenceCloudsProps {
  fullWindow?: boolean;
  embedded?: boolean;
}

export default function IndulgenceClouds({ 
  fullWindow = true, 
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
    { imageUrl: 'https://azure-baboon-302476.hostingersite.com/mirai_latest/media/pods-03.png', alt: 'Pods' },
    { imageUrl: 'https://azure-baboon-302476.hostingersite.com/mirai_latest/media/pods-02.png', alt: 'Pods 2' },
    { imageUrl: 'https://azure-baboon-302476.hostingersite.com/mirai_latest/media/pods-04.png', alt: 'Pods 3' },
    { imageUrl: 'https://azure-baboon-302476.hostingersite.com/mirai_latest/media/pods-01.png', alt: 'Pods 4' },
  ];

  const sectionClasses = `
    flex flex-col justify-center items-center w-full
    bg-transparent
    ${fullWindow 
      ? 'h-screen px-4' 
      : 'min-h-0 py-5 gap-2'
    }
  `;

  const headingClasses = `
    font-sans text-center mx-4
    text-[#78252f] font-normal
    transition-all duration-600 ease-out
    ${fullWindow ? 'text-6xl md:text-7xl lg:text-8xl mb-12 md:mb-16' : 'text-2xl md:text-3xl my-1.5'}
    ${headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'}
  `;

  return (
    <section className={sectionClasses}>
      <h1 ref={headingRef} className={headingClasses}>
        Indulgence Amidst
        <br />
        The Clouds
      </h1>
      
      <div className={`flex justify-center items-center gap-8 md:gap-16 lg:gap-24 flex-wrap ${fullWindow ? '' : 'min-h-10 pt-1 pb-2 mt-2.5'}`}>
        {logos.map((logo, index) => (
          <SparkleLogo
            key={logo.alt}
            imageUrl={logo.imageUrl}
            alt={logo.alt}
            delay={index * 150}
          />
        ))}
      </div>
    </section>
  );
}
