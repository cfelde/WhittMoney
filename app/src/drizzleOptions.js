import Web3 from 'web3'

const options = {
  web3: {
    block: false,
    customProvider:
      window.location.href.indexOf('localhaost:3000') !== -1 ? new Web3('ws://localhost:8545') : undefined,
  },
  contracts: [],
}

export default options
