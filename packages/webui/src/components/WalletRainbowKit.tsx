//import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import React from 'react';

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.mainnet,
    chain.polygon,
    chain.optimism,
    ...(process.env.TESTNETS_ENABLE === 'true'
      ? [chain.hardhat, chain.goerli, chain.polygonMumbai, chain.optimismGoerli]
      : []),
  ],
  [
    alchemyProvider({
      apiKey: process.env.ALCHEMY_APIKEY,
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