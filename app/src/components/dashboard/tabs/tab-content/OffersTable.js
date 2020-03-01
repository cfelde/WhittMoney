import React from 'react'
import logo from '../../../../assets/drizzle_logo.png'
import { newContextComponents } from '@drizzle/react-components'
import Section from '../../../Section'
import bigInt from 'big-integer'
import './OffersTable.css'
import humanizeDuration from 'humanize-duration'
const { AccountData, ContractData, ContractForm } = newContextComponents

const offersList = [
  {
    id: 1,
    collateral: bigInt('1000000000000000000000'),
    duration: 15778800,
    value: bigInt('6000000000000000000'),
    contractAddress: '0xc12d1c73ee7dc3615ba4e37e4abfdbddfa38907e',
    fulfilled: false,
  },
  {
    id: 2,
    collateral: bigInt('1000000000000000000000'),
    duration: 7889400,
    value: bigInt('3000000000000000000'),
    contractAddress: '0xcc4d1cd3ee7dc3615ba4e37e4abfdbddfa38812f',
    fulfilled: false,
  },
]

export default props => {
  // destructure drizzle and drizzleState from props
  const { drizzle, drizzleState } = props
  return (
    <>
      {offersList.map(i => {
        return (
          <div className="card card-offer">
            <header className="card-header">
              <p className="card-header-title">Offer #{i.id}</p>
            </header>
            <div className="card-content">
              <div className="content">
                {'Collateral: ' + i.collateral.divide('1000000000000000000').toString() + ' DAI'}
                <br />
                {'Contract: ' + i.contractAddress}
                <br />
                {'Duration: ' + humanizeDuration(i.duration * 1000)}
                <br />
                {'Value: ' + i.value.divide('1000000000000000000').toString() + ' DAI'}
              </div>
            </div>
            <footer className="card-footer">
              <a href="#" className="card-footer-item">
                Fill Order
              </a>
            </footer>
          </div>
        )
      })}
    </>
  )
}
