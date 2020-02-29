import React, { useEffect } from 'react'
import DashboardSection from '../components/dashboard/DashboardSection'
import MyComponent from '../components/dashboard/MyComponent'
import { DrizzleContext } from '@drizzle/react-plugin'
import DashboardTabs from '../components/dashboard/tabs/DashboardTabs'
import { useRouter } from '../util/router'

function DashboardPage(props) {
  const router = useRouter()

  // horrible hack to prevent drizzle error
  useEffect(() => {
    console.log(router.history)
    if (router.history.action === 'POP') {
      console.debug('This is a direct navigation')
    } else {
      window.location.reload()
    }
  }, [router])

  return (
    <DrizzleContext.Consumer>
      {drizzleContext => {
        const { drizzle, drizzleState, initialized } = drizzleContext

        if (!initialized || !drizzleState.contracts || Object.keys(drizzleState.contracts).length !== 3) {
          return 'Loading...'
        }
        return (
          <>
            <DashboardTabs />
            <DashboardSection
              color="white"
              size="large"
              title="Whitt Dashboard"
              subtitle="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aperiam, at cumque cupiditate debitis deleniti dolor est id ipsa itaque iusto, magnam maxime officia pariatur possimus provident reprehenderit sapiente sequi!"
            ></DashboardSection>
            {initialized && <MyComponent drizzle={drizzle} drizzleState={drizzleState} />}
          </>
        )
      }}
    </DrizzleContext.Consumer>
  )
}

export default DashboardPage
