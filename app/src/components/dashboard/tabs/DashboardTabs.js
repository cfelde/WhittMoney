import React from 'react'
import Tabs from './Tabs'

const ActiveTabContent = props => <div>{props.content}</div>

const tabList = [
  {
    name: 'Offers',
    icon: '',
    content: 'Soon to be a list of offers',
  },
  {
    name: 'Make Offer',
    icon: '',
    content: 'Soon to be a form where you can make offers',
  },
]

class DashboardTabs extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: 'Offers',
    }
  }

  changeActiveTab(tab) {
    this.setState({ activeTab: tab })
  }

  activeTabContent() {
    const activeIndex = tabList.findIndex(tab => {
      return tab.name === this.state.activeTab
    })

    return tabList[activeIndex].content
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <Tabs tabList={tabList} activeTab={this.state.activeTab} changeActiveTab={this.changeActiveTab.bind(this)} />

          <ActiveTabContent key={this.state.activeTab} content={this.activeTabContent()} />
        </div>
      </section>
    )
  }
}

export default DashboardTabs
