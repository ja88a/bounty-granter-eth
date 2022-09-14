import * as React from 'react';
import Container from '@mui/material/Container';
import ResponsiveAppBar from './components/AppBar';
import Slider from '@mui/material/Slider';
import PopoverMenu from './components/PopoverMenu';
import ProTip from './components/ProTip';
import Copyright from './components/Copyright';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, chain, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.mainnet,
    chain.polygon,
    chain.optimism,
    chain.arbitrum,
    ...(process.env.REACT_APP_TESTNETS_ENABLE === 'true'
      ? [chain.hardhat, chain.goerli, chain.polygonMumbai, chain.optimismGoerli]
      : []),
  ],
  [
    alchemyProvider({
      apiKey: process.env.REACT_APP_ALCHEMY_APIKEY,
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

export default function App() {
  if (process.env.REACT_APP_DEBUG === 'true')
    console.log("Alchemy="+process.env.REACT_APP_ALCHEMY_APIKEY +"\nTestnets="+process.env.REACT_APP_TESTNETS_ENABLE);
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Container id='AppRootContainer'>
          <ResponsiveAppBar />
          <div className="my-4">
            <Slider
              className="my-4"
              defaultValue={30}
              classes={{ active: 'shadow-none' }}
              componentsProps={{ thumb: { className: 'hover:shadow-none' } }}
            />
            <PopoverMenu />
            <ProTip />
            <Copyright />
          </div>
        </Container>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

