[![NodeJs][nodejs-shield]][ref-nodejs]
[![Typescript][typescript-shield]][ref-typescript]
[![Jest][jest-shield]][ref-jest]
[![Yarn][yarn-shield]][ref-yarn]
[![Docker][docker-shield]][ref-docker]
[![Hardhat][hardhat-shield]][ref-docker]

[nodejs-shield]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[typescript-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[jest-shield]: https://img.shields.io/badge/-Jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white
[yarn-shield]: https://img.shields.io/badge/Yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white
[docker-shield]: https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white
[hardhat-shield]: https://img.shields.io/badge/Hardhat-yellow.svg?style=for-the-badge&logo=hardhat&logoColor=white

[ref-nodejs]: https://nodejs.org/
[ref-typescript]: https://www.typescriptlang.org/
[ref-jest]: https://jestjs.io/docs/getting-started
[ref-docker]: https://docs.docker.com
[ref-docker-compose]: https://docs.docker.com
[ref-yarn]: https://yarnpkg.com
[ref-hardhat]: https://hardhat.org


# Bounty Granter on ETH

## General

Home of the mono repository for the development of the Bounty Granter dApp running on Ethereum/EVM chains.


## Purpose

Decentralized contract-based definition and handling of project activities' asset transfers following their deliverables validation via reviewers and oracles.

More details are available in this project [Wiki](https://github.com/ja88a/bounty-granter-eth/wiki).


## Status: *Alpha - Work in Progress*

 

## Dev Framework

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
$ pnpm install
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

Use the CLI parameter ``--network X``, e.g. ``yarn deploy --network goerli``, to override the ``defaultNetwork`` set in ``packages/onchain/hardhat.config.js``.


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


## Modules
### General
This mono repo structure and its tooling have been bootstrap by a [scaffold-eth](https://github.com/scaffold-eth/scaffold-eth) boilerplate.

### Front-End
Package: **[webui](./packages/webui)**

A ReactJS responsive Web app based on:
* [Create React App](https://create-react-app.dev/)
* [Material UI](https://mui.com)
* [Tailwind CSS](https://tailwindcss.com/)
* [Wagmi](https://wagmi.sh/)
* [Ethers](https://github.com/ethers-io/ethers.js/)
* [RainbowKit](https://www.rainbowkit.com/)
* and friends: refer to `packages/webui/package.json`.

### Smart Contracts
Package: **[onchain](./packages/onchain)**

The EVM-compatible smart contracts are reported there, implemented with Solidity 0.8 and the [HardHart](https://hardhat.org) development framework for building on ETH L1 & L2 blockchains.

### Subgraph
Package: **[subgraph](./packages/subgraph)**

Home of [The Graph](https://thegraph.com) subgraphes for the automated integration of deployed smart contracts.

### Services
Package: **[services](./packages/services)**

Backend services / nodes for local deployments: data servers & chains


## Integrated Solutions

Refer to this [wiki page](https://github.com/ja88a/bounty-granter-eth/wiki/Technical-Insights#on-chain-main-contracts--integration-of-partner-solutions) for an overview.


## License

Distributed under the [Affero General Public License 3.0+ license][license].

<!-- license -->
[license]: LICENSE


## Contact

[Jabba 01][author-email]

[![Github][github-shield]][author-github]
<!--[![LinkedIn][linkedin-shield]][author-linkedin]-->

[github-shield]: https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white
[linkedin-shield]: https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white

[author-linkedin]: https://linkedin.com/in/srenault
[author-email]: mailto:contact@srenault.com
[author-github]: https://github.com/ja88a
