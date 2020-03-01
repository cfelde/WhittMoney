import React from 'react'
import Section from './Section'
import SectionHeader from './SectionHeader'
import Features from './Features'

function FeaturesSection(props) {
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
        <Features
          items={[
            {
              title: 'Fixed fee paid up-front',
              description:
                'Whitt gives you the opportunity to get fixed, up-front paid interest rate on your collateral, with a trustless, safe, time-bound deal.',
              image: require('../assets/undraw_transfer_money_rywa.svg'),
            },
            {
              title: 'Investment Opportunity',
              description:
                'By betting on future interest rates, you can benefit from collateral several times higher then your available capital.',
              image: require('../assets/undraw_investing_7u74.svg'),
            },
            {
              title: 'Raises the bar over CeFi',
              description:
                "It's not only safe, trustless and transparent. It's simply better and way more efficient than traditional finance interest rate swaps - complicated legal agreements with risk of insolvency. Did we mention that the fixed interest rate is available instantly?",
              image: require('../assets/undraw_connected_world_wuay.svg'),
            },
            {
              title: 'Save',
              description:
                'investment | initial APY | Stable fee offer | average APY change | ROI\n' +
                '7000 | 8% | 7% | 0        | 14%\n' +
                '7000 | 8% | 7% | -1% | 0%\n' +
                '7000 | 8% | 7% | +1% | 28%\n' +
                '7000 | 8% | 7% | +2% | 42%\n' +
                '\n' +
                'Beign a fixed-rate up-front payment provider gives the opportunity for much bigger ROI with fairly low loss exposure.',
              image: require('../assets/undraw_Savings_dwkw.svg'),
            },
          ]}
        ></Features>
      </div>
    </Section>
  )
}

export default FeaturesSection
