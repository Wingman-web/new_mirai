'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface AmenityItem {
  icon: string;
  name: string;
  description: string;
}

const amenitiesData: AmenityItem[] = [
  {
    icon: '🏊‍♂️',
    name: 'Infinity Pool',
    description: 'Podium-level pool with lounging decks & cabanas.',
  },
  {
    icon: '🏋️‍♀️',
    name: 'Fitness Zone',
    description: 'State-of-the-art gym and dedicated studios.',
  },
  {
    icon: '🌿',
    name: 'Lush Gardens',
    description: 'Landscaped pockets for quiet moments and strolls.',
  },
  {
    icon: '🎭',
    name: 'Clubhouse',
    description: 'Four levels of curated experiences and events.',
  },
];

const textDropLines = [
  { text: 'Indulgence', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
  { text: 'That Helps', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80' },
  { text: 'You to Stay in', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80' },
  { text: 'Your Element', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80' },
];

// Additional floating images for more visual interest
const floatingImages = [
  { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', position: 'left' },
  { src: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80', position: 'right' },
  { src: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=600&q=80', position: 'left' },
  { src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80', position: 'right' },
];

export default function MiraiAmenitiesShowcase() {
  const startBoxRef = useRef<HTMLDivElement>(null);
  const textDropRef = useRef<HTMLElement>(null);
  const amenitiesBgRef = useRef<HTMLElement>(null);
  const [textProgress, setTextProgress] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(-1);

  // Mouse parallax handlers
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!startBoxRef.current) return;
    const rect = startBoxRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    startBoxRef.current.style.transform = `translateX(${x * 8}px) translateY(${-y * 8}px) rotateX(${-y * 2}deg) rotateY(${x * 2}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (startBoxRef.current) {
      startBoxRef.current.style.transform = '';
    }
  }, []);

  useEffect(() => {
    const observerOptions = { threshold: 0.15 };

    const currentStartBoxRef = startBoxRef.current;
    const currentTextDropRef = textDropRef.current;
    const currentAmenitiesBgRef = amenitiesBgRef.current;

    const observers = [
      { ref: currentStartBoxRef, className: 'opacity-100 translate-y-0' },
      { ref: currentTextDropRef, className: 'opacity-100 translate-y-0' },
      { ref: currentAmenitiesBgRef, className: 'opacity-100 translate-y-0' },
    ];

    const observerInstances = observers.map(({ ref, className }) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target) {
            entry.target.classList.add(...className.split(' '));
          }
        });
      }, observerOptions);

      if (ref) observer.observe(ref);
      return observer;
    });

    if (window.matchMedia('(hover: hover)').matches && currentStartBoxRef) {
      currentStartBoxRef.addEventListener('mousemove', handleMouseMove);
      currentStartBoxRef.addEventListener('mouseleave', handleMouseLeave);
    }

    const handleScroll = () => {
      const textDropElement = textDropRef.current;
      if (textDropElement) {
        const rect = textDropElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const sectionTop = rect.top;
        
        const progress = Math.max(0, Math.min(1, (viewportHeight - sectionTop) / (viewportHeight * 0.7)));
        setTextProgress(progress);
        
        // Determine which image should be active based on progress
        const imageIndex = Math.floor(progress * textDropLines.length);
        setActiveImageIndex(Math.min(imageIndex, textDropLines.length - 1));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observerInstances.forEach((observer) => observer.disconnect());
      window.removeEventListener('scroll', handleScroll);
      if (currentStartBoxRef) {
        currentStartBoxRef.removeEventListener('mousemove', handleMouseMove);
        currentStartBoxRef.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf7f5] via-white to-[#f5f0ed]">
      {/* Text Drop Section */}
      <section
        ref={textDropRef}
        className="relative min-h-[120vh] max-w-7xl mx-auto my-16 flex items-center justify-center overflow-hidden px-5 py-20 opacity-0 translate-y-5 transition-all duration-700 ease-out"
      >
        <h2 className="sr-only">Mirai — Elemental Indulgence</h2>

        {/* Background Images Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Main floating images that appear based on text progress */}
          {textDropLines.map((item, idx) => {
            const isActive = idx <= activeImageIndex;
            const lineProgress = Math.max(0, Math.min(1, (textProgress - idx * 0.22) / 0.35));
            
            // Alternate positions for visual interest
            const isLeft = idx % 2 === 0;
            const verticalOffset = idx * 18;
            
            return (
              <div
                key={idx}
                className="absolute transition-all duration-1000 ease-out"
                style={{
                  width: 'clamp(180px, 25vw, 320px)',
                  height: 'clamp(240px, 35vw, 420px)',
                  top: `${10 + verticalOffset}%`,
                  left: isLeft ? 'clamp(2%, 5vw, 8%)' : 'auto',
                  right: isLeft ? 'auto' : 'clamp(2%, 5vw, 8%)',
                  opacity: isActive ? lineProgress * 0.9 : 0,
                  transform: `
                    translateY(${(1 - lineProgress) * 60}px) 
                    translateX(${isLeft ? (1 - lineProgress) * -40 : (1 - lineProgress) * 40}px)
                    scale(${0.85 + lineProgress * 0.15})
                    rotate(${isLeft ? -2 + lineProgress * 2 : 2 - lineProgress * 2}deg)
                  `,
                  zIndex: idx + 1,
                }}
              >
                {/* Image Container with elegant frame */}
                <div 
                  className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    boxShadow: isActive 
                      ? '0 25px 50px -12px rgba(107, 44, 62, 0.25), 0 0 0 1px rgba(107, 44, 62, 0.05)'
                      : 'none',
                  }}
                >
                  {/* Gradient overlay for depth */}
                  <div 
                    className="absolute inset-0 z-10 transition-opacity duration-700"
                    style={{
                      background: isLeft 
                        ? 'linear-gradient(135deg, rgba(107, 44, 62, 0.1) 0%, transparent 60%)'
                        : 'linear-gradient(-135deg, rgba(107, 44, 62, 0.1) 0%, transparent 60%)',
                      opacity: lineProgress,
                    }}
                  />
                  
                  {/* The actual image */}
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out"
                    style={{
                      transform: `scale(${1 + (1 - lineProgress) * 0.1})`,
                      filter: `brightness(${0.95 + lineProgress * 0.05})`,
                    }}
                    loading="lazy"
                  />
                  
                  {/* Subtle border glow */}
                  <div 
                    className="absolute inset-0 rounded-2xl transition-opacity duration-700"
                    style={{
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)',
                      opacity: lineProgress,
                    }}
                  />
                </div>
                
                {/* Decorative element */}
                <div 
                  className="absolute -z-10 rounded-2xl transition-all duration-700"
                  style={{
                    top: isLeft ? '-8px' : '8px',
                    left: isLeft ? '8px' : '-8px',
                    right: isLeft ? '-8px' : '8px',
                    bottom: isLeft ? '8px' : '-8px',
                    border: '1px solid rgba(107, 44, 62, 0.15)',
                    opacity: lineProgress * 0.6,
                    transform: `rotate(${isLeft ? 1 : -1}deg)`,
                  }}
                />
              </div>
            );
          })}
          
          {/* Additional ambient floating images */}
          {floatingImages.map((img, idx) => {
            const floatProgress = Math.max(0, Math.min(1, (textProgress - 0.1 - idx * 0.15) / 0.4));
            const isLeft = img.position === 'left';
            
            return (
              <div
                key={`float-${idx}`}
                className="absolute hidden lg:block transition-all duration-1200 ease-out"
                style={{
                  width: 'clamp(100px, 12vw, 160px)',
                  height: 'clamp(120px, 15vw, 200px)',
                  top: `${25 + idx * 20}%`,
                  left: isLeft ? 'clamp(0%, 2vw, 3%)' : 'auto',
                  right: isLeft ? 'auto' : 'clamp(0%, 2vw, 3%)',
                  opacity: floatProgress * 0.5,
                  transform: `
                    translateY(${(1 - floatProgress) * 80}px)
                    rotate(${isLeft ? 3 : -3}deg)
                  `,
                  zIndex: 0,
                }}
              >
                <div className="w-full h-full rounded-xl overflow-hidden opacity-60">
                  <img
                    src={img.src}
                    alt=""
                    className="w-full h-full object-cover grayscale"
                    style={{
                      filter: `grayscale(70%) brightness(1.1)`,
                    }}
                    loading="lazy"
                  />
                </div>
              </div>
            );
          })}
          
          {/* Ambient gradient orbs */}
          <div 
            className="absolute w-[600px] h-[600px] rounded-full blur-3xl transition-all duration-1000"
            style={{
              background: 'radial-gradient(circle, rgba(107, 44, 62, 0.08) 0%, transparent 70%)',
              top: '10%',
              left: '-10%',
              opacity: textProgress * 0.8,
              transform: `scale(${0.8 + textProgress * 0.4})`,
            }}
          />
          <div 
            className="absolute w-[500px] h-[500px] rounded-full blur-3xl transition-all duration-1000"
            style={{
              background: 'radial-gradient(circle, rgba(180, 120, 100, 0.06) 0%, transparent 70%)',
              bottom: '5%',
              right: '-5%',
              opacity: textProgress * 0.6,
              transform: `scale(${0.7 + textProgress * 0.5})`,
            }}
          />
        </div>

        {/* Text Lines with unfold effect */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center w-full">
          {textDropLines.map((item, idx) => {
            const lineProgress = Math.max(0, Math.min(1, (textProgress - idx * 0.22) / 0.4));
            const rotateX = (1 - lineProgress) * -90;
            const opacity = lineProgress;
            const translateY = (1 - lineProgress) * 50;

            return (
              <div
                key={idx}
                className="relative mb-4 md:mb-8"
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                }}
              >
                {/* Subtle text shadow/glow for depth */}
                <div 
                  className="absolute inset-0 blur-xl transition-opacity duration-700"
                  style={{
                    background: `radial-gradient(ellipse at center, rgba(107, 44, 62, 0.15) 0%, transparent 70%)`,
                    opacity: lineProgress * 0.5,
                    transform: 'scale(1.5)',
                  }}
                />
                
                {/* Text with unfold animation */}
                <div 
                  className="relative z-10 text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-none tracking-tight px-4"
                  style={{
                    transform: `perspective(1000px) rotateX(${rotateX}deg) translateY(${translateY}px)`,
                    transformOrigin: 'center top',
                    opacity: opacity,
                    transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    color: '#6B2C3E',
                    textShadow: lineProgress > 0.5 
                      ? '0 4px 30px rgba(107, 44, 62, 0.2), 0 2px 10px rgba(107, 44, 62, 0.1)'
                      : 'none',
                    fontFamily: '"Playfair Display", Georgia, serif',
                  }}
                >
                  {item.text}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500"
          style={{ opacity: textProgress < 0.3 ? 1 - textProgress * 3 : 0 }}
        >
          <span className="text-xs tracking-[0.3em] text-[#6B2C3E]/50 uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#6B2C3E]/30 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Add font import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
      `}</style>
    </div>
  );
}