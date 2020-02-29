import React from 'react'
import Section from './Section'
import SectionHeader from './SectionHeader'
import Clients from './Clients'

function ClientsSection(props) {
  return (
    <Section
      color={props.color}
      size={props.size}
      backgroundImage={props.backgroundImage}
      backgroundImageOpacity={props.backgroundImageOpacity}
    >
      <div className="container">
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={3}
          spaced={true}
          className="has-text-centered"
        ></SectionHeader>
        <Clients
          items={[
            {
              name: 'MakerDAO',
              image: require('../assets/tech-maker.png'),
              width: '150px',
            },
            {
              name: 'Ethereum',
              image: require('../assets/tech-ether.png'),
              width: '150px',
            },
            {
              name: 'DAI',
              image: require('../assets/tech-dai.png'),
              width: '140px',
            },
          ]}
        ></Clients>
      </div>
    </Section>
  )
}

export default ClientsSection
