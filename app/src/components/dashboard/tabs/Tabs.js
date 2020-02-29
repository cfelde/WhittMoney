import React from 'react'
import Tab from './Tab'

class Tabs extends React.Component {
  render() {
    return (
      <div className="tabs">
        <ul>
          {this.props.tabList.map(tab => (
            <Tab
              tab={tab}
              key={tab.name}
              activeTab={this.props.activeTab}
              changeActiveTab={this.props.changeActiveTab}
            />
          ))}
        </ul>
      </div>
    )
  }
}

export default Tabs
