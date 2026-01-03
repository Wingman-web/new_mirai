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
      { name: '350-Seater Multipurpose Hall', image: '/images/image_controller/BANQUATE HALL.png' },
      { name: 'Pre-Function Hall', image: 'https://images.unsplash.com/photo-1767337264371-13af71aa7bf7?w=1600&q=80&auto=format' },
      { name: 'Dance Studio', image: 'https://images.unsplash.com/photo-1767337264862-44fe578e16bd?w=1600&q=80&auto=format' },
      { name: 'Creche', image: 'https://images.unsplash.com/photo-1767337171304-9a206edf28b3?w=1600&q=80&auto=format' },
      { name: 'Virtual Cricket', image: 'https://images.unsplash.com/photo-1767337264375-369be20eb266?w=1600&q=80&auto=format' },
      { name: 'Virtual Golf', image: 'https://images.unsplash.com/photo-1767337264219-05e802db7c0b?w=1600&q=80&auto=format' },
      { name: 'Kids Activity Rooms', image: '/images/image_controller/Kids_plyaing_area.png' }
    ]
  },
  {
    level: 'Level 2',
    defaultImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80',
    amenities: [
      { name: '50-Seater Private Theatre', image: 'https://images.unsplash.com/photo-1767338692158-5dd559d1f432?w=1600&q=80&auto=format' },
      { name: 'Billiards & Snooker', image: 'https://images.unsplash.com/photo-1767338526030-a5c9ba27245a?w=1600&q=80&auto=format' },
      { name: 'Guest Rooms', image: 'https://images.unsplash.com/photo-1767339112497-de66b10afed3?w=1600&q=80&auto=format' },
      { name: 'Spa', image: '/images/image_controller/level2-four.jpg' },
      { name: 'Mini Sports Lounge', image: 'https://images.unsplash.com/photo-1767437854729-51a8f050e579?w=1600&q=80&auto=format&fit=crop' },
      { name: 'Cigar Room', image: '/images/image_controller/Cigar Room.png' }
    ]
  }, 
  {
    level: 'Level 3',
    defaultImage: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1600&q=80',
    amenities: [
      { name: 'Half Olympic Pool', image: '/images/image_controller/Podium Pool.jpg' },
      { name: 'TT Room', image: 'https://images.unsplash.com/photo-1767344464272-17e1c657f8bf?w=1600&q=80&auto=format' },
      { name: 'Coworking Space', image: '/images/image_controller/coworking space.jpg' },
      { name: 'Squash Court', image: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/level3-five.png' },
      { name: 'Badminton Courts', image: 'https://images.unsplash.com/photo-1767437854156-9afa48aeba89?w=1600&q=80&auto=format&fit=crop' },
      { name: 'Conference Arena', image: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/office-room.jpg' }
    ]
  },
  {
    level: 'Level 4',
    defaultImage: 'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=1600&q=80',
    amenities: [
      { name: 'Yoga & Meditation Deck', image: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/clubhouse_meditation.png' },
      { name: 'Gym & Fitness Corner', image: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/clubhouse_gym.png' }
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

  useEffect(() => {
    const allImages = [
      '/clubhouse.png',
      ...levels.flatMap(level => [level.defaultImage, ...level.amenities.map(a => a.image)])
    ];
    
    allImages.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });

    if (bgLayer1Ref.current) {
      gsap.set(bgLayer1Ref.current, { opacity: 0 });
    }
    if (bgLayer2Ref.current) {
      gsap.set(bgLayer2Ref.current, { opacity: 0 });
    }

    levelPanelsRef.current.forEach(panel => {
      if (panel) {
        gsap.set(panel, { 
          yPercent: 100,
          opacity: 1
        });
      }
    });
  }, []);

  const changeBackground = useCallback((newImage: string) => {
    if (newImage === currentImageRef.current) return;
    
    currentImageRef.current = newImage;
    
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const incomingLayer = activeLayerRef.current === 1 ? bgLayer2Ref.current : bgLayer1Ref.current;
    const outgoingLayer = activeLayerRef.current === 1 ? bgLayer1Ref.current : bgLayer2Ref.current;

    if (!incomingLayer || !outgoingLayer) return;

    incomingLayer.style.backgroundImage = `url('${newImage}')`;
    
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
      }, '<')
      .set(outgoingLayer, { 
        scale: 1,
        zIndex: 1 
      });

    activeLayerRef.current = activeLayerRef.current === 1 ? 2 : 1;
  }, []);

  // Hide all panels
  const hideAllPanels = useCallback(() => {
    levelPanelsRef.current.forEach((panel) => {
      if (panel) {
        gsap.killTweensOf(panel);
        gsap.to(panel, {
          yPercent: 100,
          duration: 0.4,
          ease: 'power2.in'
        });
      }
    });
  }, []);

  // Show specific panel and hide others
  const showPanel = useCallback((levelIndex: number) => {
    levelPanelsRef.current.forEach((panel, index) => {
      if (panel) {
        gsap.killTweensOf(panel);
        if (index === levelIndex) {
          gsap.to(panel, {
            yPercent: 0,
            duration: 0.5,
            ease: 'power3.out'
          });
        } else {
          gsap.to(panel, {
            yPercent: 100,
            duration: 0.3,
            ease: 'power2.in'
          });
        }
      }
    });
    changeBackground(levels[levelIndex].defaultImage);
    setActiveLevel(levelIndex);
  }, [changeBackground]);

  const handleAmenityHover = (image: string) => {
    changeBackground(image);
  };

  const handleGlobalLeave = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    
    currentImageRef.current = '/clubhouse.png';
    
    const layer1 = bgLayer1Ref.current;
    const layer2 = bgLayer2Ref.current;
    
    if (layer1 && layer2) {
      gsap.to([layer1, layer2], {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
      activeLayerRef.current = 1;
    }
    
    setActiveLevel(null);
    hideAllPanels();
  };

  return (
    <section 
      className="relative bg-black w-full h-screen overflow-hidden"
      onMouseLeave={handleGlobalLeave}
    >
      {/* Permanent default background */}
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

      {/* Decorative shape - Always visible */}
      <div className="absolute inset-0 pointer-events-none z-[50] overflow-hidden">
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

      {/* Main Interactive Grid */}
      <div className="absolute inset-0 z-[10] grid grid-cols-4" style={{ bottom: '60px' }}>
        {levels.map((level, levelIndex) => (
          <div
            key={levelIndex}
            className={`relative h-full ${levelIndex < 3 ? 'border-r border-gray-700/30' : ''}`}
          >
            {/* Upper Zone - Hides panel when hovered */}
            <div 
              className="absolute top-0 left-0 w-full h-[50%]"
              onMouseEnter={() => {
                hideAllPanels();
                changeBackground(levels[levelIndex].defaultImage);
                setActiveLevel(levelIndex);
              }}
            />
            
            {/* Lower Zone - Shows panel when hovered */}
            <div 
              className="absolute bottom-0 left-0 w-full h-[50%]"
              onMouseEnter={() => showPanel(levelIndex)}
            />

            {/* Amenity Panel - slides up/down */}
            <div
              ref={el => { levelPanelsRef.current[levelIndex] = el; }}
              className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/95 via-black/80 to-transparent text-white px-6 md:px-8 py-8 pointer-events-none"
            >
              <div className="space-y-3 pointer-events-auto">
                {level.amenities.map((amenity, idx) => (
                  <p key={idx} className="text-[14px] md:text-[15px] leading-relaxed">
                    <span
                      className="inline-block cursor-pointer text-white/90 hover:text-white border-b border-transparent hover:border-white/40 pb-0.5 transition-all duration-300 ease-out"
                      onMouseEnter={() => handleAmenityHover(amenity.image)}
                    >
                      {amenity.name}
                    </span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Level Buttons at Bottom - Always Visible */}
      <div className="absolute bottom-0 left-0 right-0 z-[25] grid grid-cols-4">
        {levels.map((level, levelIndex) => (
          <button
            key={levelIndex}
            className={`
              py-6 px-4 text-center cursor-pointer transition-all duration-300
              ${levelIndex < 3 ? 'border-r border-white/20' : ''}
              ${activeLevel === levelIndex 
                ? 'bg-white/20 backdrop-blur-sm' 
                : 'bg-black/60 hover:bg-black/80 backdrop-blur-sm'
              }
            `}
            onMouseEnter={() => showPanel(levelIndex)}
          >
            <h2 
              className="text-sm md:text-base font-bold tracking-[0.2em] uppercase text-white"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
            >
              {level.level}
            </h2>
          </button>
        ))}
      </div>
    </section>
  );
}