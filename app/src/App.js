import React from 'react'
import { DrizzleContext } from '@drizzle/react-plugin'
import { Drizzle, generateStore } from '@drizzle/store'
import AppWrapper from './pages/app_wrapper'
import drizzleOptions from './drizzleOptions'

const drizzleStore = generateStore(drizzleOptions)
const drizzle = new Drizzle(drizzleOptions, drizzleStore)

const App = () => {
  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <AppWrapper />
    </DrizzleContext.Provider>
  )
}

export default App
