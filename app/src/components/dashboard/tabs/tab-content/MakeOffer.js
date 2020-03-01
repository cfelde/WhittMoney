import React, { useState } from 'react'
import logo from '../../../../assets/drizzle_logo.png'
import { newContextComponents } from '@drizzle/react-components'
import Section from '../../../Section'
import WhittMoney from '../../../../contracts/WhittMoney.json'
const contract = require('@truffle/contract')
const { AccountData, ContractData, ContractForm } = newContextComponents
const WhittMoneyContract = contract(WhittMoney)

export default props => {
  // destructure drizzle and drizzleState from props
  const { drizzle, drizzleState } = props
  const [sliderValue, setSliderValue] = useState(50)

  async function handleClick(e) {
    e.preventDefault()
    let utils = drizzle.web3.utils
    let web3 = drizzle.web3
    WhittMoneyContract.setProvider(web3.currentProvider)

    console.log(WhittMoneyContract)

    let inst = await WhittMoneyContract.new(
      '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
      '0x462303f77a3f17Dbd95eb7bab412FE4937F9B9CB',
      utils.toWei('0.1'),
      60 * 5,
      utils.toWei('0.01'),
      { from: drizzleState.accounts[0], gasLimit: 3000000 }
    )

    console.log(inst)
  }

  return (
    <>
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">Make an Offer</p>
        </header>
        <div className="card-content">
          <div className="content">
            <div className="field">
              <label className="label">Value to lock (DAI):</label>
              <div className="control">
                <input className="input" type="text" placeholder="Text input" />
              </div>
            </div>

            <div className="field">
              <label className="label">Duration:</label>
              <div className="control">
                <div className="select">
                  <select>
                    <option>3 months</option>
                    <option>6 months</option>
                    <option>9 months</option>
                    <option>12 months</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Desired Return:</label>
            </div>
            <input
              className="slider is-fullwidth"
              step="1"
              min="0"
              max="100"
              value={sliderValue}
              type="range"
              onChange={ev => {
                setSliderValue(ev.target.value)
              }}
            />
          </div>
        </div>
        <footer className="card-footer">
          <a onClick={handleClick} className="card-footer-item">
            Create Contract
          </a>
        </footer>
      </div>
    </>
  )
}
