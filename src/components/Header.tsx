import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import SimpleWalletConnect from './walletConnect';

const Header = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 4 }}>
      <Toolbar>
        {/* Replace Shield icon with custom logo */}
        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
          <img 
            src="/bridge_of_codes_logo.png" 
            alt="Bridge of Codes Logo" 
            style={{ height: 40 }}
          />
        </Box>
        
        {/* Title and Subtitle Container */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Bridge of Codes
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            AI-Powered Smart Contract Translator & Analyzer with insurance subscription services
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SimpleWalletConnect />
          <Button>...</Button>
        </Box>

        <Box>
          <Button 
            variant="outlined" 
            color="primary" 
            href="https://github.com/ojasarora77/smart-contract-auditor" 
            target="_blank"
            sx={{ mr: 2 }}
          >
            GitHub
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            href="https://venice.ai/chat"
            target="_blank"
          >
            Powered by Venice AI
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;