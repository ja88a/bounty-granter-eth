# Bounty Granter Web3 front-end

## How to use

### Install
Install it and run:

```sh
pnpm install # or yarn
yarn start
```

### Prod build
Build for production:

```sh
yarn build
yarn serve # Run locally
```

### Deployment
Deploy the webui/build on [surge.sh](https://surge.sh): 
```sh
yarn surge
```
The generated static web resources can be deployed on [IPFS](https://ipfs.tech/), [Surge](https://surge.sh) or [AWS S3](https://aws.amazon.com/s3/). 

Refer to dedicated deployment scripts in [package.json](./package.json).


## Integrated Dev Tools

A React responsive Web UI based on:
* [Create React App](https://create-react-app.dev/)
* [Material UI](https://mui.com)
* [Tailwind CSS](https://tailwindcss.com/)
* [Wagmi](https://wagmi.sh/)
* [Ethers](https://github.com/ethers-io/ethers.js/)
* [RainbowKit](https://www.rainbowkit.com/)
* and friends: see [package.json](./package.json).

This web front-end is based on [React](https://github.com/facebookincubator/create-react-app), using [Tailwind CSS](https://tailwindcss.com/) together with [MaterialUI](https://mui.com), including `emotion`.

Refer to [package.son](./package.json) for a complete review of dependencies.

## Integrated Solutions

### Wagmi
React Hooks for Ethereum 

Repo: [wagmi-dev / wagmi](https://github.com/wagmi-dev/wagmi)

### RainbowKit Wallet

### Āut ID
**d-Āut** is a Decentralized Authentication System for DAOs, part of the [Āut protocol](https://docs.aut.id).

Documentation:
* [node package](https://npmjs/package/@aut-protocol/d-aut)
* [dev doc](https://docs.aut.id/v2/for-devs/integrate-web-component)

### Ethers JS
The ethers.js library aims to be a complete and compact library for interacting with the Ethereum Blockchain and its ecosystem.

Site: https://ethers.org

Repo: https://github.com/ethers-io/ethers.js

Doc: https://docs.ethers.io


### eth-sdk
Type-safe, lightweight SDKs for Ethereum smart contracts.

Repository: [dethcrypto / eth-sdk](https://github.com/dethcrypto/eth-sdk)



## License

Distributed under the [GNU Alfero GPL 3.0 or later][license].

<!-- license -->
[license]: LICENSE