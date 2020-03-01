import React, { useEffect } from 'react'
import DashboardSection from '../components/dashboard/DashboardSection'
import MyComponent from '../components/dashboard/tabs/tab-content/DrizzleComponent'
import { DrizzleContext } from '@drizzle/react-plugin'
import DashboardTabs from '../components/dashboard/tabs/DashboardTabs'
import { useRouter } from '../util/router'

function DashboardPage(props) {
  const router = useRouter()

  // horrible hack to prevent drizzle error
  useEffect(() => {
    if (router.history.action !== 'POP') {
      window.location.reload()
    }
  }, [router])

  return (
    <>
      <DashboardTabs />
      {/*
      <DashboardSection
        color="white"
        size="large"
        title="Whitt Dashboard"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aperiam, at cumque cupiditate debitis deleniti dolor est id ipsa itaque iusto, magnam maxime officia pariatur possimus provident reprehenderit sapiente sequi!"
      ></DashboardSection>
*/}
    </>
  )
}

export default DashboardPage
