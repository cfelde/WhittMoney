import React, { useState } from 'react'
import WhittMoneyJson from '../../../../contracts/WhittRDaiMoney.json'
import DaiJson from '../../../../contracts/IERC20.json'
import RdaiJson from '../../../../contracts/RTokenLike.json'
import { useToasts } from 'react-toast-notifications'
import axios from 'axios'
const contract = require('@truffle/contract')
const WhittMoneyContract = contract(WhittMoneyJson)

export default props => {
  // destructure drizzle and drizzleState from props
  const { drizzle, drizzleState } = props
  const [desiredReward, setDesiredReward] = useState(0)
  const [daiToStake, setDaiToStake] = useState(0)
  const [duration, setDuration] = useState(7889400)
  const [deploying, setDeploying] = useState(false)
  const { addToast } = useToasts()

  const updateStateValue = (e, func) => {
    try {
      const result = e.target.value.length ? parseInt(e.target.value) : ''
      if (!isNaN(result)) {
        func(result)
        return
      }
    } catch (err) {}
    func('')
  }

  async function handleClick(e) {
    e.preventDefault()

    if (desiredReward === 0 || daiToStake === 0) {
      addToast('You need to set a desired reward & an amount to stake before offer creation.', {
        appearance: 'error',
      })
      return
    }
    if (desiredReward * 2 >= daiToStake) {
      addToast('Reward should be less than half of the DAI to stake.', {
        appearance: 'error',
      })
      return
    }
    if (deploying) {
      addToast(
        "We're currently in the process of creating an offer. Please allow this to finish or refresh the page to create a new one.",
        {
          appearance: 'error',
        }
      )

      return
    }

    try {
      setDeploying(true)
      addToast(
        "Now attempting to create your offer. Please note that you'll have to validate several transactions in MetaMask during this process.",
        {
          appearance: 'info',
        }
      )

      let utils = drizzle.web3.utils
      let web3 = drizzle.web3
      let daiAddress =
        drizzleState.web3.networkId === 42
          ? '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'
          : '0x6B175474E89094C44Da98b954EedeAC495271d0F'
      let rdaiAddress =
        drizzleState.web3.networkId === 42
          ? '0x462303f77a3f17Dbd95eb7bab412FE4937F9B9CB'
          : '0x261b45D85cCFeAbb11F022eBa346ee8D1cd488c0'
      WhittMoneyContract.setProvider(web3.currentProvider)

      let whittInstance = await WhittMoneyContract.new(
        daiAddress,
        rdaiAddress,
        utils.toWei(daiToStake.toString()),
        duration,
        utils.toWei(desiredReward.toString()),
        { from: drizzleState.accounts[0], gas: 2000000 }
      )

      console.log(whittInstance)

      let rdaiInstance = new web3.eth.Contract(RdaiJson.abi, rdaiAddress)
      let daiInstance = new web3.eth.Contract(DaiJson.abi, daiAddress)
      console.log(daiInstance)
      console.log('Rdai instance:')
      console.log(rdaiInstance)
      await daiInstance.methods
        .approve(
          whittInstance.address,
          utils.toBN('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
        )
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

      const createOrderReq = await axios.post(
        '/api/order/',
        {
          address: whittInstance.address,
          collateral: daiToStake,
          desiredReward: desiredReward,
          duration: duration,
          creatorAddress: drizzleState.accounts[0],
          fulfilled: false,
        },
        { headers: { 'Content-Type': 'application/json' } }
      )

      if (createOrderReq.status === 200) {
        setDeploying(false)
        addToast('Your order was successfully created!', {
          appearance: 'success',
        })
      } else {
        addToast('The contract was deployed but server communication failed. Please try again.', {
          appearance: 'error',
          duration: 12000,
        })
        setDeploying(false)
      }
    } catch (err) {
      setDeploying(false)
      if (err.toString().indexOf("The contract code couldn't be stored") !== -1) {
        addToast(
          'A specific known MetaMask bug was encountered. In this instance, please try again immediately. Several attempts may be necessary but creation will succeed.',
          {
            appearance: 'warning',
          }
        )
      } else {
        addToast('An error occurred while creating your offer. For more details, see the JavaScript Console.', {
          appearance: 'error',
          duration: 12000,
        })
      }
      console.error(err)
    }
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
                <input
                  className="input"
                  type="text"
                  inputMode="numeric"
                  placeholder="A number of DAI"
                  value={daiToStake}
                  onChange={e => updateStateValue(e, setDaiToStake)}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Duration:</label>
              <div className="control">
                <div className="select">
                  <select value={duration} onChange={e => updateStateValue(e, setDuration)}>
                    <option value="7889400">3 months</option>
                    <option value="15778800">6 months</option>
                    <option value="23668200">9 months</option>
                    <option value="31557600">12 months</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Desired Return ({desiredReward} DAI):</label>
            </div>
            <input
              className="slider is-fullwidth"
              step="1"
              min="0"
              max={daiToStake > 2 ? Math.ceil(daiToStake / 2) : 0}
              value={desiredReward}
              type="range"
              onChange={e => updateStateValue(e, setDesiredReward)}
            />
          </div>
        </div>
        <footer className="card-footer">
          <a onClick={handleClick} className="card-footer-item">
            Create Offer
          </a>
        </footer>
      </div>
    </>
  )
}
