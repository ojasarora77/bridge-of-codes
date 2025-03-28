import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Grid as MuiGrid, 
  Typography, 
  CircularProgress,
  Paper,
  InputAdornment,
  Slider,
  Divider
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReactMarkdown from 'react-markdown';
import { assessInsurance } from '../../services/veniceService';

// Create a typed Grid component to avoid the TypeScript errors
const Grid = (props: any) => <MuiGrid {...props} />;

const marks = [
  { value: 10000, label: '$10K' },
  { value: 100000, label: '$100K' },
  { value: 1000000, label: '$1M' },
  { value: 10000000, label: '$10M' },
];

const InsuranceTab = () => {
  const [loading, setLoading] = useState(false);
  const [contractCode, setContractCode] = useState('');
  const [tvl, setTvl] = useState(1000000);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleAssess = async () => {
    if (!contractCode) return;
    
    setLoading(true);
    setError('');
    
    try {
      const assessmentResult = await assessInsurance(contractCode, tvl);
      setResult(assessmentResult);
    } catch (err) {
      setError('Failed to assess insurance risk. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contract Code
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              variant="outlined"
              value={contractCode}
              onChange={(e) => setContractCode(e.target.value)}
              placeholder="Paste your smart contract code here..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CodeIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Insurance Parameters
            </Typography>
            <Box sx={{ px: 2, pt: 3 }}>
              <Typography gutterBottom>Total Value Locked (TVL)</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <AttachMoneyIcon />
                </Grid>
                <Grid item xs>
                  <Slider
                    value={tvl}
                    onChange={(_, newValue) => setTvl(newValue as number)}
                    min={10000}
                    max={10000000}
                    step={10000}
                    marks={marks}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                  />
                </Grid>
                <Grid item>
                  <Typography>
                    ${tvl.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAssess}
              disabled={loading || !contractCode}
              startIcon={<SecurityIcon />}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Assess Insurance Risk'}
            </Button>
          </Paper>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: 'error.dark' }}>
              <Typography color="error">{error}</Typography>
            </Paper>
          </Grid>
        )}

        {result && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Insurance Assessment
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mt: 2 }}>
                <ReactMarkdown>
                  {result}
                </ReactMarkdown>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default InsuranceTab;