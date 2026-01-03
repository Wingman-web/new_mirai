"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { StaticImageData } from 'next/image';

// ============================================
// Hotspot Component
// ============================================
interface HotspotProps {
  title: string;
  subtitle: string;
  description: string;
  position: 'left' | 'right';
  hideIconOnOpen?: boolean;
}

function Hotspot({ title, subtitle, description, position, hideIconOnOpen = false }: HotspotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldHideIcon = isHovered && hideIconOnOpen;

  return (
    <div 
      className={`flex items-center ${position === 'right' ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="relative z-20 flex items-center justify-center w-14 h-14 rounded-full cursor-pointer transition-all duration-500 ease-out shrink-0"
        style={{
          backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
          border: '1.5px solid rgba(255, 255, 255, 0.5)',
          boxShadow: isHovered ? '0 0 30px rgba(255,255,255,0.2)' : '0 0 20px rgba(0,0,0,0.5)',
          opacity: (position === 'right' && isHovered) || shouldHideIcon ? 0 : 1,
          pointerEvents: (position === 'right' && isHovered) || shouldHideIcon ? 'none' : 'auto',
          transform: (position === 'right' && isHovered) || shouldHideIcon ? 'translateX(8px) scale(0.92)' : 'none',
        }}
      >
        <svg 
          width="22" 
          height="22" 
          viewBox="0 0 24 24" 
          fill="none"
          className="transition-transform duration-500"
          style={{ transform: isHovered ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      
      <div 
        className={`flex flex-col justify-center transition-all duration-300 ${position === 'left' ? 'ml-4' : 'mr-4'}`}
        style={{
          opacity: isHovered ? 0 : 1,
          transform: isHovered ? (position === 'left' ? 'translateX(12px)' : 'translateX(-12px)') : 'translateX(0)',
          willChange: 'transform, opacity',
        }}
      >
        <h3 style={{
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: '400',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
        }}>
          {title}
        </h3>
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          marginTop: '2px',
          whiteSpace: 'nowrap',
        }}>
          {subtitle}
        </p>
      </div>
      
      <div 
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxWidth: isHovered ? '400px' : '0px',
          opacity: isHovered ? 1 : 0,
          marginLeft: position === 'left' ? '-15px' : '0',
          marginRight: position === 'right' ? '-15px' : '0',
          paddingLeft: position === 'left' ? '25px' : '0',
          paddingRight: position === 'right' ? '25px' : '0',
          pointerEvents: 'auto',
          willChange: 'max-width, opacity',
        }}
      >
        <div 
          className="py-6 px-7 rounded-xl"
          style={{ 
            minWidth: '300px',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          }}
        >
          <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '400', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>
            {title}
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
            {subtitle}
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '14px', fontWeight: '300', lineHeight: '1.7', letterSpacing: '0.02em' }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Main Zoom Component
// ============================================
interface ZoomRevealProps {
  buildingImage?: string | StaticImageData;
  windowImage?: string | StaticImageData;
  shapeImage?: string | StaticImageData;
  scrollDistance?: string;
  buildingZoomScale?: number;
  windowZoomScale?: number;
  windowMoveDistance?: number;
}

export function RevealZoom({
  buildingImage = '/images/gateway/reveal.png',
  windowImage = '/images/gateway/mirai.png',
  shapeImage = '/images/gateway/shape-two.png',
  scrollDistance = "+=1200%", // Slightly longer for better control
  buildingZoomScale = 16,
  windowZoomScale = 2.5,
  windowMoveDistance = 1,
}: ZoomRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buildingRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pointer1Ref = useRef<HTMLDivElement>(null);
  const pointer2Ref = useRef<HTMLDivElement>(null);
  const pointer3Ref = useRef<HTMLDivElement>(null);
  const pointer4Ref = useRef<HTMLDivElement>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const needsDrawRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isLockedRef = useRef(true);
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const shapeRef = useRef<HTMLImageElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  const animState = useRef({
    scale: 1,
    panY: 0,
    lastScale: -1,
    lastPanY: -1,
  });

  const resolvedBuildingSrc = typeof buildingImage === 'string' ? buildingImage : buildingImage.src;
  const resolvedWindowSrc = typeof windowImage === 'string' ? windowImage : windowImage.src;
  const resolvedShapeSrc = typeof shapeImage === 'string' ? shapeImage : shapeImage.src;

  // Initial Lock Logic
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    isLockedRef.current = true;
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isMounted) return;
    const unlock = () => { isLockedRef.current = false; };
    window.addEventListener('wheel', unlock, { passive: true, once: true });
    window.addEventListener('touchstart', unlock, { passive: true, once: true });
    return () => {
      window.removeEventListener('wheel', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, [isMounted]);

  // Canvas Drawing Logic
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvasCtxRef.current;
    const img = imageRef.current;
    if (!canvas || !ctx || !img || !imageLoaded) return;

    const { scale, panY, lastScale, lastPanY } = animState.current;
    if (Math.abs(scale - lastScale) < 0.0001 && Math.abs(panY - lastPanY) < 0.0001) return;
    
    animState.current.lastScale = scale;
    animState.current.lastPanY = panY;

    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = displayWidth / displayHeight;
    
    let drawWidth: number, drawHeight: number;
    if (imgAspect > canvasAspect) {
      drawHeight = displayHeight * scale;
      drawWidth = drawHeight * imgAspect;
    } else {
      drawWidth = displayWidth * scale;
      drawHeight = drawWidth / imgAspect;
    }

    const drawX = (displayWidth - drawWidth) / 2;
    const extraHeight = drawHeight - displayHeight;
    const drawY = -extraHeight * panY;

    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, drawX, drawY, drawWidth, drawHeight);
  }, [imageLoaded]);

  const scheduleCanvasDraw = useCallback(() => {
    if (needsDrawRef.current) return;
    needsDrawRef.current = true;
    rafIdRef.current = requestAnimationFrame(() => {
      needsDrawRef.current = false;
      drawCanvas();
    });
  }, [drawCanvas]);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      canvasCtxRef.current = ctx;
    }
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    if (!isMounted) return;
    const img = new Image();
    img.onload = () => { imageRef.current = img; setImageLoaded(true); };
    img.src = resolvedWindowSrc;
  }, [resolvedWindowSrc, isMounted]);

  useEffect(() => {
    if (imageLoaded && isMounted) setupCanvas();
  }, [imageLoaded, setupCanvas, isMounted]);

  // ============================================
  // MAIN ANIMATION TIMELINE
  // ============================================
  useEffect(() => {
    if (typeof window === 'undefined' || !imageLoaded || !isMounted) return;

    gsap.registerPlugin(ScrollTrigger);
    if (timelineRef.current) timelineRef.current.kill();

    // Initial States
    gsap.set(shapeRef.current, { opacity: 1 });
    gsap.set(buildingRef.current, { scale: 1, opacity: 1 });
    gsap.set(textRef.current, { opacity: 0, y: 60 });
    gsap.set([pointer1Ref.current, pointer2Ref.current, pointer3Ref.current, pointer4Ref.current], { opacity: 0, scale: 0.8 });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
    timelineRef.current = tl;

    // 1. QUICK SHAPE FADE (Disappears early)
    tl.to(shapeRef.current, {
      opacity: 0,
      duration: 1.5,
      ease: "power2.out"
    }, 0);

    // 2. CINEMATIC BUILDING ZOOM
    tl.to(buildingRef.current, {
      scale: buildingZoomScale,
      duration: 8.0,
      ease: "power2.in"
    }, 0);

    // 3. TEXT ENTRANCE (Overlaps with building zoom)
    tl.to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out"
    }, 1.0);

    // 4. TRANSITION TO WINDOW (Canvas Zoom)
    tl.to(buildingRef.current, {
      opacity: 0,
      duration: 2.5,
    }, 5.5);

    tl.to(animState.current, {
      scale: windowZoomScale,
      duration: 3.5,
      onUpdate: scheduleCanvasDraw,
    }, 4.5);

    // 5. TEXT EXIT
    tl.to(textRef.current, {
      opacity: 0,
      y: -50,
      duration: 1.0,
      ease: "power2.in"
    }, 6.0);

    // 6. SMOOTH PAN & HOTSPOTS
    tl.to(animState.current, {
      panY: windowMoveDistance,
      duration: 6.0,
      ease: "power1.inOut",
      onUpdate: scheduleCanvasDraw,
    }, 7.0);

    // Hotspot reveals with professional "back" ease
    const revealHotspot = (ref: React.RefObject<HTMLDivElement | null>, time: number) => {
      tl.to(ref.current, { opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.7)" }, time);
      tl.to(ref.current, { opacity: 0, scale: 0.9, duration: 0.8, ease: "power2.in" }, time + 2.0);
    };

    revealHotspot(pointer1Ref, 8.0);
    revealHotspot(pointer2Ref, 10.5);
    revealHotspot(pointer3Ref, 13.0);
    revealHotspot(pointer4Ref, 15.5);

    const st = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: scrollDistance,
      pin: true,
      scrub: 2, // High scrub for luxurious weight
      onUpdate: (self) => {
        if (!isLockedRef.current) tl.progress(self.progress);
      }
    });

    return () => {
      st.kill();
      tl.kill();
    };
  }, [imageLoaded, isMounted, buildingZoomScale, windowZoomScale, windowMoveDistance, scrollDistance]);

  if (!isMounted) return <section className="w-full h-screen bg-black" />;

  return (
    <section ref={wrapperRef} className="relative w-full bg-black overflow-hidden" style={{ minHeight: '100vh', zIndex: 50 }}>
      <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
        
        {/* Shape Overlay - Fades first */}
        <img
          ref={shapeRef}
          src={resolvedShapeSrc}
          alt=""
          className="absolute top-0 left-1/2 w-full max-w-[100vw] -translate-x-1/2 pointer-events-none"
          style={{ zIndex: 100, height: 'auto', objectFit: 'contain', willChange: 'opacity' }}
        />
        
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} />

        {/* Hotspots */}
        <div ref={pointer1Ref} className="absolute" style={{ zIndex: 20, top: '25%', left: '15%' }}>
          <Hotspot title="SkyPods" subtitle="Floors 29-32" position="right" description="The top floors of the Mirai building are a collection of 16 exclusive SkyPods 100 metres above the ground." />
        </div>

        <div ref={pointer2Ref} className="absolute" style={{ zIndex: 20, top: '20%', right: '20%' }}>
          <Hotspot title="Residencies" subtitle="Level 35" position="left" description="An exclusive rooftop sanctuary featuring panoramic 360-degree views of the city skyline." />
        </div>

        <div ref={pointer3Ref} className="absolute" style={{ zIndex: 20, bottom: '40%', right: '25%' }}>
          <Hotspot title="Clubhouse" subtitle="Levels 3-4" position="left" description="A world-class wellness destination spanning two floors featuring infinity pools and private suites." />
        </div>

        <div ref={pointer4Ref} className="absolute" style={{ zIndex: 20, bottom: '45%', left: '10%' }}>
          <Hotspot title="Podium Level" subtitle="Gardens" position="right" description="Landscaped terraces and secret gardens create tranquil retreats within the urban landscape." />
        </div>

        {/* Floating Text */}
        <div ref={textRef} className="absolute top-1/4 right-10 md:right-24" style={{ zIndex: 5 }}>
          <h2 className="text-4xl md:text-6xl font-light text-white leading-tight tracking-tight uppercase">
            Where You're Always<br />
            <span className="font-bold">In Your Element</span>
          </h2>
        </div>

        {/* Initial Building View */}
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }}>
          <img
            ref={buildingRef}
            src={resolvedBuildingSrc}
            alt="Building View"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ willChange: 'transform, opacity' }}
          />
        </div>
      </div>
    </section>
  );
}

export default RevealZoom;