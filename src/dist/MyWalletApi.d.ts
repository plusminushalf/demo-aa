import { BigNumber, BigNumberish } from 'ethers';
import { Signer } from '@ethersproject/abstract-signer';
import { MyWallet, MyWalletDeployer } from './types';
import { BaseApiParams, BaseWalletAPI } from '@account-abstraction/sdk/dist/src/BaseWalletAPI';
/**
 * constructor params, added no top of base params:
 * @param owner the signer object for the wallet owner
 * @param factoryAddress address of contract "factory" to deploy new contracts (not needed if wallet already deployed)
 * @param index nonce value used when creating multiple wallets for the same owner
 */
export interface MyWalletApiParams extends BaseApiParams {
    owner: Signer;
    factoryAddress?: string;
    index?: number;
}
/**
 * An implementation of the BaseWalletAPI using the MyWallet contract.
 * - contract deployer gets "entrypoint", "owner" addresses and "index" nonce
 * - owner signs requests using normal "Ethereum Signed Message" (ether's signer.signMessage())
 * - nonce method is "nonce()"
 * - execute method is "execFromEntryPoint()"
 */
export declare class MyWalletApi extends BaseWalletAPI {
    factoryAddress?: string;
    owner: Signer;
    index: number;
    /**
     * our wallet contract.
     * should support the "execFromEntryPoint" and "nonce" methods
     */
    walletContract?: MyWallet;
    factory?: MyWalletDeployer;
    constructor(params: MyWalletApiParams);
    _getWalletContract(): Promise<MyWallet>;
    /**
     * return the value to put into the "initCode" field, if the wallet is not yet deployed.
     * this value holds the "factory" address, followed by this wallet's information
     */
    getWalletInitCode(): Promise<string>;
    getNonce(): Promise<BigNumber>;
    /**
     * encode a method call from entryPoint to our contract
     * @param target
     * @param value
     * @param data
     */
    encodeExecute(target: string, value: BigNumberish, data: string): Promise<string>;
    signRequestId(requestId: string): Promise<string>;
}
