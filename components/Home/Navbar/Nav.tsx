'use client'

import React, { useState, useRef, useEffect } from 'react'
import { HiBars3BottomRight } from 'react-icons/hi2'
import { IoClose } from 'react-icons/io5'
import { NAV_LINKS } from '@/constant/nav_constant'
import Logo from '@/components/Helper/logo'

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredLink, setHoveredLink] = useState<number | null>(null)
  const [isPageReady, setIsPageReady] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'
      document.head.appendChild(script)

      const onLoad = () => setIsPageReady(true)
      if (document.readyState === 'complete') onLoad()
      else window.addEventListener('load', onLoad)

      return () => {
        window.removeEventListener('load', onLoad)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
      document.documentElement.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
      document.documentElement.classList.remove('overflow-hidden')
    }

    return () => {
      try {
        document.body.classList.remove('overflow-hidden')
        document.documentElement.classList.remove('overflow-hidden')
      } catch (e) {
        // noop
      }
    }
  }, [isOpen])

  const carouselImages = [
    '/Home_Caseroll.png',
    '/Aminites_Caseroll.png',
    '/Location_Caseroll.png',
    '/Map_Caseroll.png',
    '/Life@Mirai_Caseroll.png'
  ]

  return (
    <>
      <nav className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${isOpen ? 'bg-black' : 'bg-transparent'} ${isPageReady ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-50">
          <Logo isOpen={isOpen} />
        </div>

        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-gray-400 transition text-2xl"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <IoClose size={28} /> : <HiBars3BottomRight size={28} />}
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-20">

          </div>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`fixed inset-x-0 top-20 bottom-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Fullscreen Menu */}
      <div
        className={`fixed inset-x-0 top-20 bottom-0 bg-black transform transition-transform duration-500 ease-in-out z-40 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row'
        }}
      >

        {/* Content - 3 Columns */}
        <div style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          position: 'relative',
          zIndex: 10
        }}>
          {/* Left Section - Navigation Links (1/3) */}
          <div style={{
            width: '28%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: '38px 40px',
            overflow: 'hidden',
            backgroundColor: 'transparent'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '48px'
            }}>
              {NAV_LINKS.map((link, index) => (
                <a
                  key={link.id}
                  href={link.href}
                  onMouseEnter={() => { setHoveredLink(link.id); setActiveIndex(index); }}
                  onMouseLeave={() => setHoveredLink(null)}
                  onClick={() => setIsOpen(false)}
                  style={{
                    textDecoration: 'none',
                    position: 'relative',
                    cursor: 'pointer',
                    display: 'inline-block',
                    transform: hoveredLink === link.id ? 'translateX(12px)' : 'translateX(0)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <span style={{
                    display: 'inline-block',
                    fontSize: '44px',
                    fontFamily: 'var(--font-magra, "Magra", "Century Gothic", Arial, sans-serif)',
                    lineHeight: '1',
                    fontWeight: 300,
                    color: hoveredLink === link.id ? '#78252f' : '#fff'
                  }}>
                    {link.label}
                    <span style={{
                      display: 'inline-block',
                      height: '4px',
                      backgroundColor: '#78252f',
                      marginTop: '8px',
                      width: 'auto',
                      transform: hoveredLink === link.id ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s ease'
                    }} />
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Middle Section - Gallery (1/3) */}
          <div style={{
            width: '44%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: 'transparent',
            overflow: 'visible',
            padding: '40px 0'
          }}>
            <div 
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                transformStyle: 'preserve-3d',
                perspective: '1200px'
              }}
            >
              <div
                ref={containerRef}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateZ(-20deg) rotateX(-10deg) translateY(10px) rotateY(${activeIndex * -72}deg)`,
                  transition: 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)',
                  width: '460px',
                  height: '640px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {carouselImages.map((img, index) => {
                  const angle = (index * 360) / carouselImages.length
                  const radius = 170
                    
                  return (
                    <div
                      key={index}
                      style={{
                        position: 'absolute',
                        width: '240px',
                        height: '380px',
                        left: '50%',
                        top: '34%',
                        marginLeft: '-130px',
                        marginTop: '-170px',
                        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                        transformStyle: 'preserve-3d',
                        backfaceVisibility: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)'
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                      }}
                      onClick={() => setActiveIndex(index)}
                    >
                      <img
                        src={img}
                        alt={`carousel-${index}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Section - Description (1/3) */}
          <div style={{
            width: '28%',
            height: '100%',
            backgroundColor: 'transparent',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            overflow: 'hidden'
          }}>
            <div>
              <h3 style={{
                fontSize: '48px',
                fontWeight: 300,
                color: '#fff',
                marginBottom: '32px',
                letterSpacing: '-0.02em'
              }}>
                {NAV_LINKS[activeIndex]?.label}
              </h3>
              <p style={{
                color: '#d1d5db',
                fontSize: '18px',
                lineHeight: '1.6',
                fontWeight: 300
              }}>
                {NAV_LINKS[activeIndex]?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Nav
