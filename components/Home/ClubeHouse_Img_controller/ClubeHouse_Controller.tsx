'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

const shapeTwoPath = '/images/shape-two-pods.png';

interface Amenity {
  name: string;
  image: string;
}

interface Level {
  level: string;
  defaultImage: string;
  amenities: Amenity[];
}

const levels: Level[] = [
  {
    level: 'Level 1',
    defaultImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
    amenities: [
      { name: '350-Seater Multipurpose Hall', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80' },
      { name: 'Pre-Function Hall', image: 'https://images.unsplash.com/photo-1519167758481-83f29da8dc4d?w=1600&q=80' },
      { name: 'Dance Studio', image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=1600&q=80' },
      { name: 'Creche', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1600&q=80' },
      { name: 'Hobby Rooms', image: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=1600&q=80' },
      { name: 'Virtual Cricket', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1600&q=80' },
      { name: 'Virtual Golf', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1600&q=80' },
      { name: 'Kids Activity Zone', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&q=80' }
    ]
  },
  {
    level: 'Level 2',
    defaultImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80',
    amenities: [
      { name: '50-Seater Private Theatre', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&q=80' },
      { name: 'Billiards & Snooker', image: 'https://images.unsplash.com/photo-1604163514098-c6a1c0f3c8e4?w=1600&q=80' },
      { name: 'Guest Rooms', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1600&q=80' },
      { name: 'Spa', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600&q=80' },
      { name: 'Business & Social Lounge', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&q=80' },
      { name: 'Study Center', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80' },
      { name: 'Sports Lounge', image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1600&q=80' },
      { name: 'Cards Room', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1600&q=80' }
    ]
  },
  {
    level: 'Level 3',
    defaultImage: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1600&q=80',
    amenities: [
      { name: 'Pool', image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1600&q=80' },
      { name: 'TT Room', image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=1600&q=80' },
      { name: 'Board Games', image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=1600&q=80' },
      { name: 'Coworking Space', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&q=80' },
      { name: 'Squash Court', image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1600&q=80' },
      { name: 'Badminton Courts', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1600&q=80' },
      { name: 'Cards Lounge', image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=1600&q=80' },
      { name: 'Conference Arena', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1600&q=80' }
    ]
  },
  {
    level: 'Level 4',
    defaultImage: 'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=1600&q=80',
    amenities: [
      { name: 'Aerobics Studio', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&q=80' },
      { name: 'Yoga Studio', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&q=80' },
      { name: 'Meditation Deck', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&q=80' },
      { name: 'Gym & Fitness Corner', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80' }
    ]
  }
];

export default function MiraiClubhouse() {
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  
  const bgLayer1Ref = useRef<HTMLDivElement>(null);
  const bgLayer2Ref = useRef<HTMLDivElement>(null);
  const levelPanelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const activeLayerRef = useRef<1 | 2>(1);
  const currentImageRef = useRef<string>('/clubhouse.png');
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Preload images for smoother transitions
  useEffect(() => {
    const allImages = [
      '/clubhouse.png',
      ...levels.flatMap(level => [level.defaultImage, ...level.amenities.map(a => a.image)])
    ];
    
    // Preload all images in background
    allImages.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });

    // Initialize both transition layers as hidden (default bg shows through)
    if (bgLayer1Ref.current) {
      gsap.set(bgLayer1Ref.current, { opacity: 0 });
    }
    if (bgLayer2Ref.current) {
      gsap.set(bgLayer2Ref.current, { opacity: 0 });
    }
  }, []);

  const changeBackground = useCallback((newImage: string) => {
    if (newImage === currentImageRef.current) return;
    
    currentImageRef.current = newImage;
    
    // Kill any existing animation
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const incomingLayer = activeLayerRef.current === 1 ? bgLayer2Ref.current : bgLayer1Ref.current;
    const outgoingLayer = activeLayerRef.current === 1 ? bgLayer1Ref.current : bgLayer2Ref.current;

    if (!incomingLayer || !outgoingLayer) return;

    // Set new image on incoming layer (while it's still invisible)
    incomingLayer.style.backgroundImage = `url('${newImage}')`;
    
    // Create timeline for smooth crossfade
    timelineRef.current = gsap.timeline();
    
    timelineRef.current
      .set(incomingLayer, { 
        opacity: 0,
        scale: 1.02,
        zIndex: 3 
      })
      .set(outgoingLayer, { 
        zIndex: 2 
      })
      .to(incomingLayer, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power2.inOut',
      })
      .to(outgoingLayer, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      }, '<') // Start at same time
      .set(outgoingLayer, { 
        scale: 1,
        zIndex: 1 
      });

    // Toggle active layer
    activeLayerRef.current = activeLayerRef.current === 1 ? 2 : 1;
  }, []);

  const handleLevelEnter = (levelIndex: number) => {
    changeBackground(levels[levelIndex].defaultImage);
    setActiveLevel(levelIndex);
    
    // Animate level panel in
    const panel = levelPanelsRef.current[levelIndex];
    if (panel) {
      gsap.killTweensOf(panel);
      gsap.to(panel, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power3.out'
      });
    }
  };

  const handleLevelLeave = (levelIndex: number) => {
    // Animate level panel out
    const panel = levelPanelsRef.current[levelIndex];
    if (panel) {
      gsap.killTweensOf(panel);
      gsap.to(panel, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: 'power2.in'
      });
    }
  };

  const handleAmenityHover = (image: string, levelIndex: number) => {
    changeBackground(image);
    setActiveLevel(levelIndex);
  };

  const handleGlobalLeave = () => {
    // Kill any existing animation
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    
    currentImageRef.current = '/clubhouse.png';
    
    const layer1 = bgLayer1Ref.current;
    const layer2 = bgLayer2Ref.current;
    
    // Simply hide both transition layers - default bg is always visible underneath
    if (layer1 && layer2) {
      gsap.to([layer1, layer2], {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
      activeLayerRef.current = 1;
    }
    
    setActiveLevel(null);
    
    // Animate all panels out
    levelPanelsRef.current.forEach(panel => {
      if (panel) {
        gsap.killTweensOf(panel);
        gsap.to(panel, {
          opacity: 0,
          y: 20,
          duration: 0.3,
          ease: 'power2.in'
        });
      }
    });
  };

  return (
    <section className="relative bg-black w-full h-screen overflow-hidden">
      <div className="w-full h-full px-0 relative z-10">
        <div 
          className="relative grid grid-cols-1 lg:grid-cols-4 h-full"
          onMouseLeave={handleGlobalLeave}
        >
          {/* Permanent default background - always visible underneath */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ zIndex: 0, backgroundImage: `url('/clubhouse.png')` }}
          />

          {/* Background layer 1 - for transitions */}
          <div 
            ref={bgLayer1Ref}
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{ zIndex: 1 }}
          />
          
          {/* Background layer 2 - for transitions */}
          <div 
            ref={bgLayer2Ref}
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{ zIndex: 1 }}
          />

          {/* Decorative shape */}
          <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
            <div className="absolute right-[-20%] -top-2 w-[160vw] md:w-[150vw] lg:w-[140vw]">
              <Image
                src={shapeTwoPath}
                alt="Background shape"
                width={7200}
                height={5400}
                unoptimized
                className="w-full h-auto"
                priority
              />
            </div>
          </div>

          {levels.map((level, levelIndex) => (
            <div
              key={levelIndex}
              className={`relative h-full z-[3] ${levelIndex < 3 ? 'lg:border-r border-gray-700' : ''}`}
              onMouseEnter={() => handleLevelEnter(levelIndex)}
              onMouseLeave={() => handleLevelLeave(levelIndex)}
            >
              <div className="flex items-end h-full">
                <div
                  ref={el => { levelPanelsRef.current[levelIndex] = el; }}
                  className="absolute left-0 w-full bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white px-8 py-8 pointer-events-auto backdrop-blur-[2px]"
                  style={{ 
                    opacity: 0, 
                    transform: 'translateY(20px)' 
                  }}
                >
                  <h2 className="text-xs font-medium tracking-[0.3em] uppercase text-white/70 mb-4">
                    {level.level}
                  </h2>
                  <div className="space-y-3">
                    {level.amenities.map((amenity, idx) => (
                      <p key={idx} className="text-[15px] leading-relaxed">
                        <span
                          className="inline-block cursor-pointer text-white/90 hover:text-white border-b border-transparent hover:border-white/40 pb-0.5 transition-all duration-300 ease-out"
                          onMouseEnter={() => handleAmenityHover(amenity.image, levelIndex)}
                        >
                          {amenity.name}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}