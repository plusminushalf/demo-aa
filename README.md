# Create Custom SCW



### How to set up the bundler?

- First clone the repo `https://github.com/eth-infinitism/bundler.git`.

- Now install all the modules in the root directory `budler/` by doing:
```shell 
yarn
```

- Then we need to build individual packages and resolve dependancy issues. For this first create a file `testnet-mnemonic.txt` and paste your private key inside it. Now in the terminal:
```shell
MNEMONIC_FILE=<path-to-mnemonic> yarn preprocess
```

- Now replace the mneumonic present at `packages/bundler/localconfig/mnemonic.txt` with your private key.

- We also need to configure the `bundler.config.json` at `packages/bundler/localconfig/bundler.config.json` with the following changes:
```shell
{
  "mnemonic": "./localconfig/mnemonic.txt",
  "network": "goerli",
  "beneficiary": "<YOUR_PUBLIC_KEY>",
  "port": "3000",
  "helper": "0x214fadBD244c07ECb9DCe782270d3b673cAD0f9c",
  "entryPoint": "<YOUR_ENTRY_POINT_ADDRESS>",
  "minBalance": "0",
  "gasFactor": "1"
}
```

-  As we have changed the mnemonic to private key, we need to make some changes to incoporate this:
    - We need to make changes in the `hardhat.config.ts` present inside `/bundler` package. Replace the `accounts` in `getNetwork` with:
    ```shell
        accounts: [mnemonic]
    ```
    - In the `packages/bundler/src/runBundler.ts` file we need to change two things. First, we should change the provider by giving a ethers JsonRpcProvider as follows:
        ```shell
        const provider: BaseProvider =
            // eslint-disable-next-line
            config.network === 'hardhat' ? require('hardhat').ethers.provider :
            new ethers.providers.JsonRpcProvider(`https://NETWORK.infura.io/v3/YOUR_INFURA_ID`)
      ```
      Now we need to change the Wallet which is extracted from mneunomic to a one extracted from private key:
        ```shell
        wallet = new Wallet(mnemonic, provider);
        ```
- Now you can start the bundler:
```shell
INFURA_ID=<YOUR_INFURA_ID> yarn run bundler
```

You can add your INFURA_ID in the hardhat.config.ts `infuraUrl` instead of passing it in command line

### Prepare Demo-AA repositry

- First install the dependancies
```shell
yarn
```

- Now we need to prepack the contracts. First create a ```testnet-mnemonic.txt``` in the root and place your private key inside it. This compiles the SCW & places the types in `src/` folder

```shell
MNEMONIC_FILE=testnet-mnemonic.txt yarn prepack
```

- The default timeout interval is too low so we need to increase it. In the file ```node_modules/@account-abstraction/sdk/dist/src/UserOperationEventListener.js``` increase the ```DEFAULT_TRANSACTION_TIMEOUT``` value by 100 times.

- If you are running your local bundler replace the bundler url in runop.ts with it. 

- Run the runOp file to test the SCW
```shell
INFURA_ID=<infura-id> MNEMONIC_FILE=<file-containing-private-key> yarn runop --network goerli
```
