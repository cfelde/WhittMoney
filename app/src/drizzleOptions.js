import Web3 from 'web3'
import SimpleStorage from './contracts/SimpleStorage.json'
import ComplexStorage from './contracts/ComplexStorage.json'
import TutorialToken from './contracts/TutorialToken.json'

const options = {
  web3: {
    block: false,
    customProvider: window.location.href.indexOf('localhost:3000') !== -1 ? new Web3('ws://localhost:8545') : undefined,
  },
  contracts: [SimpleStorage, ComplexStorage, TutorialToken],
  events: {
    SimpleStorage: ['StorageSet'],
  },
}

export default options
