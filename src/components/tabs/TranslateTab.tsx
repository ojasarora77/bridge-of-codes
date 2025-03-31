import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress,
  Paper,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  FormHelperText,
  IconButton,
  Tooltip
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import TranslateIcon from '@mui/icons-material/Translate';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import SearchIcon from '@mui/icons-material/Search';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { translateContract } from '../../services/veniceService';
import { getContractSource } from '../../services/etherscanService';

const languages = [
  { value: 'solidity', label: 'Solidity (Ethereum)' },
  { value: 'rust', label: 'Rust (Solana)' },
  { value: 'vyper', label: 'Vyper (Ethereum)' },
  { value: 'haskell', label: 'Haskell (Cardano)' }
];

const TranslateTab = () => {
  const [loading, setLoading] = useState(false);
  const [sourceCode, setSourceCode] = useState('');
  const [contractAddress, setContractAddress] = useState('');
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

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setSourceCode(clipboardText);
    } catch (err) {
      setError("Failed to access clipboard. Please paste manually.");
    }
  };

  const handleFetchContract = async () => {
    if (!contractAddress) return;
    
    setLoading(true);
    setError('');
    
    try {
      const sourceCode = await getContractSource(contractAddress);
      setSourceCode(sourceCode);
    } catch (err) {
      setError('Failed to fetch contract source code. Please check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Fetch Contract by Address
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              label="Contract Address"
              variant="outlined"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="0x..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleFetchContract}
              disabled={loading || !contractAddress}
              sx={{ ml: 2, height: '56px' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Fetch'}
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Source Code
            </Typography>
            <Tooltip title="Paste from clipboard">
              <IconButton onClick={handlePaste} color="primary">
                <ContentPasteIcon />
              </IconButton>
            </Tooltip>
          </Box>
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

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Translation Settings
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
              <FormHelperText>Select the blockchain language to translate to</FormHelperText>
            </FormControl>
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
          </Box>
        </Paper>

        {error && (
          <Paper sx={{ p: 3, bgcolor: 'error.dark' }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        )}

        {result && (
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
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<ContentPasteIcon />}
              onClick={() => navigator.clipboard.writeText(result)}
              sx={{ mt: 2 }}
            >
              Copy to Clipboard
            </Button>
          </Paper>
        )}
      </div>
    </Box>
  );
};

export default TranslateTab;