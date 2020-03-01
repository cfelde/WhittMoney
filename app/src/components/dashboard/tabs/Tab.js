import React from 'react'

const Tab = props => {
  const { name } = props.tab
  const { activeTab, changeActiveTab } = props

  return (
    <li className={name === activeTab ? 'is-active' : undefined} onClick={() => changeActiveTab(name)}>
      <a>
        {/* <span className="icon is-small"><i className="fa fa-image"></i></span> */}
        <span>{name}</span>
      </a>
    </li>
  )
}

export default Tab
