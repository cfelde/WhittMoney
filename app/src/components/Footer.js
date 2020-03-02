import React from 'react'
import Section from './Section'
import { Link } from './../util/router.js'
import './Footer.scss'

function Footer(props) {
  return (
    <Section
      color={props.color}
      size={props.size}
      backgroundImage={props.backgroundImage}
      backgroundImageOpacity={props.backgroundImageOpacity}
    >
      <div className="FooterComponent__container container">
        <div className="brand left">
          <Link to="/">
            <img src={props.logo} alt="Logo"></img>
          </Link>
        </div>
        <div className="links right">
          <Link to="/about">About</Link>
          <a href="https://github.com/cfelde/WhittMoney" target="_blank" rel="noopener noreferrer">Source Code / GitHub</a>
        </div>
        <div className="social right">
          <a onClick={() => alert('We hope to have these soon!')} href="#!">
            <span className="icon">
              <i className="fab fa-twitter"></i>
            </span>
          </a>
          <a onClick={() => alert('We hope to have these soon!')} href="#!">
            <span className="icon">
              <i className="fab fa-facebook-f"></i>
            </span>
          </a>
          <a onClick={() => alert('We hope to have these soon!')} href="#!">
            <span className="icon">
              <i className="fab fa-instagram"></i>
            </span>
          </a>
        </div>
        <div className="copyright left">{props.copyright}</div>
      </div>
    </Section>
  )
}

export default Footer
