import React, { useEffect, useState } from 'react'
import NavbarContainer from './NavbarContainer'
import { Link } from './../util/router.js'
import { useAuth } from './../util/auth.js'
import './Navbar.scss'
import { useRouter } from './../util/router'

function Navbar(props) {
  const auth = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <NavbarContainer spaced={props.spaced} color={props.color}>
      <div className="container">
        <div className="navbar-brand">
          <div className="navbar-item">
            <Link className="logo-link-wrapper" to="/">
              <img className="image logo-image" src={props.logo} alt="Logo"></img>
              <p className="logo-text">Whitt</p>
            </Link>
          </div>
          <div
            className={'navbar-burger burger' + (menuOpen ? ' is-active' : '')}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className={'navbar-menu' + (menuOpen ? ' is-active' : '')}>
          <div className="navbar-end">
            {auth.user && (
              <div className="navbar-item has-dropdown is-hoverable">
                <Link className="navbar-link" to="/">
                  Account
                </Link>
                <div className="navbar-dropdown is-boxed">
                  <Link className="navbar-item" to="/dashboard">
                    Dashboard
                  </Link>
                  <Link
                    className="navbar-item"
                    to="/auth/signout"
                    onClick={e => {
                      e.preventDefault()
                      auth.signout()
                    }}
                  >
                    Sign out
                  </Link>
                </div>
              </div>
            )}

            {!auth.user && (
              <Link className="navbar-item" to="/dashboard">
                Launch DApp
              </Link>
            )}
          </div>
        </div>
      </div>
    </NavbarContainer>
  )
}

export default Navbar
