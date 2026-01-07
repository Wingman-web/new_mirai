'use client'
import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'

const HERO_LOGO = '/images/logo_1.png'

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  // Hide hero when scrolled past hero section OR when near the bottom
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const scrollHeight = document.documentElement.scrollHeight
      const distanceFromBottom = scrollHeight - (scrollY + windowHeight)
      
      const pastHeroSection = scrollY >= windowHeight - 5
      const nearBottom = distanceFromBottom < 200
      
      setIsHidden(pastHeroSection || nearBottom)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fullScreenMediaStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '101%',
    height: '101%',
    transform: 'translate(-50%, -50%) translateZ(0)',
    objectFit: 'cover',
    display: 'block',
    zIndex: 1,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    willChange: 'transform'
  }

  return (
    <section 
      className="fixed top-0 left-0 w-full h-screen overflow-hidden bg-black transition-opacity duration-300"
      style={{ 
        zIndex: 5,
        opacity: isHidden ? 0 : 1,
        visibility: isHidden ? 'hidden' : 'visible',
        pointerEvents: isHidden ? 'none' : 'auto'
      }}
    >
      {/* Logo - top center with full-width lines */}
      <div className="absolute top-8 left-0 right-0 z-10 flex items-center px-8">
        <div className="flex-1 h-[1px] bg-white/60"></div>
        <div className="mx-6">
          <Image
            src={HERO_LOGO}
            alt="Logo"
            width={200}
            height={80}
            priority
          />
        </div>
        <div className="flex-1 h-[1px] bg-white/60"></div>
      </div>

      {/* Loading placeholder - shows while video loads */}
      {!videoReady && (
        <div 
          className="absolute inset-0 bg-black z-0"
          style={{
            backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)'
          }}
        />
      )}

      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          ...fullScreenMediaStyle,
          opacity: videoReady ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
        onCanPlayThrough={() => setVideoReady(true)}
        onLoadedData={() => setVideoReady(true)}
      >
        <source 
          src="https://d3p1hokpi6aqc3.cloudfront.net/mirai_home_1.mp4" 
          type="video/mp4" 
        />
      </video>
    </section>
  )
}

export default Hero
