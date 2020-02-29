import React, { useState } from 'react'
import SectionButton from './SectionButton'

function Newsletter(props) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = () => {
    if (email) {
      setSubscribed(true)
      // Parent component can optionally
      // find out when subscribed.
      props.onSubscribed && props.onSubscribed()
      // Subscribe them
    }
  }

  return (
    <>
      {subscribed === false && (
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <div className="field is-grouped">
            <div className="control is-expanded">
              <input
                className={`input is-${props.size}`}
                type="email"
                placeholder={props.inputPlaceholder}
                onChange={event => setEmail(event.target.value)}
              ></input>
            </div>
            <div className="control">
              <SectionButton parentColor={props.parentColor} size={props.size} type="submit">
                {props.buttonText}
              </SectionButton>
            </div>
          </div>
        </form>
      )}

      {subscribed === true && <>{props.subscribedMessage}</>}
    </>
  )
}

export default Newsletter
