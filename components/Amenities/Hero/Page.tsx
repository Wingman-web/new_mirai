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


    </section>
  )
}

export default AmenitiesHero
