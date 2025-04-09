# Bridge of Codes: Smart Contract Insurance Platform

![Bridge of Codes Logo](https://github.com/ojasarora77/VeniceBreach/blob/master/public/bridge_of_codes_logo.png)

Bridge of Codes is a comprehensive platform that uses AI to analyze smart contracts for security vulnerabilities and offers subscription-based insurance coverage against potential exploits. The platform combines advanced security analysis with blockchain-based insurance, providing developers and projects with both preventative insights and financial protection.

## Features

- **AI-Powered Security Analysis**: Deep scanning of smart contract code to identify vulnerabilities, assess complexity, and evaluate upgrade mechanisms.
- **Risk-Based Insurance Policies**: Custom insurance policies with premiums calculated based on the AI's risk assessment.
- **Cross-Chain Contract Translation**: Translation capabilities between different blockchain languages (Solidity, Rust, Vyper, Haskell) to help developers understand contracts across ecosystems.
- **NFT Insurance Certificates**: Digital proof of insurance coverage that lives in users' wallets, making policies easily verifiable and transferable.
- **On-Chain Claims Processing**: Streamlined process for filing and resolving claims when vulnerabilities are exploited.

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Setting Up Your Wallet](#setting-up-your-wallet)
  - [Connecting to Arbitrum Sepolia](#connecting-to-arbitrum-sepolia)
  - [Getting Test ETH](#getting-test-eth)
- [Usage](#usage)
  - [Translating Smart Contracts](#translating-smart-contracts)
  - [Auditing Smart Contracts](#auditing-smart-contracts)
  - [Creating Insurance Policies](#creating-insurance-policies)
  - [Filing Claims](#filing-claims)
- [How It Works](#how-it-works)
- [Development](#development)
- [License](#license)
- [Contact](#contact)

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bridge-of-codes.git

# Navigate to the project directory
cd bridge-of-codes

# Install dependencies
npm install

# Create .env file with required environment variables
cp .env.example .env
# Edit .env with your API keys
```

## Getting Started

### Setting Up Your Wallet

To use Bridge of Codes, you'll need a Web3 wallet like MetaMask:

1. Install [MetaMask](https://metamask.io/) as a browser extension
2. Create a new wallet or import an existing one
3. Make sure you're on the Arbitrum Sepolia testnet (see below)

### Connecting to Arbitrum Sepolia

Arbitrum Sepolia is the testnet where our smart contracts are deployed. Add it to your MetaMask:

1. Open MetaMask and click on the network dropdown at the top
2. Click "Add Network" then "Add a network manually"
3. Enter the following details:
   - Network Name: `Arbitrum Sepolia`
   - RPC URL: `https://sepolia-rollup.arbitrum.io/rpc`
   - Chain ID: `421614`
   - Currency Symbol: `ETH`
   - Block Explorer URL: `https://sepolia.arbiscan.io/`
4. Click "Save"

### Getting Test ETH

You'll need test ETH to interact with our platform on Arbitrum Sepolia:

1. Go to the [Arbitrum Sepolia Faucet](https://www.alchemy.com/faucets/arbitrum-sepolia)
2. Connect your wallet or enter your wallet address
3. Request free test ETH
4. Alternatively, you can bridge test ETH from Ethereum Sepolia using the [Arbitrum Bridge](https://bridge.arbitrum.io/)

## Usage

### Starting the Application

```bash
# Start the development server
npm start

# The app will be available at http://localhost:3000
```

### Translating Smart Contracts

Our translation feature allows you to convert smart contracts between blockchain languages:

1. Go to the "TRANSLATE" tab
2. Paste your smart contract code or fetch an existing contract by address
3. Select the target language (Solidity, Rust, Vyper, or Haskell)
4. Click "Translate" to get an equivalent implementation in the target language

### Auditing Smart Contracts

Secure your contracts with our AI-powered auditor:

1. Navigate to the "AUDIT" tab
2. Paste your smart contract code or fetch it by address
3. Click "Audit Contract" to run a comprehensive security analysis
4. Review the detailed report of vulnerabilities, complexity assessment, and recommendations

### Creating Insurance Policies

Protect your contracts against vulnerabilities with insurance coverage:

1. Go to the "INSURANCE" tab
2. Enter your contract address and set the desired coverage amount
3. Our AI will calculate a risk-appropriate premium
4. Review and create your policy
5. Once confirmed on the blockchain, your NFT insurance certificate will be generated

### Filing Claims

If your insured contract experiences an issue:

1. Navigate to the "SUBSCRIPTION" tab
2. Find your policy in the "Active Policies" section
3. Click "File Claim"
4. Describe the incident and enter the claim amount
5. Submit the claim for review
6. Once approved, payment will be processed automatically

## How It Works

Bridge of Codes operates through a sustainable insurance fund structure:

1. **Premium Collection**: Users pay insurance premiums based on their smart contract's risk assessment
2. **Risk Diversification**: Premiums are allocated to different risk categories with strict solvency requirements
3. **Policy Management**: NFT certificates serve as proof of coverage and policy terms
4. **Claims Processing**: When incidents occur, claims are filed on-chain and verified against policy terms

Unlike many DeFi insurance protocols, we:
- Don't rely on token staking or governance voting for claims
- Provide direct coverage specific to each contract
- Maintain a sustainable capital reserve model

## Development

### Project Structure

```
bridge-of-codes/
├── public/             # Static files
├── src/
│   ├── components/     # React components
│   ├── services/       # API services
│   ├── utils/          # Utilities and helpers
│   └── App.tsx         # Main application
├── contracts/          # Smart contracts
└── scripts/            # Build and deployment scripts
```

### Environment Variables

Create a `.env` file with:

```
REACT_APP_ETHERSCAN_API_KEY=your_etherscan_key
REACT_APP_SOLSCAN_API_KEY=your_solscan_key
REACT_APP_VENICE_API_KEY=your_venice_key
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, reach out to:
- Email: [ojasnf7@gmail.com](mailto:ojasnf7@gmail.com)
- Twitter: [@OjasArora77](https://x.com/OjasArora77)

---

Built with ❤️ by Ojas Arora
