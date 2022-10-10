import { BigNumber, BigNumberish } from 'ethers'

import { arrayify, hexConcat } from 'ethers/lib/utils'
import { Signer } from '@ethersproject/abstract-signer'
import { MyWallet, MyWalletDeployer, MyWalletDeployer__factory, MyWallet__factory } from './types'
import { BaseApiParams, BaseWalletAPI } from '@account-abstraction/sdk/dist/src/BaseWalletAPI'
import { SimpleWalletAPI } from '@account-abstraction/sdk'

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
export class MyWalletApi extends SimpleWalletAPI {
  constructor(params: MyWalletApiParams) {
    super(params)
  }

  /**
   *
   * @param requestId - the has that your wallet must sign
   * @returns the string that will used in userOp.signature & will be send to validateUserOp in your wallet's function
   */
  async signRequestId(requestId: string): Promise<string> {
    return await this.owner.signMessage(arrayify(requestId))
  }
}
