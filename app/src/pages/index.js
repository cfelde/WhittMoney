import React from 'react'
import HeroSection from './../components/HeroSection'
import ClientsSection from './../components/ClientsSection'
import FeaturesSection from './../components/FeaturesSection'
import TestimonialsSection from './../components/TestimonialsSection'
import NewsletterSection from './../components/NewsletterSection'
import { useRouter } from './../util/router.js'
import TeamBiosSection from '../components/TeamBiosSection'
import PresentationSection from '../components/PresentationSection'

function IndexPage(props) {
  const router = useRouter()

  return (
    <>
      <HeroSection
        color="white"
        size="medium"
        backgroundImage=""
        backgroundImageOpacity={1}
        title="Interest rate Swaps on DeFi"
        subtitle="A trustless interest rate swap marketplace leveraging DeFi savings protocols"
        buttonText="Launch DApp"
        image={require('../assets/undraw_ethereum_fb7n.svg')}
        buttonOnClick={() => {
          // Navigate to pricing page
          router.push('/dashboard')
        }}
      ></HeroSection>
      <ClientsSection
        color="light"
        size="normal"
        backgroundImage=""
        backgroundImageOpacity={1}
        title=""
        subtitle=""
      ></ClientsSection>
      <FeaturesSection
        color="white"
        size="medium"
        backgroundImage=""
        backgroundImageOpacity={1}
        title="Features"
        subtitle="Whitt is a trustless interest rate swap marketplace leveraging DeFi savings protocols, built using DAI, rDAI and MakerDAO"
      ></FeaturesSection>
      <PresentationSection title="Our Pitch" color="light" />
      <TeamBiosSection
        color="white"
        size="medium"
        backgroundImage=""
        backgroundImageOpacity={1}
        title="Meet the Team"
        subtitle=""
      ></TeamBiosSection>
      <NewsletterSection
        color="light"
        size="medium"
        backgroundImage=""
        backgroundImageOpacity={1}
        title="Stay in the know"
        subtitle="Receive our latest articles and feature updates"
        buttonText="Subscribe"
        inputPlaceholder="Enter your email"
        subscribedMessage="You are now subscribed!"
      ></NewsletterSection>
    </>
  )
}

export default IndexPage
