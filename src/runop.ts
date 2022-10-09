import { expect } from 'chai'
import { EntryPoint, EntryPoint__factory } from '@account-abstraction/contracts'
import { ethers } from 'hardhat'
import { HttpRpcClient } from '@account-abstraction/sdk/dist/src/HttpRpcClient'
import { ERC4337EthersProvider } from '@account-abstraction/sdk'
import { MyWalletApi } from '.'

/** Contracts deployed on goerli network */
const ENTRYPOINT_ADDR = '0x1b98F08dB8F12392EAE339674e568fe29929bC47'

const runop = async () => {
  console.log('--- starting runop ---')
  const originalProvider = ethers.provider
  const orignalSigner = originalProvider.getSigner()
  const network = await originalProvider.getNetwork()

  const entryPointAddress = ENTRYPOINT_ADDR

  const providerConfig = {
    entryPointAddress,
    bundlerUrl: 'https://eip4337-bundler-goerli.protonapp.io/rpc',
    chainId: network.chainId,
  }

  console.log('--- entryPoint initialisation ---')
  const entryPoint = EntryPoint__factory.connect(providerConfig.entryPointAddress, originalProvider)

  /** Deploy greeter to test */
  console.log('--- deploying Greeter contract ---')
  const Greeter_factory = await ethers.getContractFactory('Greeter', orignalSigner)
  const Greeter = await Greeter_factory.deploy()
  await Greeter.deployTransaction.wait()
  console.log('Greeter Address: ', Greeter.address)
  console.log('--- end deploying Greeter contract ---')
  /** End Deploy greeter to test */

  /** THis is where we create our custom Wallet */
  console.log('--- deploying MyWalletDeployer contract ---')

  const MyWalletDeployer__factory = await ethers.getContractFactory('MyWalletDeployer', orignalSigner)

  const MyWalletDeployer = await MyWalletDeployer__factory.deploy()
  await MyWalletDeployer.deployTransaction.wait()
  const factoryAddress = MyWalletDeployer.address

  console.log('Factory address:', factoryAddress)

  const ownerAddress = await orignalSigner.getAddress()

  const walletAddress = await MyWalletDeployer.getDeploymentAddress(entryPointAddress, ownerAddress, 0)
  console.log('--- end deploying MyWalletDeployer contract ---')

  const smartWalletAPI = new MyWalletApi({
    provider: originalProvider,
    entryPointAddress: entryPoint.address,
    walletAddress,
    owner: orignalSigner,
    factoryAddress,
  })

  /** This marks the end of creation of our custom wallet api */
  console.log('--- Erc4337EthersProvider initialisation ---')

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

  console.log('SCW address: ', await aaSigner.getAddress())

  Greeter.connect(aaSigner)

  const tx = await Greeter.addGreet({
    value: ethers.utils.parseEther('0'),
  })

  await tx.wait()

  console.log(tx, '=====')
}

runop()
  .then(() => console.log('--- done ---'))
  .catch((e) => console.log(e))
