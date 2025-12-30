'use client';

import { useEffect, useRef, useState } from 'react';

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
  { text: 'Indulgence', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80' },
  { text: 'That Helps', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80' },
  { text: 'You to Stay in', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80' },
  { text: 'Your Element', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80' },
];

export default function MiraiAmenitiesShowcase() {
  const startBoxRef = useRef<HTMLDivElement>(null);
  const textDropRef = useRef<HTMLElement>(null);
  const amenitiesBgRef = useRef<HTMLElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [textProgress, setTextProgress] = useState(0);

  // Random background images from Unsplash
  const backgroundImages = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
  ];

  useEffect(() => {
    // Intersection Observers for all sections
    const observerOptions = { threshold: 0.15 };

    const observers = [
      { ref: startBoxRef, className: 'opacity-100 translate-y-0' },
      { ref: textDropRef, className: 'opacity-100 translate-y-0' },
      { ref: amenitiesBgRef, className: 'opacity-100 translate-y-0' },
    ];

    const observerInstances = observers.map(({ ref, className }) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && ref.current) {
            ref.current.className += ` ${className}`;
          }
        });
      }, observerOptions);

      if (ref.current) observer.observe(ref.current);
      return observer;
    });

    // Mouse parallax for start box
    const handleMouseMove = (e: MouseEvent) => {
      if (!startBoxRef.current) return;
      const rect = startBoxRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      startBoxRef.current.style.transform = `translateX(${x * 8}px) translateY(${-y * 8}px) rotateX(${-y * 2}deg) rotateY(${x * 2}deg)`;
    };

    const handleMouseLeave = () => {
      if (startBoxRef.current) {
        startBoxRef.current.style.transform = '';
      }
    };

    if (window.matchMedia('(hover: hover)').matches && startBoxRef.current) {
      startBoxRef.current.addEventListener('mousemove', handleMouseMove);
      startBoxRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    // Scroll handling for text drop
    const handleScroll = () => {
      setScrollOffset(window.scrollY);
      
      // Calculate text unfold progress based on text drop section position
      if (textDropRef.current) {
        const rect = textDropRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const sectionTop = rect.top;
        
        // Calculate progress: 0 when section enters viewport, 1 when it reaches center
        const progress = Math.max(0, Math.min(1, (viewportHeight - sectionTop) / (viewportHeight * 0.7)));
        setTextProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observerInstances.forEach((observer) => observer.disconnect());
      window.removeEventListener('scroll', handleScroll);
      if (startBoxRef.current) {
        startBoxRef.current.removeEventListener('mousemove', handleMouseMove);
        startBoxRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Background Image */}
      <div className="fixed inset-0 opacity-5 z-0">
        <img
          src={backgroundImages[0]}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>



      {/* Text Drop Section with Images in Random Places */}
      <section
        ref={textDropRef}
        className="relative min-h-[80vh] max-w-7xl mx-auto my-16 flex items-center justify-center overflow-hidden px-5 py-10 opacity-0 translate-y-5 transition-all duration-700 ease-out"
      >
        <h2 className="sr-only">Mirai — Elemental Indulgence</h2>

        {/* Background Images in Random Positions */}
        {textDropLines.map((item, idx) => {
          const lineProgress = Math.max(0, Math.min(1, (textProgress - idx * 0.2) / 0.3));
          const imgOpacity = lineProgress * 0.4;
          
          // Random positions for each image
          const positions = [
            { top: '10%', left: '15%' },
            { top: '40%', right: '10%' },
            { bottom: '25%', left: '8%' },
            { top: '60%', right: '20%' },
          ];
          
          return (
            <div
              key={`img-${idx}`}
              className="absolute w-[180px] h-[120px] md:w-[280px] md:h-[180px] rounded-xl overflow-hidden pointer-events-none"
              style={{
                ...positions[idx],
                opacity: imgOpacity,
                transform: `scale(${0.9 + (lineProgress * 0.1)}) rotate(${idx * 3}deg)`,
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <img
                src={item.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}

        {/* Text Lines with unfold effect */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center w-full">
          {textDropLines.map((item, idx) => {
            // Calculate individual line reveal progress - slower unfold
            const lineProgress = Math.max(0, Math.min(1, (textProgress - idx * 0.25) / 0.5));
            const rotateX = (1 - lineProgress) * -90; // Unfold from top
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
                {/* Text with unfold animation */}
                <div 
                  className="relative z-10 text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-none tracking-tight text-[#6B2C3E] drop-shadow-lg px-4"
                  style={{
                    transform: `perspective(1000px) rotateX(${rotateX}deg) translateY(${translateY}px)`,
                    transformOrigin: 'center top',
                    opacity: opacity,
                    transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {item.text}
                </div>
              </div>
            );
          })}
        </div>
      </section>


    </div>
  );
}