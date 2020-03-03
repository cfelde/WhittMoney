import React from 'react'
import Section from './Section'
import SectionHeader from './SectionHeader'
import './PresentationSection.scss'

function PresentationSection(props) {
  return (
    <Section
      color={props.color}
      size={props.size}
      backgroundImage={props.backgroundImage}
      backgroundImageOpacity={props.backgroundImageOpacity}
    >
      <div className="container">
        <SectionHeader title={props.title} size={3} spaced={true} className="has-text-centered"></SectionHeader>
        <iframe
          className="pres-iframe"
          src="//www.slideshare.net/slideshow/embed_code/key/6OVBvbeYktmThY"
          width="595"
          height="485"
          frameBorder="0"
          marginWidth="0"
          marginHeight="0"
          scrolling="no"
          allowFullScreen
        ></iframe>
      </div>
    </Section>
  )
}

export default PresentationSection
