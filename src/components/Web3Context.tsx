import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useWeb3React } from '@web3-react/core';

// Define supported chain IDs
const SUPPORTED_CHAIN_IDS = [1, 11155111, 137, 42161, 10]; // Mainnet, Sepolia, Polygon, Arbitrum, Optimism

// Create injected connector
export const injectedConnector = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
});

// Define the context shape
interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isActive: boolean;
  library: any;
  balance: string;
  isConnecting: boolean;
  error: Error | null;
  getChainName: (chainId: number) => string;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  chainId: null,
  connect: async () => {},
  disconnect: () => {},
  isActive: false,
  library: null,
  balance: '0',
  isConnecting: false,
  error: null,
  getChainName: () => '',
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activate, deactivate, account, chainId, library, active, error } = useWeb3React();
  const [balance, setBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);

  // Network names
  const getChainName = (chainId: number): string => {
    const chainNames: Record<number, string> = {
      1: 'Ethereum',
      11155111: 'Sepolia',
      137: 'Polygon',
      42161: 'Arbitrum',
      10: 'Optimism',
    };
    return chainNames[chainId] || `Chain #${chainId}`;
  };

  // Connect to wallet
  const connect = async () => {
    setIsConnecting(true);
    try {
      await activate(injectedConnector);
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    deactivate();
  };

  // Get balance when account changes
  useEffect(() => {
    if (account && library) {
      library.getBalance(account).then((balance: ethers.BigNumber) => {
        setBalance(ethers.utils.formatEther(balance));
      });
    } else {
      setBalance('0');
    }
  }, [account, library, chainId]);

  // Auto-connect if previously connected
  useEffect(() => {
    injectedConnector.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        connect();
      }
    });
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        chainId,
        connect,
        disconnect,
        isActive: active,
        library,
        balance,
        isConnecting,
        error,
        getChainName,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};