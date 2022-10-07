import { expect } from 'chai'
import { EntryPoint, EntryPoint__factory } from '@account-abstraction/contracts'
import { ethers } from 'hardhat'
import { HttpRpcClient } from '@account-abstraction/sdk/dist/src/HttpRpcClient'
import { ERC4337EthersProvider } from '@account-abstraction/sdk'
import { MyWalletApi } from '../src'

/** Contracts deployed on goerli network */
const GREETER_ADDR = '0x932C1dA6feD0Efa30AAA5358F34bEEB3f6281B3b'
const ENTRYPOINT_ADDR = '0x2167fA17BA3c80Adee05D98F0B55b666Be6829d6'

describe('MyWallet', async function () {
  const originalProvider = ethers.provider
  const orignalSigner = originalProvider.getSigner()
  const network = await originalProvider.getNetwork()

  const entryPointAddress = ENTRYPOINT_ADDR

  const providerConfig = {
    entryPointAddress,
    bundlerUrl: 'https://eip4337-bundler-goerli.protonapp.io/rpc',
    chainId: network.chainId,
  }

  const entryPoint = EntryPoint__factory.connect(providerConfig.entryPointAddress, originalProvider)

  /** THis is where we create our custom Wallet */

  const MyWalletDeployer__factory = await ethers.getContractFactory('MyWalletDeployer', orignalSigner)

  const MyWalletDeployer = await MyWalletDeployer__factory.deploy()
  const factoryAddress = MyWalletDeployer.address
  console.log(MyWalletDeployer.address)

  const ownerAddress = await orignalSigner.getAddress()

  const walletAddress = await MyWalletDeployer.getDeploymentAddress(entryPointAddress, ownerAddress, 0)

  const smartWalletAPI = new MyWalletApi({
    provider: originalProvider,
    entryPointAddress: entryPoint.address,
    walletAddress,
    owner: orignalSigner,
    factoryAddress,
  })

  /** This marks the end of creation of our custom wallet api */

  const httpRpcClient = new HttpRpcClient(providerConfig.bundlerUrl, providerConfig.entryPointAddress, network.chainId)

  const aaProvier = await new ERC4337EthersProvider(
    providerConfig,
    orignalSigner,
    originalProvider,
    httpRpcClient,
    entryPoint,
    smartWalletAPI
  ).init()

  const aaSigner = aaProvier.getSigner()
})
