import React from 'react'
import CenteredColumns from './CenteredColumns'
import Avatar from './Avatar'
import './TeamBios.scss'

function TeamBios(props) {
  return (
    <CenteredColumns>
      {props.people.map((person, index) => (
        <div className="column is-half-tablet is-one-quarter-desktop is-flex" key={index}>
          <div className="TeamBios__card card is-flex">
            <div className="TeamBios__card-content card-content is-flex has-text-centered">
              <div className="TeamBios__avatar-wrapper">
                <Avatar image={person.avatar} size={128} alt={person.name}></Avatar>
              </div>
              <div className="TeamBios__details">
                <p className="is-size-5">{person.name}</p>
                <p className="is-size-7 is-uppercase has-text-weight-semibold">{person.role}</p>
                <a href={person.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <span className="icon">
                    <i className="fab fa-linkedin"></i>
                  </span>
                </a>
                <a href={person.githubUrl} target="_blank" rel="noopener noreferrer">
                  <span className="icon">
                    <i className="fab fa-github"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </CenteredColumns>
  )
}

export default TeamBios
