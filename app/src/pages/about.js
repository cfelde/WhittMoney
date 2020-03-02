import React from 'react'
import HeroSection2 from './../components/HeroSection2'
import TeamBiosSection from './../components/TeamBiosSection'

function AboutPage(props) {
  return (
    <>
      <HeroSection2
        color="primary"
        size="large"
        backgroundImage=""
        backgroundImageOpacity={1}
        title="Decentralized Interest Swaps on DeFi"
      ></HeroSection2>
      <TeamBiosSection
        color="white"
        size="medium"
        backgroundImage=""
        backgroundImageOpacity={1}
        title="Meet the Team"
        subtitle=""
      ></TeamBiosSection>
    </>
  )
}

export default AboutPage
