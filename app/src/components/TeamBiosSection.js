import React from 'react'
import Section from './Section'
import SectionHeader from './SectionHeader'
import TeamBios from './TeamBios'
import array from 'lodash'

function TeamBiosSection(props) {
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
        <TeamBios
          people={array.shuffle([
            {
              avatar: require('../assets/team/josh.jpg'),
              name: 'Joshua Richardson',
              role: 'Blockchain Engineer',
              githubUrl: 'https://github.com/josh-richardson/',
              linkedinUrl: 'https://www.linkedin.com/in/josh-richardson/',
            },
            {
              avatar: require('../assets/team/christian.jpg'),
              name: 'Christian Felde',
              role: 'Blockchain Engineer',
              githubUrl: 'https://github.com/cfelde/',
              linkedinUrl: 'https://www.linkedin.com/in/cfelde/',
            },
            {
              avatar: require('../assets/team/ivaylo.jpg'),
              name: 'Ivaylo Kirilov',
              role: 'Blockchain Engineer',
              githubUrl: 'https://github.com/iikirilov/',
              linkedinUrl: 'https://www.linkedin.com/in/iikirilov/',
            },
            {
              avatar: require('../assets/team/krzysztof.jpg'),
              name: 'Krzysztof Urbański',
              role: 'Strategy & Development',
              githubUrl: 'https://github.com/kurbanski/',
              linkedinUrl: 'https://www.linkedin.com/in/krzysztofurbanski/',
            },
          ])}
        ></TeamBios>
      </div>
    </Section>
  )
}

export default TeamBiosSection
