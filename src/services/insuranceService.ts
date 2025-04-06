import { ethers } from 'ethers';

// Insurance Policy Contract ABI (just the functions we'll use)
export const CONTRACT_ABI = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "address", "name": "owner", "type": "address" } ], "name": "ERC721IncorrectOwner", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "ERC721InsufficientApproval", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "approver", "type": "address" } ], "name": "ERC721InvalidApprover", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" } ], "name": "ERC721InvalidOperator", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "ERC721InvalidOwner", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "receiver", "type": "address" } ], "name": "ERC721InvalidReceiver", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" } ], "name": "ERC721InvalidSender", "type": "error" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "ERC721NonexistentToken", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "_fromTokenId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "_toTokenId", "type": "uint256" } ], "name": "BatchMetadataUpdate", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "claimId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "policyId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "claimAmount", "type": "uint256" } ], "name": "ClaimFiled", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "claimId", "type": "uint256" }, { "indexed": false, "internalType": "enum InsurancePolicyNFT.ClaimStatus", "name": "status", "type": "uint8" }, { "indexed": false, "internalType": "uint256", "name": "amountPaid", "type": "uint256" } ], "name": "ClaimProcessed", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "_tokenId", "type": "uint256" } ], "name": "MetadataUpdate", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "policyId", "type": "uint256" } ], "name": "PolicyCancelled", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "policyId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": false, "internalType": "address", "name": "contractInsured", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "coverageAmount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "PolicyCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "policyId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "newExpirationDate", "type": "uint256" } ], "name": "PolicyRenewed", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_policyId", "type": "uint256" } ], "name": "cancelPolicy", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "claimCounter", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "claims", "outputs": [ { "internalType": "address", "name": "claimant", "type": "address" }, { "internalType": "uint256", "name": "policyId", "type": "uint256" }, { "internalType": "uint256", "name": "claimAmount", "type": "uint256" }, { "internalType": "string", "name": "description", "type": "string" }, { "internalType": "enum InsurancePolicyNFT.ClaimStatus", "name": "status", "type": "uint8" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_contractInsured", "type": "address" }, { "internalType": "uint256", "name": "_coverageAmount", "type": "uint256" }, { "internalType": "uint256", "name": "_durationDays", "type": "uint256" }, { "internalType": "string", "name": "_riskLevel", "type": "string" } ], "name": "createPolicy", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_policyId", "type": "uint256" }, { "internalType": "uint256", "name": "_claimAmount", "type": "uint256" }, { "internalType": "string", "name": "_description", "type": "string" } ], "name": "fileClaim", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "getApproved", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_claimId", "type": "uint256" } ], "name": "getClaimDetails", "outputs": [ { "internalType": "address", "name": "claimant", "type": "address" }, { "internalType": "uint256", "name": "policyId", "type": "uint256" }, { "internalType": "uint256", "name": "claimAmount", "type": "uint256" }, { "internalType": "string", "name": "description", "type": "string" }, { "internalType": "enum InsurancePolicyNFT.ClaimStatus", "name": "status", "type": "uint8" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_policyId", "type": "uint256" } ], "name": "getPolicyDetails", "outputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "contractInsured", "type": "address" }, { "internalType": "uint256", "name": "coverageAmount", "type": "uint256" }, { "internalType": "uint256", "name": "premiumRate", "type": "uint256" }, { "internalType": "uint256", "name": "expirationDate", "type": "uint256" }, { "internalType": "bool", "name": "active", "type": "bool" }, { "internalType": "string", "name": "riskLevel", "type": "string" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getStats", "outputs": [ { "internalType": "uint256", "name": "totalPolicies", "type": "uint256" }, { "internalType": "uint256", "name": "totalClaims", "type": "uint256" }, { "internalType": "uint256", "name": "premiumsCollected", "type": "uint256" }, { "internalType": "uint256", "name": "claimsPaid", "type": "uint256" }, { "internalType": "uint256", "name": "balance", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" } ], "name": "isApprovedForAll", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "policies", "outputs": [ { "internalType": "address", "name": "contractInsured", "type": "address" }, { "internalType": "uint256", "name": "coverageAmount", "type": "uint256" }, { "internalType": "uint256", "name": "premiumRate", "type": "uint256" }, { "internalType": "uint256", "name": "expirationDate", "type": "uint256" }, { "internalType": "bool", "name": "active", "type": "bool" }, { "internalType": "string", "name": "riskLevel", "type": "string" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "policyCounter", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "policyMetadata", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_claimId", "type": "uint256" }, { "internalType": "bool", "name": "_approve", "type": "bool" } ], "name": "processClaim", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_policyId", "type": "uint256" }, { "internalType": "uint256", "name": "_durationDays", "type": "uint256" } ], "name": "renewPolicy", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "", "type": "string" } ], "name": "riskLevelPremiums", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "baseURI", "type": "string" } ], "name": "setBaseURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "tokenURI", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalClaimsPaid", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalPremiumsCollected", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "_riskLevel", "type": "string" }, { "internalType": "uint256", "name": "_premiumRate", "type": "uint256" } ], "name": "updateRiskPremium", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_amount", "type": "uint256" } ], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];

// Contract addresses by network
const CONTRACT_ADDRESSES: Record<number, string> = {
  421614: '0xdb3B9FeE87831822602C2472077c79b029c9292E', // Arbitrum Sepolia testnet - replace with your contract address
};

export interface PolicyDetails {
  owner: string;
  contractInsured: string;
  coverageAmount: string;
  premiumRate: string;
  expirationDate: Date;
  active: boolean;
}

export interface ClaimDetails {
  claimant: string;
  policyId: string;
  claimAmount: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: Date;
}

export interface Stats {
  totalPolicies: number;
  totalClaims: number;
  premiumsCollected: string;
  claimsPaid: string;
  balance: string;
}

// Helper function to convert status number to string
const claimStatusToString = (status: number): 'Pending' | 'Approved' | 'Rejected' => {
  switch (status) {
    case 0:
      return 'Pending';
    case 1:
      return 'Approved';
    case 2:
      return 'Rejected';
    default:
      return 'Pending';
  }
};

/**
 * Create a new insurance policy
 */
export const createPolicy = async (
  provider: ethers.providers.Web3Provider,
  contractInsured: string,
  coverageAmount: string,
  durationDays: number,
  riskLevel: 'Low' | 'Medium' | 'High',
  premiumAmount: string
): Promise<number> => {
  try {
    const network = await provider.getNetwork();
    const chainId = network.chainId;
    const contractAddress = CONTRACT_ADDRESSES[chainId];
    
    if (!contractAddress) {
      throw new Error(`No contract deployed on chain ID ${chainId}`);
    }

    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);

    // Convert values to appropriate formats
    const coverageWei = ethers.utils.parseEther(coverageAmount);
    const premiumWei = ethers.utils.parseEther(premiumAmount);

    console.log(`Creating policy with:
      - Contract to insure: ${contractInsured}
      - Coverage: ${coverageWei.toString()} wei
      - Duration: ${durationDays} days
      - Risk: ${riskLevel}
      - Premium: ${premiumWei.toString()} wei
    `);

    // Create the policy
    const tx = await contract.createPolicy(
      contractInsured,
      coverageWei,
      durationDays,
      riskLevel,
      { value: premiumWei }
    );

    console.log(`Transaction submitted: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    
    // For now, return a dummy policy ID (in a real app, you'd extract it from the event)
    // This would require the full ABI with event definitions
    return Date.now() % 1000; // Random policy ID for demo purposes
  } catch (error) {
    console.error('Error creating policy:', error);
    throw error;
  }
};

/**
 * Renew an existing policy
 */
export const renewPolicy = async (
  provider: ethers.providers.Web3Provider,
  policyId: number,
  durationDays: number,
  premiumAmount: string
): Promise<boolean> => {
  try {
    const network = await provider.getNetwork();
    const chainId = network.chainId;
    const contractAddress = CONTRACT_ADDRESSES[chainId];
    
    if (!contractAddress) {
      throw new Error(`No contract deployed on chain ID ${chainId}`);
    }

    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);

    // Convert premium to wei
    const premiumWei = ethers.utils.parseEther(premiumAmount);

    // Renew the policy
    const tx = await contract.renewPolicy(policyId, durationDays, { value: premiumWei });
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error('Error renewing policy:', error);
    throw error;
  }
};

/**
 * Get details of a policy
 */
export const getPolicyDetails = async (
  provider: ethers.providers.Web3Provider,
  policyId: number
): Promise<PolicyDetails> => {
  try {
    const network = await provider.getNetwork();
    const chainId = network.chainId;
    const contractAddress = CONTRACT_ADDRESSES[chainId];
    
    if (!contractAddress) {
      throw new Error(`No contract deployed on chain ID ${chainId}`);
    }

    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);

    const [owner, contractInsured, coverageAmount, premiumRate, expirationDate, active] = 
      await contract.getPolicyDetails(policyId);

    return {
      owner,
      contractInsured,
      coverageAmount: ethers.utils.formatEther(coverageAmount),
      premiumRate: (premiumRate.toNumber() / 100).toString(), // Convert basis points to percentage
      expirationDate: new Date(expirationDate.toNumber() * 1000), // Convert timestamp to Date
      active
    };
  } catch (error) {
    console.error('Error getting policy details:', error);
    throw error;
  }
};

/**
 * File an insurance claim
 */
export const fileClaim = async (
  provider: ethers.providers.Web3Provider,
  policyId: number,
  claimAmount: string,
  description: string
): Promise<number> => {
  try {
    const network = await provider.getNetwork();
    const chainId = network.chainId;
    const contractAddress = CONTRACT_ADDRESSES[chainId];
    
    if (!contractAddress) {
      throw new Error(`No contract deployed on chain ID ${chainId}`);
    }

    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);

    // Convert to wei
    const claimAmountWei = ethers.utils.parseEther(claimAmount);

    // File the claim
    const tx = await contract.fileClaim(policyId, claimAmountWei, description);
    const receipt = await tx.wait();
    
    // For now, return a dummy claim ID (in a real app, you'd extract it from the event)
    return Date.now() % 1000; // Random claim ID for demo purposes
  } catch (error) {
    console.error('Error filing claim:', error);
    throw error;
  }
};

/**
 * Cancel a policy
 */
export const cancelPolicy = async (
  provider: ethers.providers.Web3Provider,
  policyId: number
): Promise<boolean> => {
  try {
    const network = await provider.getNetwork();
    const chainId = network.chainId;
    const contractAddress = CONTRACT_ADDRESSES[chainId];
    
    if (!contractAddress) {
      throw new Error(`No contract deployed on chain ID ${chainId}`);
    }

    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);

    // Cancel the policy
    const tx = await contract.cancelPolicy(policyId);
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error('Error canceling policy:', error);
    throw error;
  }
};

/**
 * Get the policies owned by the current account
 */
export const getMyPolicies = async (
  provider: ethers.providers.Web3Provider
): Promise<PolicyDetails[]> => {
  try {
    const network = await provider.getNetwork();
    const chainId = network.chainId;
    const contractAddress = CONTRACT_ADDRESSES[chainId];
    
    if (!contractAddress) {
      throw new Error(`No contract deployed on chain ID ${chainId}`);
    }

    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    
    // Get the policy counter to know how many policies exist
    const policyCounter = await contract.policyCounter();
    const policies: PolicyDetails[] = [];
    
    // Loop through all policies and check if the owner matches
    for (let i = 0; i < policyCounter.toNumber(); i++) {
      try {
        const [owner, contractInsured, coverageAmount, premiumRate, expirationDate, active] =
          await contract.policies(i);
        
        // If the owner matches the current address, add to the list
        if (owner.toLowerCase() === address.toLowerCase()) {
          policies.push({
            owner,
            contractInsured,
            coverageAmount: ethers.utils.formatEther(coverageAmount),
            premiumRate: (premiumRate.toNumber() / 100).toString(),
            expirationDate: new Date(expirationDate.toNumber() * 1000),
            active
          });
        }
      } catch (err) {
        console.log(`Error fetching policy ${i}:`, err);
        // Continue to next policy
        continue;
      }
    }
    
    return policies;
  } catch (error) {
    console.error('Error getting policies:', error);
    throw error;
  }
};

/**
 * Get details of a claim
 */
export const getClaimDetails = async (
  provider: ethers.providers.Web3Provider,
  claimId: number
): Promise<ClaimDetails> => {
  try {
    const network = await provider.getNetwork();
    const chainId = network.chainId;
    const contractAddress = CONTRACT_ADDRESSES[chainId];
    
    if (!contractAddress) {
      throw new Error(`No contract deployed on chain ID ${chainId}`);
    }

    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);

    const [claimant, policyId, claimAmount, description, status, timestamp] = 
      await contract.getClaimDetails(claimId);

    return {
      claimant,
      policyId: policyId.toString(),
      claimAmount: ethers.utils.formatEther(claimAmount),
      description,
      status: claimStatusToString(status),
      timestamp: new Date(timestamp.toNumber() * 1000)
    };
  } catch (error) {
    console.error('Error getting claim details:', error);
    throw error;
  }
};

/**
 * Get contract statistics
 */
export const getStats = async (
  provider: ethers.providers.Web3Provider
): Promise<Stats> => {
  try {
    const network = await provider.getNetwork();
    const chainId = network.chainId;
    const contractAddress = CONTRACT_ADDRESSES[chainId];
    
    if (!contractAddress) {
      throw new Error(`No contract deployed on chain ID ${chainId}`);
    }

    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);

    const [totalPolicies, totalClaims, premiumsCollected, claimsPaid, balance] = 
      await contract.getStats();

    return {
      totalPolicies: totalPolicies.toNumber(),
      totalClaims: totalClaims.toNumber(),
      premiumsCollected: ethers.utils.formatEther(premiumsCollected),
      claimsPaid: ethers.utils.formatEther(claimsPaid),
      balance: ethers.utils.formatEther(balance)
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    throw error;
  }
};

/**
 * Get contract address for the current network
 */
export const getContractAddress = (chainId: number): string => {
  return CONTRACT_ADDRESSES[chainId] || '';
};

/**
 * Check if the current network has a deployed contract
 */
export const isContractDeployed = (chainId: number): boolean => {
  return !!CONTRACT_ADDRESSES[chainId];
};

/**
 * Calculate premium for a policy
 */
export const calculatePremium = (
  coverageAmount: string,
  riskLevel: 'Low' | 'Medium' | 'High',
  durationDays: number
): string => {
  let premiumRate = 0;
  
  // Set base rate based on risk level
  switch (riskLevel) {
    case 'Low':
      premiumRate = 0.02; // 2%
      break;
    case 'Medium':
      premiumRate = 0.05; // 5%
      break;
    case 'High':
      premiumRate = 0.10; // 10%
      break;
    default:
      premiumRate = 0.05; // Default to medium risk
  }
  
  // Calculate premium: coverage * rate * (duration / 365)
  const coverage = parseFloat(coverageAmount);
  const durationYears = durationDays / 365;
  const premium = coverage * premiumRate * durationYears;
  
  return premium.toFixed(4);
};
