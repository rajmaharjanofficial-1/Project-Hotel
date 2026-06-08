import React from 'react'
import Hero from '../components/Hero'
import MostPicked from '../components/MostPicked'
import PopularRooms from '../components/PopularRooms'
import Testimonals from '../components/Testimonals'
import RecommendedRooms from '../components/RecommendRoom'

const Home = () => {
  return (
    <div className='py-24'>
      <Hero />
      <MostPicked />
      <PopularRooms />
      <RecommendedRooms />
    </div>
  )
}

export default Home