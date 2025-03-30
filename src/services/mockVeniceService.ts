// src/services/mockVeniceService.ts

// Sample mock data for contract analysis
export const analyzeContract = async (contractCode: string): Promise<any> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Basic static analysis to make the demo more realistic
    const hasReentrancy = contractCode.includes('.call{value:') && !contractCode.includes('nonReentrant');
    const hasAccessControl = contractCode.includes('onlyOwner') || contractCode.includes('require(msg.sender ==');
    const hasSelfDestruct = contractCode.includes('selfdestruct') || contractCode.includes('suicide');
    const hasTimeLock = contractCode.includes('timelock');
    const complexity = contractCode.length > 1000 ? 'High' : contractCode.length > 500 ? 'Medium' : 'Low';
    
    // Calculate scores based on simple code analysis
    const vulnerabilityScore = 100 - 
      (hasReentrancy ? 30 : 0) - 
      (hasAccessControl ? 0 : 20) -
      (hasSelfDestruct ? 15 : 0);
    
    const complexityScore = 100 - 
      (complexity === 'High' ? 30 : complexity === 'Medium' ? 15 : 0);
    
    const upgradabilityScore = 100 -
      (contractCode.includes('proxy') ? 20 : 0) -
      (hasTimeLock ? 0 : 15);
    
    const behaviorScore = 100 -
      (hasReentrancy ? 25 : 0) -
      (hasAccessControl ? 0 : 20);
    
    const overallScore = Math.round(
      (vulnerabilityScore * 0.4) +
      (complexityScore * 0.3) +
      (upgradabilityScore * 0.15) +
      (behaviorScore * 0.15)
    );
    
    return {
      overall_score: overallScore,
      complexity: {
        score: complexityScore,
        details: [
          `Code complexity: ${complexity}`,
          `Lines of code: ${contractCode.split('\n').length}`,
          `External calls: ${(contractCode.match(/\.(call|delegatecall|staticcall)/g) || []).length}`,
          `State variables: ${(contractCode.match(/^\s*(uint|int|bool|address|string|bytes|mapping)/gm) || []).length}`
        ],
        risk_level: complexityScore > 80 ? "Low" : complexityScore > 60 ? "Medium" : "High"
      },
      vulnerabilities: {
        score: vulnerabilityScore,
        details: [
          hasReentrancy ? "Vulnerability: Potential reentrancy risk detected" : "No reentrancy vulnerabilities found",
          hasAccessControl ? "Proper access controls implemented" : "Vulnerability: Missing access controls",
          hasSelfDestruct ? "Vulnerability: Contract contains selfdestruct/suicide function" : "No self-destruct mechanism found",
          contractCode.includes('tx.origin') ? "Vulnerability: Using tx.origin for authentication" : "Not using tx.origin for authentication"
        ],
        risk_level: vulnerabilityScore > 80 ? "Low" : vulnerabilityScore > 60 ? "Medium" : "High"
      },
      upgradability: {
        score: upgradabilityScore,
        details: [
          contractCode.includes('proxy') ? "Contract uses proxy pattern for upgradability" : "Contract is not upgradeable",
          hasTimeLock ? "Upgrades protected by timelock" : contractCode.includes('proxy') ? "Vulnerability: Upgrades not protected by timelock" : "No upgrade mechanism found"
        ],
        risk_level: upgradabilityScore > 80 ? "Low" : upgradabilityScore > 60 ? "Medium" : "High"
      },
      behavior: {
        score: behaviorScore,
        details: [
          hasAccessControl ? "Proper access controls implemented" : "Vulnerability: Missing access controls",
          hasReentrancy ? "Vulnerability: Potential reentrancy risk in fund transfers" : "No reentrancy vulnerabilities found",
          contractCode.includes('event') ? "Events are emitted for important state changes" : "Vulnerability: Missing event emissions for state changes"
        ],
        risk_level: behaviorScore > 80 ? "Low" : behaviorScore > 60 ? "Medium" : "High"
      }
    };
  };
  
  export const translateContract = async (
    sourceCode: string, 
    targetLanguage: string
  ): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (targetLanguage === 'rust') {
      return `// Translated to Rust for Solana
  use solana_program::{
      account_info::{next_account_info, AccountInfo},
      entrypoint,
      entrypoint::ProgramResult,
      msg,
      program_error::ProgramError,
      pubkey::Pubkey,
  };
  use borsh::{BorshDeserialize, BorshSerialize};
  
  // State struct to replace Solidity contract
  #[derive(BorshSerialize, BorshDeserialize, Debug)]
  pub struct State {
      pub value: u64,
      pub owner: Pubkey,
  }
  
  // Program entrypoint
  entrypoint!(process_instruction);
  
  // Processing function for instructions
  pub fn process_instruction(
      program_id: &Pubkey,
      accounts: &[AccountInfo],
      instruction_data: &[u8],
  ) -> ProgramResult {
      // Get account iterator
      let accounts_iter = &mut accounts.iter();
      
      // Get accounts
      let state_account = next_account_info(accounts_iter)?;
      let user_account = next_account_info(accounts_iter)?;
      
      // Verify account ownership
      if state_account.owner != program_id {
          return Err(ProgramError::IncorrectProgramId);
      }
      
      // Deserialize state
      let mut state = State::try_from_slice(&state_account.data.borrow())?;
      
      // Basic auth check (similar to onlyOwner in Solidity)
      if !user_account.is_signer {
          return Err(ProgramError::MissingRequiredSignature);
      }
      
      // Logic would go here - this is just a placeholder based on common patterns
      
      // Serialize and save state
      state.serialize(&mut *state_account.data.borrow_mut())?;
      
      Ok(())
  }`;
    }
    
    if (targetLanguage === 'vyper') {
      return `# @version ^0.3.7
  
  # Storage variables
  value: public(uint256)
  owner: public(address)
  
  # Events
  event ValueChanged:
      new_value: uint256
      
  @external
  def __init__():
      """
      @notice Contract initializer
      """
      self.owner = msg.sender
      
  @external
  def set_value(_new_value: uint256):
      """
      @notice Sets a new value
      @param _new_value The new value to set
      """
      assert msg.sender == self.owner, "Only owner"
      self.value = _new_value
      log ValueChanged(_new_value)
      
  @view
  @external
  def get_value() -> uint256:
      """
      @notice Gets the current value
      @return The current stored value
      """
      return self.value`;
    }
    
    return `// Translated to ${targetLanguage}
  // This is a mock translation for demonstration purposes.
  // In a real implementation, the Venice AI would analyze your code
  // and provide an accurate translation to the target language.
  
  // Example translation pattern for ${targetLanguage}:
  // - Functions have been converted to the typical ${targetLanguage} syntax
  // - Data types have been adapted
  // - Platform-specific features have been implemented
  
  // The complete translation would be provided by the Venice AI service.`;
  };
  
  export const assessInsurance = async (
    contractCode: string, 
    tvl: number
  ): Promise<any> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Basic static analysis to make the demo more realistic
    const hasReentrancy = contractCode.includes('.call{value:') && !contractCode.includes('nonReentrant');
    const hasAccessControl = contractCode.includes('onlyOwner') || contractCode.includes('require(msg.sender ==');
    const hasSelfDestruct = contractCode.includes('selfdestruct') || contractCode.includes('suicide');
    
    // Calculate base risk score
    let riskScore = 60; // Start with medium risk
    
    if (hasReentrancy) riskScore -= 20;
    if (!hasAccessControl) riskScore -= 15;
    if (hasSelfDestruct) riskScore -= 10;
    
    // Adjust for TVL
    const tvlFactor = tvl > 10000000 ? 1.2 : tvl > 1000000 ? 1.1 : 1;
    riskScore = Math.max(0, Math.min(100, riskScore / tvlFactor));
    
    // Calculate premium percentage based on risk score
    const premiumPercentage = riskScore > 75 ? 2 : riskScore > 50 ? 5 : 10;
    
    // Determine coverage limit based on TVL
    const coverageLimit = Math.min(tvl, 10000000);
    
    return {
      risk_score: Math.round(riskScore),
      premium_percentage: premiumPercentage,
      coverage_limit: `$${coverageLimit.toLocaleString()}`,
      risk_factors: [
        hasReentrancy ? "High-risk: Potential reentrancy vulnerability" : "No reentrancy vulnerabilities detected",
        !hasAccessControl ? "Medium-risk: Inadequate access controls" : "Proper access controls implemented",
        hasSelfDestruct ? "Medium-risk: Contains selfdestruct functionality" : "No selfdestruct mechanism found",
        contractCode.includes('tx.origin') ? "High-risk: Using tx.origin for authentication" : "Proper authentication mechanisms"
      ],
      risk_level: riskScore > 75 ? "Low" : riskScore > 50 ? "Medium" : "High",
      policy_recommendations: [
        `Premium: ${premiumPercentage}% of coverage amount annually`,
        `Coverage Limit: Up to $${coverageLimit.toLocaleString()}`,
        `Deductible: ${riskScore > 75 ? "10%" : riskScore > 50 ? "20%" : "30%"} of claimed amount`,
        riskScore < 50 ? "Requires security improvements before full coverage" : "Standard coverage available"
      ],
      exclusions: [
        "Intentionally planted vulnerabilities",
        "Losses due to admin key compromise",
        "Issues present in dependent contracts or oracles",
        "Vulnerabilities disclosed prior to policy issuance",
        hasSelfDestruct ? "Losses from selfdestruct function usage" : null,
        hasReentrancy ? "Certain classes of reentrancy attacks" : null
      ].filter(Boolean)
    };
  };