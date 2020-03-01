import React, { useState } from 'react'
import Tabs from './Tabs'
import MyComponent from './tab-content/DrizzleComponent'
import { DrizzleContext } from '@drizzle/react-plugin'
import MakeOffer from './tab-content/MakeOffer'
import OffersTable from './tab-content/OffersTable'

function DashboardTabs(props) {
  const [activeTab, setActiveTab] = useState('Offers')
  return (
    <section className="section">
      <div className="container">
        <DrizzleContext.Consumer>
          {drizzleContext => {
            const { drizzle, drizzleState, initialized } = drizzleContext
            const tabList = [
              {
                name: 'Offers',
                icon: '',
                content: <OffersTable activeTab={activeTab} name={'Offers'} />,
              },
              {
                name: 'Make Offer',
                icon: '',
                content: <MakeOffer activeTab={activeTab} name={'Make Offer'} />,
              },
              {
                name: 'Drizzle Examples',
                icon: '',
                content: <MyComponent drizzle={drizzle} drizzleState={drizzleState} />,
              },
            ]
            if (!initialized || !drizzleState.contracts || Object.keys(drizzleState.contracts).length !== 3) {
              return 'Loading...'
            }
            return (
              <>
                <Tabs tabList={tabList} activeTab={activeTab} changeActiveTab={setActiveTab} />
                {tabList.map(i => {
                  return <div className={'drizzle-fix' + (activeTab === i.name ? ' active-tab' : '')}>{i.content}</div>
                })}
              </>
            )
          }}
        </DrizzleContext.Consumer>
      </div>
    </section>
  )
}

export default DashboardTabs
