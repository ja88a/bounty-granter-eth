import React from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import './style/index.css';
import App from './App';
import reportWebVitals from './features/reportWebVitals';
import type {} from '@mui/x-data-grid/themeAugmentation';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

// All `Portal`-related components need to have the main app wrapper element as a container
// so that they are in the subtree under the element used in the `important` option of the Tailwind's config.
const theme = createTheme({
  components: {
    MuiPopover: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiPopper: {
      defaultProps: {
        container: rootElement,
      },
    },
    // Use `MuiDataGrid` on DataGrid, DataGridPro and DataGridPremium
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: 'none',
        },
      },
    },
  },
});

root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        {/* <link rel="preload" href="Orbitron-Regular.woff2" as="font" type="font/woff2" data-crossorigin></link> */}
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" /> */}
        {/* <link rel="preconnect" href="https://fonts.gstatic.com" data-crossorigin /> */}
        <link href="https://fonts.googleapis.com/css2?family=Orbitron&display=swap" rel="stylesheet"></link>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
);

// Measuring performance by logging results: reportWebVitals(console.log)
// or sending to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (process.env.REACT_APP_DEBUG === 'true') {
  reportWebVitals(console.log);
}
