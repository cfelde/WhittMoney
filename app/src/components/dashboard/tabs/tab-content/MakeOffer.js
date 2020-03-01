import React, { useState } from 'react'
import logo from '../../../../assets/drizzle_logo.png'
import { newContextComponents } from '@drizzle/react-components'
import Section from '../../../Section'
import WhittMoneyJson from '../../../../contracts/WhittMoney.json'
import DaiJson from '../../../../contracts/IERC20.json'
import RdaiJson from '../../../../contracts/RTokenLike.json'
const contract = require('@truffle/contract')
const { AccountData, ContractData, ContractForm } = newContextComponents
const WhittMoneyContract = contract(WhittMoneyJson)
const RdaiContract = contract(RdaiJson)
const DaiContract = contract(DaiJson)

export default props => {
  // destructure drizzle and drizzleState from props
  const { drizzle, drizzleState } = props
  const [sliderValue, setSliderValue] = useState(50)

  async function handleClick(e) {
    e.preventDefault()
    let utils = drizzle.web3.utils
    let web3 = drizzle.web3
    let daiAddress = '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'
    let rdaiAddress = '0x462303f77a3f17Dbd95eb7bab412FE4937F9B9CB'
    WhittMoneyContract.setProvider(web3.currentProvider)

    let whittInstance = await WhittMoneyContract.new(
      daiAddress,
      rdaiAddress,
      utils.toWei('1'),
      60 * 1,
      utils.toWei('0.1'),
      { from: drizzleState.accounts[0], gas: 2000000 }
    )

    console.log(whittInstance)

    let rdaiInstance = new web3.eth.Contract(RdaiJson.abi, rdaiAddress)
    let daiInstance = new web3.eth.Contract(DaiJson.abi, daiAddress)
    console.log(daiInstance)
    console.log('Rdai instance:')
    console.log(rdaiInstance)
    await daiInstance.methods
      .approve(whittInstance.address, utils.toBN('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'))
      .send({ from: drizzleState.accounts[0] })

    console.log(
      'Spender approved: ' +
        (
          await daiInstance.methods
            .allowance(drizzleState.accounts[0], whittInstance.address)
            .call({ from: drizzleState.accounts[0] })
        ).toString(16)
    )

    await whittInstance.init({ from: drizzleState.accounts[0] })
    console.log('Ready..')
    await whittInstance.floatEnter({ from: drizzleState.accounts[0] })

    await new Promise(r => setTimeout(r, 70000))

    await whittInstance.fixedExit({ from: drizzleState.accounts[0] })
    await rdaiInstance.methods.redeemAll().send({ from: drizzleState.accounts[0] })

    console.log('Done..')
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
