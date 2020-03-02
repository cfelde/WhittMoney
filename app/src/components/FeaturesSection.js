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
                'It\'s not only safe, trustless and transparent. It\'s simply better and way more efficient than traditional finance interest rate swaps - complicated legal agreements with risk of insolvency. Did we mention that the fixed interest rate is available instantly?',
              image: require('../assets/undraw_connected_world_wuay.svg'),
            },
            {
              title: 'ROI Simulation',
              description: (<>
                <table className="table">
                  <thead>
                  <tr>
                    <th><abbr title="Investment">Inv</abbr></th>
                    <th><abbr title="Initial APY">APY</abbr></th>
                    <th><abbr title="Stable fee offer">Fee</abbr></th>
                    <th><abbr title="Average APY change">Average Δ</abbr></th>
                    <th>ROI</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>7000</td>
                    <td>8%</td>
                    <td>7%</td>
                    <td>0%</td>
                    <td>14%</td>
                  </tr>
                  <tr>
                    <td>7000</td>
                    <td>8%</td>
                    <td>7%</td>
                    <td>-1%</td>
                    <td>0%</td>
                  </tr>
                  <tr>
                    <td>7000</td>
                    <td>8%</td>
                    <td>7%</td>
                    <td>+1%</td>
                    <td>28%</td>
                  </tr>
                  <tr>
                    <td>7000</td>
                    <td>8%</td>
                    <td>7%</td>
                    <td>+2%</td>
                    <td>42%</td>
                  </tr>
                  </tbody>
                </table>
                <p>Being a fixed-rate up-front payment provider gives the opportunity for much bigger ROI with fairly low loss exposure.</p>
              </>),
              image: require('../assets/undraw_Savings_dwkw.svg'),
            },
          ]}
        ></Features>
      </div>
    </Section>
  )
}

export default FeaturesSection
