import axios from 'axios';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export const analyzeContract = async (contractCode: string): Promise<any> => {
  try {
    const messages: Message[] = [
      {
        role: 'system',
        content: `You are a smart contract security analyzer. Analyze the following contract for vulnerabilities and security issues. 
        Respond with a JSON object that has the following structure:
        {
          "overall_score": number from 0-100,
          "complexity": {
            "score": number from 0-100,
            "details": array of strings with findings,
            "risk_level": "Low", "Medium", or "High"
          },
          "vulnerabilities": {
            "score": number from 0-100,
            "details": array of strings describing vulnerabilities,
            "risk_level": "Low", "Medium", or "High"
          },
          "upgradability": {
            "score": number from 0-100,
            "details": array of strings with findings,
            "risk_level": "Low", "Medium", or "High"
          },
          "behavior": {
            "score": number from 0-100,
            "details": array of strings with findings,
            "risk_level": "Low", "Medium", or "High"
          }
        }`
      },
      {
        role: 'user',
        content: `Analyze this smart contract:\n\n${contractCode}`
      }
    ];

    const response = await axios.post(
      'https://api.venice.is/api/v1/chat/completions',
      {
        model: 'llama-3.3-70b',
        messages: messages,
        temperature: 0.1,
        max_tokens: 3000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_VENICE_API_KEY}`
        }
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Try to parse the response as JSON
    try {
      // Extract JSON object if it's embedded in markdown or text
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) || 
                        content.match(/{[\s\S]*?}/);
                        
      const jsonStr = jsonMatch ? jsonMatch[0].replace(/```json\n|```\n|```/g, '') : content;
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse JSON from API response:", e);
      // Return the raw content as a fallback
      return {
        overall_score: 50,
        complexity: {
          score: 50,
          details: ["Failed to parse structured analysis"],
          risk_level: "Medium"
        },
        vulnerabilities: {
          score: 50,
          details: [content],
          risk_level: "Medium"
        },
        upgradability: {
          score: 50,
          details: ["Failed to parse structured analysis"],
          risk_level: "Medium"
        },
        behavior: {
          score: 50,
          details: ["Failed to parse structured analysis"],
          risk_level: "Medium"
        }
      };
    }
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
): Promise<any> => {
  try {
    const messages: Message[] = [
      {
        role: 'system',
        content: `You are an expert in smart contract risk assessment and insurance. 
        Analyze the provided contract to determine its risk level and appropriate insurance premium 
        recommendations. Consider factors like reentrancy, access control, overflow/underflow, and 
        overall code quality. For a contract with TVL (Total Value Locked) of $${tvl}, 
        recommend an appropriate premium percentage and coverage terms.
        
        Respond with a JSON object with this structure:
        {
          "risk_score": number from 0-100,
          "premium_percentage": number (e.g., 2.5 for 2.5%),
          "coverage_limit": string (e.g., "$1,000,000"),
          "risk_factors": array of strings describing risk factors,
          "risk_level": "Low", "Medium", or "High",
          "policy_recommendations": array of strings with policy details,
          "exclusions": array of strings listing what wouldn't be covered
        }`
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

    const content = response.data.choices[0].message.content;
    
    // Try to parse the response as JSON
    try {
      // Extract JSON object if it's embedded in markdown or text
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) || 
                        content.match(/{[\s\S]*?}/);
                        
      const jsonStr = jsonMatch ? jsonMatch[0].replace(/```json\n|```\n|```/g, '') : content;
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse JSON from API response:", e);
      // Return the raw content as a fallback
      return {
        risk_score: 50,
        premium_percentage: 5,
        coverage_limit: `$${Math.floor(tvl * 0.8).toLocaleString()}`,
        risk_factors: [content],
        risk_level: "Medium",
        policy_recommendations: ["Standard coverage recommended"],
        exclusions: ["Intentional vulnerabilities", "Social engineering attacks"]
      };
    }
  } catch (error) {
    console.error('Error calling Venice API:', error);
    throw new Error('Failed to assess insurance risk. Please try again.');
  }
};