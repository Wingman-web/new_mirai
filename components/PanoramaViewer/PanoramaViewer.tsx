'use client';

import { useEffect, useRef, useState, useCallback, useId } from 'react';
import Script from 'next/script';
import { cn, loadImageAsDataUrl } from '@/lib/utils';
import { defaultHotspots, DEFAULT_ROTATION_DURATION, HOTSPOT_PITCH } from '@/lib/hotspots';
import { getIconSvg } from '@/lib/icons';
import type { PanoramaViewerProps, PannellumViewer, HotspotData } from '@/types/panorama';
import './panorama-viewer.css';

export function PanoramaViewer({
  panoramaUrl,
  masterPlanUrl,
  preloaderGifUrl,
  label = '200M.JPG',
  hotspots = defaultHotspots,
  autoRotate = true,
  rotationDuration = DEFAULT_ROTATION_DURATION,
  initialPitch = -90,
  initialYaw = -35,
  initialHfov = 95,
  className,
}: PanoramaViewerProps) {
  const uniqueId = useId();
  const containerId = `panorama-container-${uniqueId.replace(/:/g, '')}`;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const autoSeqTokenRef = useRef<{ cancel: boolean }>({ cancel: false });
  const pitchMonitorRef = useRef<number | null>(null);
  const rotatingRef = useRef<boolean>(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTextVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setPreloaderVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const stopAutoRotation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    autoSeqTokenRef.current.cancel = true;
    rotatingRef.current = false;
    setIsRotating(false);
  }, []);

  const startAutoRotation = useCallback(() => {
    if (!viewerRef.current || rotatingRef.current) return;

    rotatingRef.current = true;
    setIsRotating(true);
    autoSeqTokenRef.current = { cancel: false };

    const startYaw = viewerRef.current.getYaw();
    const startTime = Date.now();

    const animate = () => {
      if (!viewerRef.current || autoSeqTokenRef.current.cancel) {
        return;
      }

      const elapsed = Date.now() - startTime;
      const progress = (elapsed % rotationDuration) / rotationDuration;
      const currentYaw = startYaw + progress * 360;

      viewerRef.current.setYaw(currentYaw % 360);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, [rotationDuration]);

  const handleUserInteraction = useCallback(() => {
    stopAutoRotation();
  }, [stopAutoRotation]);

  const createHotspotTooltip = useCallback((hs: HotspotData) => {
    return (div: HTMLDivElement) => {
      div.classList.add('label-hotspot');
      if (hs.id) div.id = hs.id;
      if (hs.highlight) div.classList.add('highlight');

      const iconContainer = document.createElement('div');
      iconContainer.className = 'hotspot-icon';
      iconContainer.innerHTML = getIconSvg(hs.icon);
      div.appendChild(iconContainer);

      const connector = document.createElement('div');
      connector.className = 'hotspot-connector';
      div.appendChild(connector);

      const text = document.createElement('div');
      text.className = 'label-hotspot-text';
      text.innerHTML = `<p>${hs.title}</p><small>${hs.distance}</small>`;
      div.appendChild(text);

      const dot = document.createElement('div');
      dot.className = 'hotspot-dot';
      div.appendChild(dot);

      if (hs.link) {
        div.style.cursor = 'pointer';
        div.addEventListener('click', (e: MouseEvent) => {
          e.stopPropagation();
          window.open(hs.link, '_blank');
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!scriptsLoaded || !containerRef.current) return;

    let mounted = true;
    // Holds an object URL created when we prefetch the panorama blob so
    // we can revoke it on cleanup.
    let panoramaObjectUrl: string | null = null;

    const initViewer = async () => {
      try {
        if (!window.pannellum) {
          await new Promise<void>((resolve) => {
            const checkInterval = setInterval(() => {
              if (window.pannellum) {
                clearInterval(checkInterval);
                resolve();
              }
            }, 100);
          });
        }

        if (!mounted) return;

        // Try to prefetch the panorama directly and use an object URL
        // (works well for same-origin static assets that sometimes fail
        // when used directly by the viewer). If prefetching fails, fall
        // back to the existing loader which attempts canvas/dataURL/etc.
        let panoramaDataUrl: string;
        try {
          const abs = new URL(panoramaUrl, location.href).toString();
          try {
            const resp = await fetch(abs, { credentials: 'include' });
            if (resp.ok) {
              const ct = resp.headers.get('content-type') || '';
              if (ct.startsWith('image/')) {
                const blob = await resp.blob();
                panoramaObjectUrl = URL.createObjectURL(blob);
                panoramaDataUrl = panoramaObjectUrl;
                console.debug('PanoramaViewer: prefetched panorama as object URL', panoramaObjectUrl);
              } else {
                console.debug('PanoramaViewer: prefetch returned non-image content-type', ct);
                panoramaDataUrl = await loadImageAsDataUrl(panoramaUrl);
              }
            } else {
              console.debug('PanoramaViewer: prefetch response not ok', resp.status);
              panoramaDataUrl = await loadImageAsDataUrl(panoramaUrl);
            }
          } catch (fetchErr) {
            console.debug('PanoramaViewer: prefetch failed, attempting server proxy', fetchErr);
            try {
              const proxyUrl = `/api/static-proxy?path=${encodeURIComponent(panoramaUrl)}`;
              const pr = await fetch(proxyUrl, { credentials: 'include' });
              if (pr.ok) {
                const blob = await pr.blob();
                panoramaObjectUrl = URL.createObjectURL(blob);
                panoramaDataUrl = panoramaObjectUrl;
                console.debug('PanoramaViewer: fetched panorama via server proxy', proxyUrl, panoramaObjectUrl);
              } else {
                console.debug('PanoramaViewer: server proxy failed', pr.status);
                panoramaDataUrl = await loadImageAsDataUrl(panoramaUrl);
              }
            } catch (proxyErr) {
              console.debug('PanoramaViewer: server proxy attempt failed, falling back to loader', proxyErr);
              panoramaDataUrl = await loadImageAsDataUrl(panoramaUrl);
            }
          }
        } catch (urlErr) {
          console.debug('PanoramaViewer: could not resolve panorama URL, falling back', urlErr);
          panoramaDataUrl = await loadImageAsDataUrl(panoramaUrl);
        }

        if (!mounted) return;

        // If the loader returned the original problematic URL (e.g. `/200m.jpg`)
        // then try the server-side proxy explicitly before handing the URL to
        // Pannellum. This avoids Pannellum receiving a URL that triggers a
        // redirect loop on the dev server.
        if (panoramaDataUrl === panoramaUrl) {
          try {
            const proxyUrl = `/api/static-proxy?path=${encodeURIComponent(panoramaUrl)}`;
            const pr = await fetch(proxyUrl, { credentials: 'include' });
            if (pr.ok) {
              const blob = await pr.blob();
              if (panoramaObjectUrl) {
                URL.revokeObjectURL(panoramaObjectUrl);
              }
              panoramaObjectUrl = URL.createObjectURL(blob);
              panoramaDataUrl = panoramaObjectUrl;
              console.debug('PanoramaViewer: replaced original URL with proxy object URL', panoramaObjectUrl);
            } else {
              console.debug('PanoramaViewer: proxy fetch returned non-ok', pr.status);
            }
          } catch (proxyErr) {
            console.debug('PanoramaViewer: explicit proxy attempt failed', proxyErr);
          }
        }

        const hotspotConfigs = hotspots.map((hs) => ({
          pitch: hs.pitch,
          yaw: hs.yaw,
          cssClass: 'label-hotspot',
          createTooltipFunc: createHotspotTooltip(hs),
        }));

        if (masterPlanUrl) {
          hotspotConfigs.unshift({
            pitch: -90,
            yaw: 0,
            cssClass: 'master-plan-hotspot',
            createTooltipFunc: (div: HTMLDivElement) => {
              div.classList.add('master-plan-hotspot');
              div.setAttribute('data-rotation-sync', 'true');

              const img = document.createElement('img');
              img.src = masterPlanUrl;
              img.style.maxWidth = '700px';
              img.style.width = 'auto';
              img.style.height = 'auto';
              img.style.pointerEvents = 'none';
              img.style.marginLeft = '25px';
              img.style.transition = 'transform 0.05s linear';
              img.setAttribute('data-master-plan-img', 'true');
              div.appendChild(img);
            },
          });
        }

        // Determine whether to set crossOrigin for the viewer based on the
        // resolved panorama URL. Setting crossOrigin for same-origin images
        // can cause the browser to perform a CORS-style fetch that fails
        // if the server doesn't return CORS headers.
        let crossOriginSetting: string | undefined;
        try {
          const check = new URL(panoramaDataUrl, location.href);
          if (check.origin !== location.origin && !panoramaDataUrl.startsWith('data:') && !panoramaDataUrl.startsWith('blob:')) {
            crossOriginSetting = 'anonymous';
          }
        } catch (e) {
          // ignore
        }

        const viewerConfig: any = {
          type: 'equirectangular',
          panorama: panoramaDataUrl,
          pitch: initialPitch,
          yaw: initialYaw,
          hfov: initialHfov,
          minHfov: 50,
          maxHfov: 120,
          autoLoad: true,
          showControls: true,
          compass: true,
          friction: 0.15,
          draggable: true,
          mouseZoom: true,
          doubleClickZoom: true,
          vaov: 180,
          haov: 360,
          backgroundColor: [0, 0, 0],
          dynamicUpdate: true,
          autoRotate: 0,
          autoRotateInactivityDelay: -1,
          autoRotateStopDelay: -1,
          orientationOnByDefault: false,
          showZoomCtrl: true,
          hotSpots: hotspotConfigs,
        };

        if (crossOriginSetting) viewerConfig.crossOrigin = crossOriginSetting;

        console.debug('PanoramaViewer: initializing pannellum', { panoramaDataUrl, crossOriginSetting });

        viewerRef.current = window.pannellum.viewer(containerId, viewerConfig);

        viewerRef.current.on('load', () => {
          if (!viewerRef.current || !mounted) return;

          viewerRef.current.setPitch(initialPitch);
          viewerRef.current.setYaw(initialYaw);
          viewerRef.current.setHfov(initialHfov);

          setIsLoading(false);

          const monitorPitch = () => {
            if (!viewerRef.current || !mounted) return;

            const yaw = viewerRef.current.getYaw();
            const hfov = viewerRef.current.getHfov();

            const masterPlanImg = document.querySelector(
              '[data-master-plan-img="true"]'
            ) as HTMLImageElement | null;

            if (masterPlanImg) {
              const baseHfov = 95;
              const scale = baseHfov / hfov;
              masterPlanImg.style.transform = `rotate(${-yaw}deg) scale(${scale})`;
            }

            pitchMonitorRef.current = requestAnimationFrame(monitorPitch);
          };

          monitorPitch();

          if (autoRotate) {
            setTimeout(() => {
              if (!viewerRef.current || autoSeqTokenRef.current.cancel || !mounted) return;

              viewerRef.current.lookAt(HOTSPOT_PITCH, initialYaw, initialHfov, 2000);

              setTimeout(() => {
                if (!autoSeqTokenRef.current.cancel && mounted) {
                  startAutoRotation();
                }
              }, 2500);
            }, 3000);
          }
        });

        viewerRef.current.on('error', (msg: unknown) => {
          console.error('Pannellum viewer error:', msg);
        });
      } catch (error) {
        console.error('Failed to initialize panorama viewer:', error);
        if (mounted) setIsLoading(false);
      }
    };

    initViewer();

    return () => {
      mounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (pitchMonitorRef.current) {
        cancelAnimationFrame(pitchMonitorRef.current);
      }
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) {}
      }

      // Revoke any object URL we created during prefetch to avoid leaking
      if (panoramaObjectUrl) {
        try {
          URL.revokeObjectURL(panoramaObjectUrl);
        } catch (e) {
          /* ignore */
        }
        panoramaObjectUrl = null;
      }
    };
  }, [scriptsLoaded, panoramaUrl, masterPlanUrl, hotspots, autoRotate, initialPitch, initialYaw, initialHfov, containerId, createHotspotTooltip, startAutoRotation]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousedown', handleUserInteraction);
    container.addEventListener('touchstart', handleUserInteraction);
    container.addEventListener('wheel', handleUserInteraction);

    return () => {
      container.removeEventListener('mousedown', handleUserInteraction);
      container.removeEventListener('touchstart', handleUserInteraction);
      container.removeEventListener('wheel', handleUserInteraction);
    };
  }, [handleUserInteraction]);

  return (
    <div className={cn('relative w-full h-full', className)}>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"
      />
      
      <Script
        src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"
        strategy="afterInteractive"
        onLoad={() => setScriptsLoaded(true)}
      />

      {preloaderVisible && (
        <div
          className={cn(
            'fixed inset-0 z-100001 flex items-center justify-center',
            'bg-[#0b1220] transition-all duration-400 ease-out',
            'text-[#e5eef8]',
            !isLoading && 'opacity-0 invisible pointer-events-none'
          )}
        >
          <div className="flex flex-col items-center gap-3">
            {preloaderGifUrl ? (
              <img
                src={preloaderGifUrl}
                alt="Loading…"
                className="w-50 h-auto"
              />
            ) : (
              <div className="w-50 h-50 flex items-center justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-cyan-400/30 border-t-cyan-400 panorama-preloader-spinner" />
                  <div className="absolute inset-2 rounded-full border-2 border-emerald-400/20 border-b-emerald-400 panorama-preloader-spinner-slow" />
                </div>
              </div>
            )}
            <div
              className={cn(
                'text-[#cfd8dc] text-[15px] text-center max-w-90 px-3 leading-tight',
                'transition-all duration-600 ease-out',
                textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5'
              )}
            >
              Relax — bring a cup of coffee and enjoy the view.
            </div>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className={cn(
          'w-full h-full relative z-1 bg-[#0b1220]',
          'transition-opacity duration-500 ease-out',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      >
        <div id={containerId} className="w-full h-full" />

        <div className="absolute top-3 left-3 z-20 text-gray-400 bg-black/40 py-1.5 px-2 rounded-md text-[13px]">
          Viewing: <strong className="text-white">{label}</strong>
        </div>

        <div className="fixed bottom-3 left-3 z-12010 flex gap-2 items-center">
          <button
            onClick={() => !isRotating && startAutoRotation()}
            className={cn(
              'inline-flex items-center justify-center',
              'w-11 h-11 rounded-lg',
              'bg-black/70 border-2 border-white/30',
              'text-white text-sm font-semibold',
              'backdrop-blur-lg cursor-pointer',
              'transition-all duration-180 ease-out',
              'hover:bg-black/85 hover:border-white/60',
              'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40',
              'active:translate-y-0',
              !isRotating && 'bg-emerald-600/80 border-emerald-600'
            )}
            title="Start rotation"
            aria-label="Start rotation"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>

          <button
            onClick={stopAutoRotation}
            className={cn(
              'inline-flex items-center justify-center',
              'w-11 h-11 rounded-lg',
              'bg-black/70 border-2 border-white/30',
              'text-white text-sm font-semibold',
              'backdrop-blur-lg cursor-pointer',
              'transition-all duration-180 ease-out',
              'hover:bg-black/85 hover:border-white/60',
              'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40',
              'active:translate-y-0',
              isRotating && 'bg-emerald-600/80 border-emerald-600'
            )}
            title="Stop rotation"
            aria-label="Stop rotation"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PanoramaViewer;