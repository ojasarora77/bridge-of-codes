import React, { useState } from 'react';
import { 
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Grid as MuiGrid,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Slider
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import SecurityIcon from '@mui/icons-material/Security';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CodeIcon from '@mui/icons-material/Code';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useWeb3 } from '../Web3Context';
import { ethers } from 'ethers';
import { createPolicy, getContractAddress, isContractDeployed } from '../../services/insuranceService';

// Create a properly typed Grid component
const Grid = MuiGrid;

// Risk levels for insurance policies
const riskLevels = [
  { value: 'Low', label: 'Low Risk', premium: 2, color: 'success' },
  { value: 'Medium', label: 'Medium Risk', premium: 5, color: 'warning' },
  { value: 'High', label: 'High Risk', premium: 10, color: 'error' }
];

// Duration options for insurance policies
const durationOptions = [
  { value: 30, label: '1 Month' },
  { value: 90, label: '3 Months' },
  { value: 180, label: '6 Months' },
  { value: 365, label: '1 Year' }
];

const SubscriptionTab = () => {
  const { account, library, chainId, isActive } = useWeb3();
  
  // State for policy creation
  const [contractAddress, setContractAddress] = useState('');
  const [coverageAmount, setCoverageAmount] = useState('100000');
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePolicies, setActivePolicies] = useState<any[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  
  // Check if contract is deployed on current network
  const contractDeployed = chainId ? isContractDeployed(chainId) : false;
  
  // Calculate premium automatically
  const getPremiumRate = () => {
    const riskInfo = riskLevels.find(r => r.value === riskLevel);
    return riskInfo ? riskInfo.premium : 5; // Default to 5% if not found
  };
  
  const calculatePremium = () => {
    const premium = parseFloat(coverageAmount) * (getPremiumRate() / 100);
    return premium.toFixed(4);
  };
  
  // Calculate duration-adjusted premium
  const calculateTotalPremium = () => {
    const monthlyPremium = parseFloat(calculatePremium());
    const durationInMonths = duration / 30;
    return (monthlyPremium * durationInMonths).toFixed(4);
  };

  // Policy creation steps
  const steps = [
    'Enter Contract Details',
    'Select Coverage Options',
    'Review & Submit'
  ];
  
  // Handle policy creation
  const handleCreatePolicy = async () => {
    if (!isActive || !library || !account) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!contractDeployed) {
      setError(`No insurance contract deployed on current network. Please switch to a supported network.`);
      return;
    }
    
    if (!contractAddress || !coverageAmount) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Get the contract address for the current network
      const insuranceContractAddress = chainId ? getContractAddress(chainId) : '';
      
      // Create the policy
      const totalPremium = calculateTotalPremium();
      const policyId = await createPolicy(
        library,
        contractAddress,
        coverageAmount,
        duration,
        riskLevel,
        totalPremium
      );
      
      setResult(`Policy created successfully! Policy ID: ${policyId}`);
      
      // Add to active policies (in a real app, you'd fetch this from the blockchain)
      const newPolicy = {
        id: policyId,
        contractAddress,
        coverageAmount,
        premium: totalPremium,
        duration,
        riskLevel,
        startDate: new Date(),
        endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000)
      };
      
      setActivePolicies([...activePolicies, newPolicy]);
      
      // Reset form
      setActiveStep(0);
      setContractAddress('');
      setCoverageAmount('100000');
      setRiskLevel('Medium');
      setDuration(30);
      
    } catch (err) {
      console.error('Error creating policy:', err);
      setError('Failed to create policy. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle step navigation
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Get color for risk level
  const getRiskColor = (risk: string) => {
    const riskInfo = riskLevels.find(r => r.value === risk);
    return riskInfo ? riskInfo.color : 'default';
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Smart Contract Insurance
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Protect your smart contracts with customized insurance policies. Our AI-powered risk assessment 
          determines premium rates based on contract complexity and potential vulnerabilities.
        </Typography>
      </Box>
      
      {!isActive ? (
        <Alert severity="warning">
          <AlertTitle>Wallet Not Connected</AlertTitle>
          Please connect your wallet to access insurance services
        </Alert>
      ) : !contractDeployed ? (
        <Alert severity="warning">
          <AlertTitle>Unsupported Network</AlertTitle>
          Insurance contracts are only available on Sepolia testnet. Please switch your network in MetaMask.
        </Alert>
      ) : (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Contract Details
              </Typography>
              <TextField
                fullWidth
                label="Contract Address to Insure"
                variant="outlined"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="0x..."
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CodeIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!contractAddress}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}
          
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Coverage Options
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Coverage Amount (USD)"
                    variant="outlined"
                    type="number"
                    value={coverageAmount}
                    onChange={(e) => setCoverageAmount(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel>Risk Level</InputLabel>
                    <Select
                      value={riskLevel}
                      onChange={(e) => setRiskLevel(e.target.value as 'Low' | 'Medium' | 'High')}
                      label="Risk Level"
                    >
                      {riskLevels.map((level) => (
                        <MenuItem key={level.value} value={level.value}>
                          {level.label} - {level.premium}% Premium
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              
              <Box sx={{ mt: 3, mb: 3 }}>
                <Typography gutterBottom>Policy Duration</Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={duration}
                    onChange={(_, newValue) => setDuration(newValue as number)}
                    step={null}
                    marks={durationOptions.map(option => ({
                      value: option.value,
                      label: option.label
                    }))}
                    min={30}
                    max={365}
                  />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}
          
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Review Insurance Policy
              </Typography>
              
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Policy Summary</Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Contract to Insure
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {contractAddress.substring(0, 8)}...{contractAddress.substring(contractAddress.length - 6)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Coverage Amount
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        ${parseInt(coverageAmount).toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Risk Assessment
                      </Typography>
                      <Chip 
                        label={riskLevel} 
                        color={getRiskColor(riskLevel) as any}
                        size="small"
                      />
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Premium Rate
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {getPremiumRate()}% per month
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Policy Duration
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {durationOptions.find(option => option.value === duration)?.label || `${duration} days`}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Premium (ETH)
                      </Typography>
                      <Typography variant="h6" gutterBottom color="primary.main">
                        {calculateTotalPremium()} ETH
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Alert severity="info" sx={{ width: '100%' }}>
                    This premium will be charged to your wallet when you create the policy.
                  </Alert>
                </CardActions>
              </Card>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreatePolicy}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SecurityIcon />}
                >
                  Create Policy
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      
      {result && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <AlertTitle>Success</AlertTitle>
          {result}
        </Alert>
      )}
      
      {activePolicies.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Your Active Policies
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {activePolicies.map((policy, index) => (
              <Card variant="outlined" key={index}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Policy #{policy.id}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Contract
                    </Typography>
                    <Typography variant="body2">
                      {policy.contractAddress.substring(0, 6)}...{policy.contractAddress.substring(policy.contractAddress.length - 4)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Coverage
                    </Typography>
                    <Typography variant="body2">
                      ${parseInt(policy.coverageAmount).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Risk Level
                    </Typography>
                    <Chip 
                      label={policy.riskLevel} 
                      color={getRiskColor(policy.riskLevel) as any}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Expires
                    </Typography>
                    <Typography variant="body2">
                      {new Date(policy.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    View Details
                  </Button>
                  <Button size="small" color="secondary">
                    File Claim
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default SubscriptionTab;