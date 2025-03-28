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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import TranslateIcon from '@mui/icons-material/Translate';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { translateContract } from '../../services/veniceService';

const Grid = (props: any) => <MuiGrid {...props} />;

const languages = [
  { value: 'solidity', label: 'Solidity (Ethereum)' },
  { value: 'rust', label: 'Rust (Solana)' },
  { value: 'vyper', label: 'Vyper (Ethereum)' },
  { value: 'haskell', label: 'Haskell (Cardano)' }
];

const TranslateTab = () => {
  const [loading, setLoading] = useState(false);
  const [sourceCode, setSourceCode] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    if (!sourceCode || !targetLanguage) return;
    
    setLoading(true);
    setError('');
    
    try {
      const translationResult = await translateContract(sourceCode, targetLanguage);
      setResult(translationResult);
    } catch (err) {
      setError(`Failed to translate contract to ${targetLanguage}. Please try again.`);
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
              Source Code
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              variant="outlined"
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
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
              Translation Settings
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Target Language</InputLabel>
                  <Select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    label="Target Language"
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleTranslate}
                  disabled={loading || !sourceCode || !targetLanguage}
                  startIcon={<TranslateIcon />}
                >
                  {loading ? <CircularProgress size={24} /> : 'Translate'}
                </Button>
              </Grid>
            </Grid>
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
                Translated Code ({targetLanguage})
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <SyntaxHighlighter 
                language={targetLanguage === 'haskell' ? 'haskell' : 
                         targetLanguage === 'rust' ? 'rust' : 
                         targetLanguage === 'vyper' ? 'python' : 'javascript'}
                style={atomDark}
                showLineNumbers
                customStyle={{ borderRadius: '4px' }}
              >
                {result}
              </SyntaxHighlighter>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default TranslateTab;