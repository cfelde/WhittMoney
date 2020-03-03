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
  const [acceptingOffer, setAcceptingOffer] = useState(false)

  useEffect(() => {
    async function fetchData() {
      let result = await axios.get('/api/book/')
      if (result.status === 200 && result.data) {
        setOffersList(Object.values(result.data))
      }
    }
    fetchData()
  }, [])

  async function handleClick(offerId, whittAddress) {
    if (acceptingOffer) {
      addToast("We're currently in the process of fulfilling an offer. Please complete this before continuing.", {
        appearance: 'error',
      })
      return
    }

    try {
      setAcceptingOffer(true)
      let utils = drizzle.web3.utils
      let web3 = drizzle.web3
      let daiAddress =
        drizzleState.web3.networkId === 42
          ? '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'
          : '0x6B175474E89094C44Da98b954EedeAC495271d0F'

      let daiInstance = new web3.eth.Contract(DaiJson.abi, daiAddress)
      let whittInstance = new web3.eth.Contract(WhittJson.abi, whittAddress)
      console.log(daiInstance)
      console.log('Rdai instance:')
      await daiInstance.methods
        .approve(whittAddress, utils.toBN('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'))
        .send({ from: drizzleState.accounts[0] })

      await whittInstance.methods.floatEnter().send({ from: drizzleState.accounts[0] })

      const fulfillOrderReq = await axios.post(
        '/api/order/fulfill',
        { orderId: offerId },
        { headers: { 'Content-Type': 'application/json' } }
      )

      if (fulfillOrderReq.status === 200) {
        setAcceptingOffer(false)
        addToast('The order was successfully fulfilled!', {
          appearance: 'success',
        })
      } else {
        addToast('The order was fulfilled but we failed to update the server side.', {
          appearance: 'error',
          duration: 12000,
        })
        setAcceptingOffer(false)
      }
    } catch (err) {
      setAcceptingOffer(false)
      addToast('An error occurred while accepting the offer. For more details, see the JavaScript Console.', {
        appearance: 'error',
        duration: 12000,
      })
      console.error(err)
    }
  }

  return (
    <>
      {offersList.filter(i => !i.fulfilled).length === 0 && (
        <p>We're either still loading or it doesn't seem that there are any offers yet.</p>
      )}

      {offersList
        .filter(i => !i.fulfilled)
        .map(i => {
          return (
            <div key={i.id} className="card card-offer">
              <header className="card-header">
                <p className="card-header-title">Offer #{i.id + 1}</p>
              </header>
              <div className="card-content">
                <div className="content">
                  <p>
                    Contract Address:{' '}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={'https://kovan.etherscan.io/address/' + i.address}
                    >
                      {i.address}
                    </a>
                  </p>
                  <p>
                    Creator:{' '}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={'https://kovan.etherscan.io/address/' + i.creatorAddress}
                    >
                      {i.creatorAddress}
                    </a>
                  </p>
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
                    handleClick(i.id, i.address)
                  }}
                >
                  Fill Order
                </a>
              </footer>
            </div>
          )
        })}
    </>
  )
}
