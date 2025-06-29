import React from 'react'
import Navbar from '../components/Navbar'

import MidHome from '@/components/MidHome'
import SponsorsSidebar from '@/components/SponsorsSidebar'

const Home = () => {
  return (
    <>
      <Navbar />
      <div className='flex gap-7 dark:bg-[#1b1b1c] bg-[#f2f4f7]'>
        <MidHome />
        <SponsorsSidebar />
      </div>
    </>
  )
}

export default Home
