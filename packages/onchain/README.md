

## BountyGranter On-Chain Contracts

Actual Solidity version for the EVM contracts: `0.8.16`

Location: [/contracts](./contracts)

Available contracts:
* Access controllers for allowing access to contract methods or finer grain permissions: 
  * Support for classic ACL
  * Community (DAO) or Committee (sub-DAO) membership validation
  * Role-based verfication of the message sender (committee member) to grant permissions
* Project grants management:
  * [Registry](./contracts/ProjectGrantRegistry.sol) of project grants
  * [Factory](./contracts/ProjectGrantFactory.sol) of project grants for a given committee
  * [Extended ERC721](./contracts/ProjectGrantCollection.sol) collections of non-fungible tokens for the project grants definition
 

## Contracts Build & Deployment

nodejs: `16.x` LTS

Installation:
```sh
pnpm install # or yarn
```

Generate a contract deployer account: 	`yarn compile`

Generate a contract deployer account: 	`yarn generate`

View your deployer account address: 	  `yarn account`

Deploy your contracts: 		              `yarn deploy`

Verify the deployed contract: 	        `yarn verify`

Use the CLI parameter `--network X`, e.g. `yarn deploy --network goerli`, to override the `defaultNetwork` set in the [hardhat.config.js](./hardhat.config.js).

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

## Default Network

Refer to `defaultNetwork` set in [hardhat.config.js](./hardhat.config.js).

It is overridden by using the CLI parameter `--network X`, e.g. `yarn deploy --network goerli`


## Credits

Credits go to [scaffold-eth](https://github.com/scaffold-eth/scaffold-eth) and NomicLabs [Hardhat](https://hardhat.org) for this development, test and integration framework of solidity contracts on Ethereum chains.

[OpenZeppelin contracts](https://github.com/OpenZeppelin/openzeppelin-contracts) are integrated.

Refer to [package.json](./package.json) for the complete list of dependencies this module benefits from.


## License

Distributed under the [Affero General Public License 3.0+ license][license].

<!-- license -->
[license]: LICENSE