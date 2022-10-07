import { BigNumber, BigNumberish } from 'ethers'

import { arrayify, hexConcat } from 'ethers/lib/utils'
import { Signer } from '@ethersproject/abstract-signer'
import { MyWallet, MyWalletDeployer, MyWalletDeployer__factory, MyWallet__factory } from './types'
import { BaseApiParams, BaseWalletAPI } from '@account-abstraction/sdk/dist/src/BaseWalletAPI'

/**
 * constructor params, added no top of base params:
 * @param owner the signer object for the wallet owner
 * @param factoryAddress address of contract "factory" to deploy new contracts (not needed if wallet already deployed)
 * @param index nonce value used when creating multiple wallets for the same owner
 */
export interface MyWalletApiParams extends BaseApiParams {
  owner: Signer
  factoryAddress?: string
  index?: number
}

/**
 * An implementation of the BaseWalletAPI using the MyWallet contract.
 * - contract deployer gets "entrypoint", "owner" addresses and "index" nonce
 * - owner signs requests using normal "Ethereum Signed Message" (ether's signer.signMessage())
 * - nonce method is "nonce()"
 * - execute method is "execFromEntryPoint()"
 */
export class MyWalletApi extends BaseWalletAPI {
  factoryAddress?: string
  owner: Signer
  index: number

  /**
   * our wallet contract.
   * should support the "execFromEntryPoint" and "nonce" methods
   */
  walletContract?: MyWallet

  factory?: MyWalletDeployer

  constructor(params: MyWalletApiParams) {
    super(params)
    this.factoryAddress = params.factoryAddress
    this.owner = params.owner
    this.index = params.index ?? 0
  }

  async _getWalletContract(): Promise<MyWallet> {
    if (this.walletContract == null) {
      this.walletContract = MyWallet__factory.connect(await this.getWalletAddress(), this.provider)
    }
    return this.walletContract
  }

  /**
   * return the value to put into the "initCode" field, if the wallet is not yet deployed.
   * this value holds the "factory" address, followed by this wallet's information
   */
  async getWalletInitCode(): Promise<string> {
    if (this.factory == null) {
      if (this.factoryAddress != null && this.factoryAddress !== '') {
        this.factory = MyWalletDeployer__factory.connect(this.factoryAddress, this.provider)
      } else {
        throw new Error('no factory to get initCode')
      }
    }
    return hexConcat([
      this.factory.address,
      this.factory.interface.encodeFunctionData('deployWallet', [
        this.entryPointAddress,
        await this.owner.getAddress(),
        this.index,
      ]),
    ])
  }

  async getNonce(): Promise<BigNumber> {
    if (await this.checkWalletPhantom()) {
      return BigNumber.from(0)
    }
    const walletContract = await this._getWalletContract()
    return await walletContract.nonce()
  }

  /**
   * encode a method call from entryPoint to our contract
   * @param target
   * @param value
   * @param data
   */
  async encodeExecute(target: string, value: BigNumberish, data: string): Promise<string> {
    const walletContract = await this._getWalletContract()
    return walletContract.interface.encodeFunctionData('execFromEntryPoint', [target, value, data])
  }

  async signRequestId(requestId: string): Promise<string> {
    return await this.owner.signMessage(arrayify(requestId))
  }
}
