//import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, sepolia, WagmiConfig } from 'wagmi';
import { polygon, mainnet, optimism, hardhat, optimismGoerli, polygonMumbai,  } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import React from 'react';

const { chains, provider, webSocketProvider } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    ...(process.env.TESTNETS_ENABLE === 'true'
      ? [hardhat, sepolia, polygonMumbai, optimismGoerli]
      : []),
  ],
  [
    alchemyProvider({
      apiKey: process.env.ALCHEMY_APIKEY ? process.env.ALCHEMY_APIKEY : 'MISSING_ENV_ALCHEMY_APIKEY',
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Bounty Granter',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export default function WalletRainbowKit(): JSX.Element {

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        {/* <Container id='AppRoot'/> */}
      </RainbowKitProvider>
    </WagmiConfig>
  );
  
};