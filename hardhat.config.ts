import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: {
    mumbai: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/YdsNfZkPMSAefI7wwCnBFfXK0ZRz2F-k',
      chainId: 137,
    },
  },
}

export default config
