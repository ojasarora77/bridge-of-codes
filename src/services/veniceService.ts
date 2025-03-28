import axios from 'axios';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export const analyzeContract = async (contractCode: string): Promise<string> => {
  try {
    const messages: Message[] = [
      {
        role: 'system',
        content: `You are an expert smart contract auditor. Analyze the provided code for security vulnerabilities, 
        suggest improvements, and evaluate its overall risk level. Format your response in markdown with clear 
        sections for Critical, High, Medium, and Low severity issues. Include code examples for fixes.`
      },
      {
        role: 'user',
        content: `Analyze this smart contract for security vulnerabilities and suggest improvements:\n\n${contractCode}`
      }
    ];

    const response = await axios.post(
      'https://api.venice.is/api/v1/chat/completions',
      {
        model: 'llama-3.3-70b',
        messages: messages,
        temperature: 0.1,
        max_tokens: 2000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_VENICE_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Venice API:', error);
    throw new Error('Failed to analyze contract. Please try again.');
  }
};

export const translateContract = async (
  sourceCode: string, 
  targetLanguage: string
): Promise<string> => {
  try {
    const messages: Message[] = [
      {
        role: 'system',
        content: `You are an expert in blockchain development across multiple platforms. 
        Translate the provided smart contract code into ${targetLanguage} with appropriate 
        equivalent functionality. Include comments explaining key differences between the platforms.`
      },
      {
        role: 'user',
        content: `Translate this smart contract to ${targetLanguage}:\n\n${sourceCode}`
      }
    ];

    const response = await axios.post(
      'https://api.venice.is/api/v1/chat/completions',
      {
        model: 'llama-3.3-70b',
        messages,
        temperature: 0.1,
        max_tokens: 2000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_VENICE_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Venice API:', error);
    throw new Error(`Failed to translate contract to ${targetLanguage}. Please try again.`);
  }
};

export const assessInsurance = async (
  contractCode: string, 
  tvl: number
): Promise<string> => {
  try {
    const messages: Message[] = [
      {
        role: 'system',
        content: `You are an expert in smart contract risk assessment and insurance. 
        Analyze the provided contract to determine its risk level and appropriate insurance premium 
        recommendations. Consider factors like reentrancy, access control, overflow/underflow, and 
        overall code quality. For a contract with TVL (Total Value Locked) of $${tvl}, 
        recommend an appropriate premium percentage and coverage terms.`
      },
      {
        role: 'user',
        content: `Assess the insurance risk and premium for this smart contract with TVL of $${tvl}:\n\n${contractCode}`
      }
    ];

    const response = await axios.post(
      'https://api.venice.is/api/v1/chat/completions',
      {
        model: 'llama-3.3-70b',
        messages,
        temperature: 0.1,
        max_tokens: 2000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_VENICE_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Venice API:', error);
    throw new Error('Failed to assess insurance risk. Please try again.');
  }
};