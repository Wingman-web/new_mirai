import React from 'react'
import Image from 'next/image'

const AmenitiesHero = () => {
  return (
    <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Full-viewport background image from public/images/ameniti_bg.png */}
      <Image
        src="/images/ameniti_bg.png"
        alt="Amenities background"
        fill
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        priority
        unoptimized
      />
      
      {/* Logo with Lines */}
      <div className="absolute top-8 left-0 right-0 z-20 flex items-center px-8">
        <div className="flex-1 h-[1px] bg-white"></div>
        <div className="px-8">
          <img
            src="https://azure-baboon-302476.hostingersite.com/mirai_latest/media/logo.png"
            alt="Pavani Mirai Logo"
            className="h-16 w-auto"
          />
        </div>
        <div className="flex-1 h-[1px] bg-white"></div>
      </div>
    </section>
  )
}

export default AmenitiesHero
