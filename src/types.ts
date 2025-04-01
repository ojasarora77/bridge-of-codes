export interface InsuranceAssessmentResult {
    risk_score: number;
    premium_percentage: number;
    coverage_limit: string;
    risk_factors: string[];
    risk_level: 'Low' | 'Medium' | 'High';
    policy_recommendations: string[];
    exclusions: string[];
  }