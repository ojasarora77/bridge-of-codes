import React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Header from './components/Header';
import AuditorTabs from './components/AuditorTabs';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider as Web3ContextProvider } from './components/Web3Context';
import { ethers } from 'ethers';

// Function to get library from provider
function getLibrary(provider: any) {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

// Create a dark theme for the application
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto Mono", monospace',
  },
});

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ContextProvider>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Container maxWidth="lg">
            <Header />
            <AuditorTabs />
          </Container>
        </ThemeProvider>
      </Web3ContextProvider>
    </Web3ReactProvider>
  );
}

export default App;