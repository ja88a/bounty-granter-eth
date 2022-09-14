# Bebop Bounty Granter

## General

Home of the mono repository for the development of the Bebop Bounty Granter Web3 app.


## Purpose

Decentralized handling of contract-based activity payments following their deliverables validation via reviewers and oracles.

This project is about enabling:
1. Project initiators and sub-DAO/committees propose development projects of any types. Extended ERC721 contracts define the project deliverables, conditions and/or completion criteria.
2. Funds are allocated to project contracts once corresponding proposal is approved by their funding DAO community.
3. Reviewers validate the achieved work, evaluate and rate produced artefacts. Reviews can be publicly disputed and conflicts escalated for DAO voting.
4. Grantees can iteratively unlock/withdraw assets. Billed amounts are possibly rated per deliverables' completion level.
5. Projects funds are managed by an onchain treasury. Stalled funds are deposited to earn yields and redistribute benefits
6. Funds left-over are automatically or manually returned to the owwning DAO once projects are closed by reviewers.

More details are available in this project [Wiki](https://github.com/ja88a/bounty-granter/wiki).

This solution is developped in the context of the ETHGlobal [ETHOnline 2022 hackathon](https://ethglobal.com/events/ethonline2022), this project page is available [here](https://ethglobal.com/showcase/funding-granter-sfc1o).


## Status: *Alpha - Work in Progress*


## Installation
### Build tools
Latest stable [Node.js](https://nodejs.org) LTS version 16 has been used to develop this project. We recommend using the nodejs version manager [nvm](https://github.com/nvm-sh/nvm).

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
packages/webui$ pnpm install
```

## Running the Web UI locally
### Dev mode
```sh
$ yarn start
```
OR
```sh
packages/webui$ yarn start
```

### Production mode
```sh
packages/webui$ yarn build
packages/webui$ yarn serve
```


## Technical Modules
### General
This mono repo structure has been initiated from a [scaffold-eth](https://github.com/scaffold-eth/scaffold-eth) boilerplate.

### Front-End
Package: **[bg-webui](./packages/bg-webui)**

A React responsive Web UI based on , Wagmi, Ethers, create-react-app, Material UI, Tailwind CSS.

The generated static web resources can be deployed on [Surge](https://surge.sh), AWS S3 or IPFS.

### Smart Contracts
Package: **[hardhat](./packages/hardhat)**

The EVM compatible smart contracts are reported there, implemented with Solidity and the [HardHart](https://hardhat.org) development environment for building on ETH L1 & L2 chains.

### Subgraph
Package: **[subgraph](./packages/subgraph)**

Home of [The Graph](https://thegraph.com) subgraphes for the the automated integration of deployed smart contracts.

### Services
Package: **[services](./packages/services)**

Backend services / nodes for local deployments: data servers & chains


## Integrated Solutions
