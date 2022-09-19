
Credits to [scaffold-eth](https://github.com/scaffold-eth/scaffold-eth) for this [Hardhat](https://hardhat.org) development framework integration.


## Hardhat Local Chain

### Run

Starting a local Hardhat node/chain:
```sh
$ yarn chain
```

### Wallet Integration

Adding the local Hardhat chain to your [Metamask] wallet:
```
Network Name: Hardhat
New RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Token: ETH
```

## Contracts Build & Deployment

Generate a contract deployer account: 	``yarn compile``

Generate a contract deployer account: 	``yarn generate``

View your deployer account address: 	``yarn account``

Deploy your contracts: 		            ``yarn deploy``

Verify the deployed contract: 	        ``yarn verify``


## Default Network

Refer to ``defaultNetwork`` set in ``packages/hardhat/hardhat.config.js``.

It is overridden by using the CLI parameter ``--network X``, e.g. ``yarn deploy --network goerli``

