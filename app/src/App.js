import React from 'react'
import { DrizzleContext } from '@drizzle/react-plugin'
import { Drizzle, generateStore } from '@drizzle/store'
import AppWrapper from './pages/app_wrapper'
import drizzleOptions from './drizzleOptions'
import { ToastProvider } from 'react-toast-notifications'

const drizzleStore = generateStore(drizzleOptions)
const drizzle = new Drizzle(drizzleOptions, drizzleStore)

const App = () => {
  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <ToastProvider autoDismiss autoDismissTimeout={12000}>
        <AppWrapper />
      </ToastProvider>
    </DrizzleContext.Provider>
  )
}

export default App
