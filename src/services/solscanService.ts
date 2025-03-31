import axios from 'axios';

export const getSolanaProgram = async (programId: string): Promise<string> => {
  try {
    // The base URL for Solscan API
    const baseUrl = 'https://api.solscan.io';
    
    // First, try to get the account information
    const accountResponse = await axios.get(`${baseUrl}/account/${programId}`, {
      headers: {
        'Accept': 'application/json',
        'Token': process.env.REACT_APP_SOLSCAN_API_KEY || ''
      }
    });
    
    // Check if it's a program account
    if (accountResponse.data && accountResponse.data.type === 'program') {
      // Try to get program info if available
      try {
        const programInfoResponse = await axios.get(`${baseUrl}/account/exportProgramInfo?address=${programId}`, {
          headers: {
            'Accept': 'application/json',
            'Token': process.env.REACT_APP_SOLSCAN_API_KEY || ''
          }
        });
        
        if (programInfoResponse.data && programInfoResponse.data.source) {
          return programInfoResponse.data.source;
        }
      } catch (infoError) {
        console.warn('Could not fetch program info:', infoError);
      }
      
      // Look for GitHub link in account data
      if (accountResponse.data.externalLinks) {
        const githubLink = accountResponse.data.externalLinks.find(
          (link: any) => link.includes('github.com')
        );
        
        if (githubLink) {
          return `// Source code available at: ${githubLink}\n// Please visit the repository to view the complete Rust source code.`;
        }
      }
      
      // Return basic information if available
      return `// Solana Program ID: ${programId}\n// Name: ${accountResponse.data.name || 'Unknown'}\n\n// The source code for this Solana program is not directly available via Solscan.\n// You may need to check the project's GitHub repository or documentation.`;
    }
    
    // If it's not a program account
    return `// The address ${programId} is not a Solana program account.\n// Please verify the program ID and try again.`;
    
  } catch (error) {
    console.error('Error fetching from Solscan:', error);
    
    // More helpful error message for debugging
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Solscan API error: ${error.response.status} - ${error.response.statusText}`);
    }
    
    throw new Error('Failed to retrieve program information from Solscan');
  }
};