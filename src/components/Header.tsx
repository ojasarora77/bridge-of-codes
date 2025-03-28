import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';

const Header = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 4 }}>
      <Toolbar>
        <ShieldIcon sx={{ mr: 2, color: 'primary.main', fontSize: 40 }} />
        <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Smart Contract Auditor
        </Typography>
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
            href="https://venice.is/"
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