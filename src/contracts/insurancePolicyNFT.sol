// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

//if needed to deploy or test-> head to remix.ethereum.org, the imports wont work here as it is not intialted with ay of the smsrt contract services like hardhat or foundry.

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Smart Contract Insurance Policy with NFT Certificates
 * @dev Manages subscription-based insurance policies for smart contracts with NFT certificates
 */
contract InsurancePolicyNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Policy information
    struct Policy {
        address contractInsured;
        uint256 coverageAmount;
        uint256 premiumRate; // Basis points (e.g., 500 = 5%)
        uint256 expirationDate;
        bool active;
        string riskLevel;
        uint256 tokenId; // NFT token ID associated with this policy
    }

    // Claim information
    struct Claim {
        address claimant;
        uint256 policyId;
        uint256 claimAmount;
        string description;
        ClaimStatus status;
        uint256 timestamp;
    }

    enum ClaimStatus { Pending, Approved, Rejected }

    // State variables
    mapping(uint256 => Policy) public policies;
    mapping(uint256 => Claim) public claims;
    mapping(uint256 => string) public policyMetadata;
    uint256 public policyCounter;
    uint256 public claimCounter;
    uint256 public totalPremiumsCollected;
    uint256 public totalClaimsPaid;
    
    // Risk levels & minimum premium rates (in basis points)
    mapping(string => uint256) public riskLevelPremiums;
    
    // Base URI for NFT metadata
    string private _baseTokenURI;
    
    // Events
    event PolicyCreated(uint256 indexed policyId, address indexed owner, address contractInsured, uint256 coverageAmount, uint256 tokenId);
    event PolicyRenewed(uint256 indexed policyId, uint256 newExpirationDate);
    event PolicyCancelled(uint256 indexed policyId);
    event ClaimFiled(uint256 indexed claimId, uint256 indexed policyId, uint256 claimAmount);
    event ClaimProcessed(uint256 indexed claimId, ClaimStatus status, uint256 amountPaid);
    
    constructor() ERC721("Insurance Policy Certificate", "INSURE") Ownable(msg.sender) {        
        // Set default risk level premiums (in basis points)
        riskLevelPremiums["Low"] = 200;    // 2%
        riskLevelPremiums["Medium"] = 500; // 5%
        riskLevelPremiums["High"] = 1000;  // 10%
    }
    
    /**
     * @dev Set the base URI for policy metadata
     * @param baseURI Base URI for metadata
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Override baseURI function
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Generate token URI with policy metadata
     * @param policyId ID of the policy
     * @param contractAddress Address of insured contract
     * @param coverageAmount Coverage amount
     * @param expirationDate Expiry timestamp
     * @param riskLevel Risk assessment level
     */
    function generateTokenURI(
        uint256 policyId, 
        address contractAddress, 
        uint256 coverageAmount,
        uint256 expirationDate,
        string memory riskLevel
    ) internal pure returns (string memory) {
        // This is a simplified version. In a real implementation, you would:
        // 1. Generate JSON metadata for the policy
        // 2. Store it on IPFS or similar decentralized storage
        // 3. Return the IPFS hash/URL
        
        // For hackathon purposes, we'll just create a data URI with basic info
        string memory json = string(abi.encodePacked(
            '{"name":"Insurance Policy #', toString(policyId), 
            '","description":"Smart Contract Insurance Policy",',
            '"attributes":[',
            '{"trait_type":"Contract Insured","value":"', addressToString(contractAddress), '"},',
            '{"trait_type":"Coverage Amount","value":"', toString(coverageAmount), '"},',
            '{"trait_type":"Expiration Date","value":"', toString(expirationDate), '"},',
            '{"trait_type":"Risk Level","value":"', riskLevel, '"}',
            ']}'
        ));
        
        string memory encodedJson = Base64.encode(bytes(json));
        return string(abi.encodePacked("data:application/json;base64,", encodedJson));
    }
    
    /**
     * @dev Create a new insurance policy with NFT certificate
     * @param _contractInsured Address of the smart contract being insured
     * @param _coverageAmount Maximum coverage amount in wei
     * @param _durationDays Policy duration in days
     * @param _riskLevel Risk assessment level (Low, Medium, High)
     */
    function createPolicy(
        address _contractInsured,
        uint256 _coverageAmount,
        uint256 _durationDays,
        string memory _riskLevel
    ) external payable returns (uint256) {
        uint256 premiumRate = riskLevelPremiums[_riskLevel];
        require(premiumRate > 0, "Invalid risk level");
        
        uint256 premiumAmount = (_coverageAmount * premiumRate) / 10000;
        require(msg.value >= premiumAmount, "Insufficient premium payment");
        
        uint256 policyId = policyCounter++;
        uint256 expirationDate = block.timestamp + (_durationDays * 1 days);
        
        // Mint NFT for the policy
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        
        // Generate and set token URI with policy details
        string memory tokenURI = generateTokenURI(
            policyId,
            _contractInsured,
            _coverageAmount,
            expirationDate,
            _riskLevel
        );
        _setTokenURI(newTokenId, tokenURI);
        
        // Store policy details
        policies[policyId] = Policy({
            contractInsured: _contractInsured,
            coverageAmount: _coverageAmount,
            premiumRate: premiumRate,
            expirationDate: expirationDate,
            active: true,
            riskLevel: _riskLevel,
            tokenId: newTokenId
        });
        
        totalPremiumsCollected += msg.value;
        
        // Refund excess payment if any
        if (msg.value > premiumAmount) {
            payable(msg.sender).transfer(msg.value - premiumAmount);
        }
        
        emit PolicyCreated(policyId, msg.sender, _contractInsured, _coverageAmount, newTokenId);
        return policyId;
    }
    
    /**
     * @dev Renew an existing policy
     * @param _policyId ID of the policy to renew
     * @param _durationDays Additional duration in days
     */
    function renewPolicy(uint256 _policyId, uint256 _durationDays) 
        external 
        payable 
    {
        Policy storage policy = policies[_policyId];
        require(policy.active, "Policy is not active");
        require(ownerOf(policy.tokenId) == msg.sender, "Not the policy owner");
        
        uint256 premiumAmount = (policy.coverageAmount * policy.premiumRate) / 10000;
        require(msg.value >= premiumAmount, "Insufficient premium payment");
        
        policy.expirationDate += _durationDays * 1 days;
        totalPremiumsCollected += msg.value;
        
        // Update NFT metadata to reflect new expiration
        string memory tokenURI = generateTokenURI(
            _policyId,
            policy.contractInsured,
            policy.coverageAmount,
            policy.expirationDate,
            policy.riskLevel
        );
        _setTokenURI(policy.tokenId, tokenURI);
        
        // Refund excess payment if any
        if (msg.value > premiumAmount) {
            payable(msg.sender).transfer(msg.value - premiumAmount);
        }
        
        emit PolicyRenewed(_policyId, policy.expirationDate);
    }
    
    /**
     * @dev Cancel a policy and refund unused premium
     * @param _policyId ID of the policy to cancel
     */
    function cancelPolicy(uint256 _policyId) external {
        Policy storage policy = policies[_policyId];
        require(policy.active, "Policy is not active");
        require(ownerOf(policy.tokenId) == msg.sender, "Not the policy owner");
        
        policy.active = false;
        
        // Calculate and refund unused premium (simplified)
        if (policy.expirationDate > block.timestamp) {
            uint256 remainingTime = policy.expirationDate - block.timestamp;
            uint256 totalTime = policy.expirationDate - (policy.expirationDate - 30 days);
            uint256 refundAmount = (policy.coverageAmount * policy.premiumRate * remainingTime) / (10000 * totalTime);
            
            if (refundAmount > 0 && address(this).balance >= refundAmount) {
                payable(msg.sender).transfer(refundAmount);
            }
        }
        
        emit PolicyCancelled(_policyId);
    }
    
    /**
     * @dev File a claim for a covered loss
     * @param _policyId ID of the policy
     * @param _claimAmount Amount being claimed
     * @param _description Description of the claim
     */
    function fileClaim(
        uint256 _policyId,
        uint256 _claimAmount,
        string memory _description
    ) external returns (uint256) {
        Policy storage policy = policies[_policyId];
        require(policy.active, "Policy is not active");
        require(block.timestamp <= policy.expirationDate, "Policy has expired");
        require(_claimAmount <= policy.coverageAmount, "Claim exceeds coverage amount");
        require(ownerOf(policy.tokenId) == msg.sender, "Not the policy owner");
        
        uint256 claimId = claimCounter++;
        
        claims[claimId] = Claim({
            claimant: msg.sender,
            policyId: _policyId,
            claimAmount: _claimAmount,
            description: _description,
            status: ClaimStatus.Pending,
            timestamp: block.timestamp
        });
        
        emit ClaimFiled(claimId, _policyId, _claimAmount);
        return claimId;
    }
    
    /**
     * @dev Process a claim (approve or reject)
     * @param _claimId ID of the claim
     * @param _approve Whether to approve the claim
     */
    function processClaim(uint256 _claimId, bool _approve) external onlyOwner {
        Claim storage claim = claims[_claimId];
        require(claim.status == ClaimStatus.Pending, "Claim already processed");
        
        Policy storage policy = policies[claim.policyId];
        require(policy.active, "Policy is not active");
        
        if (_approve) {
            claim.status = ClaimStatus.Approved;
            totalClaimsPaid += claim.claimAmount;
            
            require(address(this).balance >= claim.claimAmount, "Insufficient contract balance");
            payable(claim.claimant).transfer(claim.claimAmount);
            
            emit ClaimProcessed(_claimId, ClaimStatus.Approved, claim.claimAmount);
        } else {
            claim.status = ClaimStatus.Rejected;
            emit ClaimProcessed(_claimId, ClaimStatus.Rejected, 0);
        }
    }
    
    /**
     * @dev Update premium rate for a risk level
     * @param _riskLevel Risk level to update
     * @param _premiumRate New premium rate in basis points
     */
    function updateRiskPremium(string memory _riskLevel, uint256 _premiumRate) external onlyOwner {
       riskLevelPremiums[_riskLevel] = _premiumRate;
    }
    
    /**
     * @dev Get policy details
     * @param _policyId ID of the policy
     */
    function getPolicyDetails(uint256 _policyId) external view returns (
        address owner,
        address contractInsured,
        uint256 coverageAmount,
        uint256 premiumRate,
        uint256 expirationDate,
        bool active,
        string memory riskLevel,
        uint256 tokenId
    ) {
        Policy storage policy = policies[_policyId];
        return (
            ownerOf(policy.tokenId),
            policy.contractInsured,
            policy.coverageAmount,
            policy.premiumRate,
            policy.expirationDate,
            policy.active,
            policy.riskLevel,
            policy.tokenId
        );
    }
    
    /**
     * @dev Get claim details
     * @param _claimId ID of the claim
     */
    function getClaimDetails(uint256 _claimId) external view returns (
        address claimant,
        uint256 policyId,
        uint256 claimAmount,
        string memory description,
        ClaimStatus status,
        uint256 timestamp
    ) {
        Claim storage claim = claims[_claimId];
        return (
            claim.claimant,
            claim.policyId,
            claim.claimAmount,
            claim.description,
            claim.status,
            claim.timestamp
        );
    }
    
    /**
     * @dev Get contract statistics
     */
    function getStats() external view returns (
        uint256 totalPolicies,
        uint256 totalClaims,
        uint256 premiumsCollected,
        uint256 claimsPaid,
        uint256 balance
    ) {
        return (
            policyCounter,
            claimCounter,
            totalPremiumsCollected,
            totalClaimsPaid,
            address(this).balance
        );
    }
    
    /**
     * @dev Allow contract owner to withdraw excess funds (maintain solvency ratio)
     * @param _amount Amount to withdraw
     */
    function withdraw(uint256 _amount) external onlyOwner {
        // Ensure we maintain a 2:1 solvency ratio (balance to total coverage)
        uint256 activePoliciesCoverage = 0;
        for (uint256 i = 0; i < policyCounter; i++) {
            if (policies[i].active && policies[i].expirationDate > block.timestamp) {
                activePoliciesCoverage += policies[i].coverageAmount;
            }
        }
        
        uint256 minimumBalance = activePoliciesCoverage / 2;
        require(address(this).balance - _amount >= minimumBalance, "Withdrawal would breach solvency ratio");
        
        payable(owner()).transfer(_amount);
    }
    
    /**
     * @dev Deposit funds to the contract
     */
    function deposit() external payable {
        // Just accept the funds
    }
    
    // Utility functions for token URI generation
    
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        
        uint256 temp = value;
        uint256 digits;
        
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }
    
    function addressToString(address _addr) internal pure returns (string memory) {
        bytes memory data = abi.encodePacked(_addr);
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        
        for (uint i = 0; i < data.length; i++) {
            str[2 + i * 2] = alphabet[uint(uint8(data[i] >> 4))];
            str[3 + i * 2] = alphabet[uint(uint8(data[i] & 0x0f))];
        }
        
        return string(str);
    }
}

/// @title Base64
/// @notice Provides a function for encoding base64 strings
/// @author Brecht Devos - <brecht@loopring.org>
library Base64 {
    string internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";

        // Loads the table into memory
        string memory table = TABLE;

        // Encoding takes 3 bytes chunks of binary data from `bytes` data parameter
        // and split into 4 numbers of 6 bits.
        // The final Base64 length should be `bytes` data length multiplied by 4/3 rounded up
        // - `data.length + 2`  -> Round up
        // - `/ 3`              -> Number of 3-bytes chunks
        // - `4 *`              -> 4 characters for each chunk
        string memory result = new string(4 * ((data.length + 2) / 3));

        // 32 is the ASCII for '0'
        assembly {
            // Load the table into memory
            let tablePtr := add(table, 1)

            // Advance to the beginning of `result` (to store the first character)
            let resultPtr := add(result, 32)

            // Stop encoding when all bytes are processed
            let endPtr := add(data, mload(data))

            // Main loop to process bytes
            for {} lt(data, endPtr) {}
            {
                // Load 3 bytes from `data`
                let input := mload(data)

                // Write 4 characters to `result`
                mstore(resultPtr, shl(248, mload(add(tablePtr, and(shr(18, input), 0x3F)))))
                resultPtr := add(resultPtr, 1)
                mstore(resultPtr, shl(248, mload(add(tablePtr, and(shr(12, input), 0x3F)))))
                resultPtr := add(resultPtr, 1)
                mstore(resultPtr, shl(248, mload(add(tablePtr, and(shr(6, input), 0x3F)))))
                resultPtr := add(resultPtr, 1)
                mstore(resultPtr, shl(248, mload(add(tablePtr, and(input, 0x3F)))))
                resultPtr := add(resultPtr, 1)

                // Move to the next 3 bytes
                data := add(data, 3)
            }

            // Handle padding
            let bytesLeft := sub(endPtr, data)
            if eq(bytesLeft, 1) {
                // Load remaining byte
                let input := mload(data)

                // Write 2 characters followed by "=="
                mstore(resultPtr, shl(248, mload(add(tablePtr, and(shr(2, input), 0x3F)))))
                resultPtr := add(resultPtr, 1)
                mstore(resultPtr, shl(248, mload(add(tablePtr, and(shl(4, input), 0x3F)))))
                resultPtr := add(resultPtr, 1)
                mstore(resultPtr, shl(248, 61)) // "="
                resultPtr := add(resultPtr, 1)
                mstore(resultPtr, shl(248, 61)) // "="
            }
            
            if eq(bytesLeft, 2) {
                // Load remaining 2 bytes
                let input := mload(data)

                // Write 3 characters followed by "="
                mstore(resultPtr, shl(248, mload(add(tablePtr, and(shr(10, input), 0x3F)))))
                resultPtr := add(resultPtr, 1)
                mstore(resultPtr, shl(248, mload(add(tablePtr, and(shr(4, input), 0x3F)))))
                resultPtr := add(resultPtr, 1)
                mstore(resultPtr, shl(248, mload(add(tablePtr, and(shl(2, input), 0x3F)))))
                resultPtr := add(resultPtr, 1)
                mstore(resultPtr, shl(248, 61)) // "="
            }
        }

        return result;
    }
}