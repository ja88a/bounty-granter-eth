import React from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import './style/index.css';
import App from './App';
import reportWebVitals from './features/reportWebVitals';

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
  },
});

root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
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
