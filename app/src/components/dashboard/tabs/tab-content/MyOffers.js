import React, { useEffect, useState } from 'react'
import logo from '../../../../assets/drizzle_logo.png'
import { newContextComponents } from '@drizzle/react-components'
import Section from '../../../Section'
import bigInt from 'big-integer'
import './OffersTable.css'
import humanizeDuration from 'humanize-duration'
import axios from 'axios'
import RdaiJson from '../../../../contracts/RTokenLike'
import WhittJson from '../../../../contracts/WhittMoney'
import DaiJson from '../../../../contracts/IERC20'
import { useToasts } from 'react-toast-notifications'
const { AccountData, ContractData, ContractForm } = newContextComponents
const contract = require('@truffle/contract')
const RdaiContract = contract(RdaiJson)
const DaiContract = contract(DaiJson)

/*
*   {
    id: 0,
    address: '0xc12d1c73ee7dc3615ba4e37e4abfdbddfa38907e',
    creatorAddress: 'asdsad',
    collateral: 10,
    duration: 15778800,
    desiredReward: 1,
    fulfilled: false,
  }
  * */

export default props => {
  const { addToast } = useToasts()
  // destructure drizzle and drizzleState from props
  const { drizzle, drizzleState } = props
  const [offersList, setOffersList] = useState([])
  const [reclaiming, setReclaiming] = useState(false)

  let networkName = drizzleState.web3.networkId === 42 ? 'kovan' : ''
  useEffect(() => {
    async function fetchData() {
      let result = await axios.get('/api/book/')
      if (result.status === 200 && result.data) {
        setOffersList(Object.values(result.data))
      }
    }
    fetchData()
  }, [])

  async function handleClick(whittAddress) {
    if (reclaiming) {
      addToast("We're currently in the process of reclaiming an offer. Please complete this before continuing.", {
        appearance: 'error',
        autoDismiss: true,
      })
      return
    }

    try {
      setReclaiming(true)
      let web3 = drizzle.web3
      let rdaiAddress = '0x462303f77a3f17Dbd95eb7bab412FE4937F9B9CB'

      let rdaiInstance = new web3.eth.Contract(RdaiJson.abi, rdaiAddress)
      let whittInstance = new web3.eth.Contract(WhittJson.abi, whittAddress)

      await whittInstance.methods.fixedExit().send({ from: drizzleState.accounts[0] })
      await rdaiInstance.methods.redeemAll().send({ from: drizzleState.accounts[0] })

      addToast('The order was successfully reclaimed!', {
        appearance: 'success',
        autoDismiss: true,
      })

      setReclaiming(false)
    } catch (err) {
      setReclaiming(false)
      addToast(
        'An error occurred while reclaiming the offer. The contract may still be locked. For more details, see the JavaScript Console.',
        {
          appearance: 'error',
          autoDismiss: true,
          duration: 12000,
        }
      )
      console.error(err)
    }
  }

  return (
    <>
      {offersList.filter(i => i.creatorAddress === drizzleState.accounts[0]).length === 0 && (
        <p>We're either still loading or it doesn't seem that you have created any offers yet.</p>
      )}

      {offersList
        .filter(i => i.creatorAddress === drizzleState.accounts[0])
        .map(i => {
          return (
            <div key={i.id} className="card card-offer">
              <header className="card-header">
                <p className="card-header-title">Offer #{i.id + 1}</p>
              </header>
              <div className="card-content">
                <div className="content">
                  {'Contract: ' + i.address}
                  <br />

                  {'Creator: ' + i.creatorAddress}
                  <br />

                  {'Collateral: ' + i.collateral + ' DAI'}
                  <br />

                  {'Duration: ' + humanizeDuration(i.duration * 1000)}
                  <br />
                  {'Cost: ' + i.desiredReward + ' DAI'}
                </div>
              </div>
              <footer className="card-footer">
                <a
                  href="#"
                  className="card-footer-item"
                  onClick={() => {
                    handleClick(i.address)
                  }}
                >
                  Reclaim Collateral
                </a>
              </footer>
            </div>
          )
        })}
    </>
  )
}
