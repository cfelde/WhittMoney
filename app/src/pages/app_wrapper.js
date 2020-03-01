import React, { useEffect } from 'react'
import './../styles/global.scss'
import Navbar from './../components/Navbar'
import IndexPage from './index'
import AboutPage from './about'
import ContactPage from './contact'
import DashboardPage from './dashboard'
import { Switch, Route, Router } from './../util/router.js'
import Footer from './../components/Footer'
import { ProvideAuth } from './../util/auth.js'
import { useRouter } from './../util/router'

function AppWrapper(props) {
  return (
    <ProvideAuth>
      <Router>
        <>
          <Navbar color="white" spaced={true} logo={require('../assets/whitt.svg')}></Navbar>

          <Switch>
            <Route exact path="/" component={IndexPage} />

            <Route exact path="/about" component={AboutPage} />

            <Route exact path="/contact" component={ContactPage} />

            <Route exact path="/dashboard" component={DashboardPage} />

            <Route
              component={({ location }) => {
                return (
                  <div
                    style={{
                      padding: '50px',
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    The page <code>{location.pathname}</code> could not be found.
                  </div>
                )
              }}
            />
          </Switch>

          <Footer
            color="light"
            size="normal"
            backgroundImage=""
            backgroundImageOpacity={1}
            copyright="© 2020 Whitt Team"
            logo={require('../assets/whitt.svg')}
          ></Footer>
        </>
      </Router>
    </ProvideAuth>
  )
}

export default AppWrapper
