import React, { useState } from 'react'
import Tabs from './Tabs'
import MyComponent from '../MyComponent'
import { DrizzleContext } from '@drizzle/react-plugin'

const ActiveTabContent = props => <div>{props.content}</div>

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
                content: 'Some offers!',
              },
              {
                name: 'Make Offer',
                icon: '',
                content: 'Soon to be a form where you can make offers',
              },
              {
                name: 'Drizzle Examples',
                icon: '',
                content: <MyComponent drizzle={drizzle} drizzleState={drizzleState} />,
              },
            ]

            const activeTabContent = () => {
              const activeIndex = tabList.findIndex(tab => {
                return tab.name === activeTab
              })
              return tabList[activeIndex].content
            }

            if (!initialized || !drizzleState.contracts || Object.keys(drizzleState.contracts).length !== 3) {
              return 'Loading...'
            }
            return (
              <>
                <Tabs tabList={tabList} activeTab={activeTab} changeActiveTab={setActiveTab} />
                <ActiveTabContent key={activeTab} content={activeTabContent()} />
              </>
            )
          }}
        </DrizzleContext.Consumer>
      </div>
    </section>
  )
}

export default DashboardTabs
