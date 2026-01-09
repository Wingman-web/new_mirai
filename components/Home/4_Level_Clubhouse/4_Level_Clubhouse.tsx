'use client';
import React, { useEffect, useRef, useState, memo, useCallback } from 'react';
import Image from 'next/image';
import BlurText from '../BlurText';

interface AnimatedElementProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const AnimatedElement: React.FC<AnimatedElementProps> = memo(({ 
  children, 
  delay = 0, 
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const renderChildren = useCallback(() => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child) && typeof child.type !== 'string') {
        return React.cloneElement(child as React.ReactElement<any>, { play: isVisible });
      }
      return child;
    });
  }, [children, isVisible]);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-600 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-5.5 scale-[0.995]'
      } ${className}`}
    >
      {renderChildren()}
    </div>
  );
});

AnimatedElement.displayName = 'AnimatedElement';

const BLUR_TEXT_CONTENT = "The 1,01,415 sft. Clubhouse at Mirai is built for every version of you. The different storeys here become a world in itself, designed for every moment to be enjoyed by everybody.";

function ClubhouseIntro() {
  return (
    <section className="relative py-16 lg:py-20 bg-white">
      <div className="container max-w-275 mx-auto px-10 lg:px-0">
        <div className="text-center px-4 lg:px-20 pb-0 lg:pb-8">
          <AnimatedElement delay={0}>
            <h2 className="text-[48px] leading-[1.05] mb-4 migra-heading pods-heading" style={{ fontFamily: 'var(--font-magra)', fontWeight: 100 }}>
              4-Level Clubhouse<br />
              For Indulgence Across Storeys
            </h2>
          </AnimatedElement>
          
          <AnimatedElement delay={120} className="max-w-200 mx-auto">
            <BlurText
              text={BLUR_TEXT_CONTENT}
              delay={300}
              animateBy="words"
              direction="top"
              className="block text-[#6b6b6b] text-base lg:text-lg leading-relaxed"
            />
          </AnimatedElement>
        </div>
      </div>
      
      {/* Shape decoration - hidden on mobile, lazy loaded */}
      <div className="hidden lg:block absolute -right-[6%] top-2.5 w-[55%] max-w-175 opacity-[0.12] pointer-events-none">
        <Image
          src="/media/shape-two.png"
          alt=""
          width={760}
          height={400}
          loading="lazy"
          decoding="async"
          className="w-full h-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
        />
      </div>
    </section>
  );
}

export default memo(ClubhouseIntro);
