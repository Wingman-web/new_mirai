import React from 'react'
import AmenitiesHero from '@/components/Amenities/Hero/Page';
import MiraiAmenities from '@/components/Amenities/Hero_Intro/Page';
import MiraiAmenitiesShowcase from'@/components/Amenities/Text_Drop/Text_Drop';
import Carousel from '@/components/Amenities/Slider/Slider'
import SparkleLogo from '@/components/Amenities/Spracle_Animation/page'
import EraSeasons from '@/components/Amenities/Era_Interative_session/page'
import Footer from '@/components/Home/Footer/Footer';


export default function AmenitiesPage() {
  return (
    <div>
      <AmenitiesHero />
      <MiraiAmenities />
      <MiraiAmenitiesShowcase />
      <Carousel />
      <SparkleLogo />
      <EraSeasons />
      <Footer />
    </div>
  )
}
