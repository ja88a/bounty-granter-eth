# Bebop Bounty Granter on ETH

## General

Home of the mono repository for the development of the Bebop Bounty Granter Web3 app.


## Purpose

Decentralized handling of contract-based activity payments following their deliverables validation via reviewers and oracles.

More details are available in this project [Wiki](https://github.com/ja88a/bounty-granter/wiki).

This solution is developped in the context of the ETHGlobal [ETHOnline 2022 hackathon](https://ethglobal.com/events/ethonline2022), this project page is available [here](https://ethglobal.com/showcase/funding-granter-sfc1o).


## Status: *Alpha - Work in Progress*


## Installation
### Build tools
Latest stable [Node.js](https://nodejs.org) LTS version `16.x` is used to develop this project. We recommend using the nodejs version manager [nvm](https://github.com/nvm-sh/nvm).

[pnpm](https://pnpm.io/) is used as the main packages manager, along with [yarn](https://yarnpkg.com). You can use yarn only.

If you are not set yet with these tools, use:
```sh
$ npm install -g yarn pnpm
```

### Installation
All yarn worspaces get installed using pnpm:
```sh
$ pnpm -r install
```

You can install the modules individually by using the command:
```sh
packages/X$ pnpm install
```

## Building on-chain
Start a local Hardhat chain: 	``yarn chain``

Generate a deployer address: 	``yarn generate``

View your deployer address: 	``yarn account``

Deploy the contracts: 		    ``yarn deploy``

Verify the deployed contracts: 	``yarn verify``

Use the CLI parameter ``--network X``, e.g. ``yarn deploy --network goerli``, to override the ``defaultNetwork`` set in ``packages/hardhat/hardhat.config.js``.


## Running the Web UI locally
### Dev mode
```sh
$ yarn start
```
OR
```sh
packages/webui$ yarn start
```

### Production build
```sh
packages/webui$ yarn build
packages/webui$ yarn serve # Run locally
```

### Deployment
Deploy the webui/build on [surge.sh](https://surge.sh): 
```sh
yarn surge
```
The generated static web resources can be deployed on [IPFS](https://ipfs.tech/), [Surge](https://surge.sh) or [AWS S3](https://aws.amazon.com/s3/). Refer to dedicated deployment scripts in `packages/webui/package.json`.


## Technical Modules
### General
This mono repo structure and its tooling have been bootstrap by a [scaffold-eth](https://github.com/scaffold-eth/scaffold-eth) boilerplate.

### Front-End
Package: **[webui](./packages/webui)**

A React responsive Web UI based on:
* [Create React App](https://create-react-app.dev/)
* [Material UI](https://mui.com)
* [Tailwind CSS](https://tailwindcss.com/)
* [Wagmi](https://wagmi.sh/)
* [Ethers](https://github.com/ethers-io/ethers.js/)
* [RainbowKit](https://www.rainbowkit.com/)
* and friends: refer to `packages/webui/package.json`.

### Smart Contracts
Package: **[hardhat](./packages/hardhat)**

The EVM-compatible smart contracts are reported there, implemented with Solidity 0.8 and the [HardHart](https://hardhat.org) development environment for building on ETH L1 & L2 chains.

### Subgraph
Package: **[subgraph](./packages/subgraph)**

Home of [The Graph](https://thegraph.com) subgraphes for the automated integration of deployed smart contracts.

### Services
Package: **[services](./packages/services)**

Backend services / nodes for local deployments: data servers & chains


## Integrated Solutions
