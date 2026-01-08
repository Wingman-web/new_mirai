'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselItem {
  src: string;
  alt: string;
  caption: string;
}

interface TabData {
  title: string;
  description: string;
  items: CarouselItem[];
}

const tabsData: TabData[] = [
  {
    title: 'Podium',
    description:
      'Even the spaces below your residence offer an enriching living experience with its generous spread of podium-level amenities that energise residents on a dull day by becoming a whole world in itself. From the gapeworthy Sculpture Park to the Rock Climbing Wall, these eclectic amenities contain a little bit for everyone.',
    items: [
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/reading-Zone.jpg',
        alt: 'Reading Room',
        caption: 'Reading Room',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/playzone.png',
        alt: "Kid's Play Area",
        caption: "Kid's Play Area",
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/lobby.jpg',
        alt: 'Lobby',
        caption: 'Lobby',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/pickleballcourt.png',
        alt: 'Pickleball Court',
        caption: 'Pickleball Court',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/tennius-court.jpg',
        alt: 'Multipurpose Court',
        caption: 'Multipurpose Court',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/criket-net.jpg',
        alt: 'Cricket Nets',
        caption: 'Cricket Nets',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/scating.jpg',
        alt: 'Skating Rink',
        caption: 'Skating Rink',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/petpark.png',
        alt: 'Pet Park',
        caption: 'Pet Park',
      },
    ],
  },
  {
    title: 'Clubhouse',
    description:
      "At the Mirai Clubhouse, there is an invigorating mix of adrenaline and breathing room that's spread across its 4 dynamic levels. This destination is the ideal confluence of sports & leisure where friendships are forged and good times are immortalised.",
    items: [
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/level1-one.png',
        alt: '350-seater Multipurpose Hall',
        caption: '350-seater Multipurpose Hall',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/clubhouse_pre_function.png',
        alt: 'Pre-function Hall',
        caption: 'Pre-function Hall',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/level1-three.png',
        alt: 'Dance Studio',
        caption: 'Dance Studio',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/clubhouse_creche.png',
        alt: 'Creche',
        caption: 'Creche',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/clubhouse_vitual_cricket.png',
        alt: 'Virtual Cricket',
        caption: 'Virtual Cricket',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/level1-seven.png',
        alt: 'Virtual Golf',
        caption: 'Virtual Golf',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/playzone.png',
        alt: "Kids' Activity Room",
        caption: "Kids' Activity Room",
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/home-theater.jpg',
        alt: '50-Seater Private Theatre',
        caption: '50-Seater Private Theatre',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/level2-two.png',
        alt: 'Billiards & Snooker',
        caption: 'Billiards & Snooker',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/clubhouse_guest_room.png',
        alt: 'Guest Rooms',
        caption: 'Guest Rooms',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/level2-four.jpg',
        alt: 'Spa',
        caption: 'Spa',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/sports-bar.jpg',
        alt: 'Mini Sports Lounge',
        caption: 'Mini Sports Lounge',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/cardsroom.jpg',
        alt: 'Cigar Room',
        caption: 'Cigar Room',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/level3-one.jpg',
        alt: 'Half-Olympic Pool',
        caption: 'Half-Olympic Pool',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/level3-two.jpg',
        alt: 'TT Room',
        caption: 'TT Room',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/level3-four.jpg',
        alt: 'Co-working Space',
        caption: 'Co-working Space',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/level3-five.png',
        alt: 'Squash Court',
        caption: 'Squash Court',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/level3-six.png',
        alt: 'Badminton Courts',
        caption: 'Badminton Courts',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/office-room.jpg',
        alt: 'Conference Arena',
        caption: 'Conference Arena',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/clubhouse_meditation.png',
        alt: 'Yoga & Meditation Deck',
        caption: 'Yoga & Meditation Deck',
      },
      {
        src: 'https://pavanimirai.com/55storeys-luxury-apartments-in-financial-district/media/clubhouse_gym.png',
        alt: 'Gym & Fitness Corner',
        caption: 'Gym & Fitness Corner',
      },
    ],
  },
];

const Carousel = ({
  items,
  currentIndex,
  onNext,
  onPrev,
}: {
  items: CarouselItem[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}) => {
  return (
    <div className="relative w-full h-[550px] mb-10 rounded-2xl flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        {items.map((item, index) => {
          const offset = (index - currentIndex + items.length) % items.length;
          const isActive = offset === 0;
          const isVisible = offset < 3;

          if (!isVisible) return null;

          // Calculate positions that keep images fully visible
          // Center image: 50% (centered)
          // Right image: 83% (positioned to the right with good spacing)
          // Left image: 17% (positioned to the left with good spacing)
          let position = 'left-1/2 -translate-x-1/2';
          let width = 'w-[45%]';
          let zIndex = 'z-30';
          let opacity = 'opacity-100';
          let scale = 'scale-100';

          if (!isActive) {
            // Right Side Image - Positioned at 83% for more separation
            if (offset === 1) {
              position = 'left-[83%] -translate-x-1/2'; 
              width = 'w-[25%]';
              zIndex = 'z-20';
              opacity = 'opacity-70';
              scale = 'scale-90';
            } 
            // Left Side Image - Positioned at 17% for more separation
            else if (offset === 2) {
              position = 'left-[17%] -translate-x-1/2';
              width = 'w-[25%]';
              zIndex = 'z-10';
              opacity = 'opacity-50';
              scale = 'scale-[0.85]';
            }
          }

          return (
            <div
              key={index}
              className={`absolute top-1/2 -translate-y-1/2 h-[80%] ${width} ${position} ${zIndex} ${opacity} ${scale} transition-all duration-700 ease-in-out rounded-xl overflow-hidden shadow-lg`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 50vw"
                  priority={isActive}
                />
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-2 rounded-md text-sm tracking-widest font-light z-10">
                  {item.caption}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        <button
          onClick={onPrev}
          className="bg-[#78252F] text-white p-3 rounded-md hover:bg-[#5a1c24] transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onNext}
          className="bg-[#78252F] text-white p-3 rounded-md hover:bg-[#5a1c24] transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default function AmenitiesCarousel() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % tabsData[activeTab].items.length);
  }, [activeTab]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + tabsData[activeTab].items.length) %
        tabsData[activeTab].items.length
    );
  }, [activeTab]);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(handleNext, 4000);
    return () => clearInterval(interval);
  }, [handleNext]);

  // Reset index when tab changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  return (
    <section className="pt-8 lg:pt-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center py-12">
          {/* Tabs */}
          <div className="flex justify-center gap-12 lg:gap-24 mb-8 flex-wrap relative z-50">
            {tabsData.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`text-3xl font-light transition-all duration-300 pb-2 border-b-2 ${
                  activeTab === index
                    ? 'text-[#78252F] border-[#78252F]'
                    : 'text-gray-400 border-gray-300'
                }`}
                style={{ fontFamily: 'Migra, sans-serif' }}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="w-full mx-auto mb-8">
            <p className="text-lg leading-relaxed font-medium text-gray-700" style={{ paddingLeft: '0.5%', paddingRight: '0.5%', textAlign: 'justify' }}>
              {tabsData[activeTab].description}
            </p>
          </div>

          {/* Carousel */}
          <div className="w-full">
            <Carousel
              items={tabsData[activeTab].items}
              currentIndex={currentIndex}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
