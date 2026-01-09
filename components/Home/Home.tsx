'use client';

import React, { useEffect, useState } from 'react'
import VideoPreloader from './Preloader/Preloader'
import Hero from './Hero/Hero'
import { RevealZoom } from './Gateway/Gateway' 
import Mirai_Grace from './Mirai_Grace/Mirai_Grace'
import MiraiPodsIntro from './4_Pods/4_pods'
import MiraiPodsSlider from './Mirai_Pods_Slider/Pods_Slider'
import ClubhouseIntro from './4_Level_Clubhouse/4_Level_Clubhouse'
import MiraiClubhouse from './ClubeHouse_Img_controller/ClubeHouse_Controller'
import InteractiveMap from './Interative_Map/Interative_Map'
import ContactForm from './Contact_us/Contact_us'
import Footer from './Footer/Footer'
import SixthElement from './Sixth_Element/Sixth_element'

const Home = () => {
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);

  useEffect(() => {
    // Check if preloader was already shown
    const hasSeenPreloader = sessionStorage.getItem('preloaderShown');
    
    if (hasSeenPreloader) {
      setIsPreloaderComplete(true);
    } else {
      // Disable scrolling during preloader
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    return () => {
      // Cleanup: re-enable scrolling when component unmounts
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handlePreloaderComplete = () => {
    setIsPreloaderComplete(true);
    // Re-enable scrolling immediately after preloader ends
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  };

  return (
    <>
      {/* Video Preloader - highest z-index */}
      <VideoPreloader onComplete={handlePreloaderComplete} />
      
      <div 
        className="relative bg-black w-full overflow-x-hidden"
        style={{
          // Ensure content is visible and scrollable after preloader
          minHeight: '100vh',
          opacity: isPreloaderComplete ? 1 : 0,
          transition: 'opacity 0.3s ease-in'
        }}
      >
        <div className="relative z-10 bg-black">
          <Hero />
          
          {/* Spacer for Hero */}
          <div className="h-screen" aria-hidden="true" />
          
          {/* SixthElement - Using z-index 10 */}
          <div className="relative" style={{ zIndex: 10 }}>
            <SixthElement />
          </div>
          
          {/* RevealZoom - Using z-index 11 (next in line) */}
          <section 
            aria-label="Reveal zoom" 
            className="relative bg-black"
            style={{ zIndex: 11, isolation: 'isolate' }}
          >
            <RevealZoom />
          </section>
          
          {/* Following sections continue the ladder */}
          <section 
            aria-label="Scroll video" 
            className="relative bg-black"
            style={{ zIndex: 12 }}
          >
            <Mirai_Grace />
          </section>
          
          <div style={{ position: 'relative', zIndex: 13 }}>
            <MiraiPodsIntro />
            <MiraiPodsSlider />
            <ClubhouseIntro />
            <MiraiClubhouse />
            <InteractiveMap />
          </div>
        </div>
        {/* Fixed UI layers remain at the bottom/top of the stack */}
        <ContactForm />
        <div className="relative h-screen" style={{ zIndex: 0 }} />
        <Footer />
      </div>
    </>
  )
}

export default Home
