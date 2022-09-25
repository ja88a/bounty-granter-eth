import React from 'react';
import { createRoot } from 'react-dom/client';

import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import type {} from '@mui/x-data-grid/themeAugmentation';
import './style/index.css';

import App from './App';
import reportWebVitals from './features/reportWebVitals';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

// Tailwind's config
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
