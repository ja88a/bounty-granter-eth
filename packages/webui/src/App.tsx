//import * as React from 'react';
import React, { useEffect } from 'react';

import Container from '@mui/material/Container';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Footer from './components/Footer';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, goerli, WagmiConfig } from 'wagmi';

import { Init as AutInit } from '@aut-protocol/d-aut';
import ListProjectGrants from './components/ProjectGrantList';
import { createBrowserRouter, Route, RouterProvider } from "react-router-dom";
import ProjectGrantDetails from './components/ProjectGrantDetailsView';
import { hardhat, polygonMumbai, optimismGoerli } from 'wagmi/chains';

const { chains, provider, webSocketProvider } = configureChains(
  [
    ...(process.env.REACT_APP_TESTNETS_ENABLE === 'true'
      ? [hardhat, goerli, polygonMumbai, optimismGoerli]
      : []),
  ],
  [
    alchemyProvider({
      apiKey: process.env.REACT_APP_ALCHEMY_APIKEY ? process.env.REACT_APP_ALCHEMY_APIKEY : 'ENV_MISSING_ALCHEMY_APIKEY',
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <ListProjectGrants />,
  },
  {
    path: "/projects",
    element: <ListProjectGrants />,
  },
  {
    path: "/projects/:id",
    element: <ProjectGrantDetails />,
  }
]);

// class App extends React.Component {
const App = () => {

  if (process.env.REACT_APP_DEBUG === 'true') {
    console.log("Alchemy="+process.env.REACT_APP_ALCHEMY_APIKEY +"\nTestnets="+process.env.REACT_APP_TESTNETS_ENABLE);
  }

  useEffect(() => {
    AutInit();
  }, []);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>

        <Container id='AppRootContainer' className="p-0 flex-1">
          <ResponsiveAppBar />
          <div className="flex-1 my-4 lg:px-12 md:px-8 sm:px-5">
          <RouterProvider router={router} />
            {/* 
            <Slider
              className="my-4"
              defaultValue={30}
              classes={{ active: 'shadow-none' }}
              componentsProps={{ thumb: { className: 'hover:shadow-none' } }}
            />
            <PopoverMenu />
            <ProTip /> */}
          </div>
          <Footer />
        </Container>
        
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
