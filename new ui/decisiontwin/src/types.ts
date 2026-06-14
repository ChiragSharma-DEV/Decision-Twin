export interface Persona {
  id: string;
  name: string;
  role: string;
  category: "credit" | "education" | "employment" | "hr";
  avatar: string;
  gender: string;
  income: string;
  education: string;
  disability: string;
  location: string;
  approvalProbability: number; // 0 to 100
  riskScore: number; // 0 to 100
  vulnerability: string; // "Low" | "Medium" | "High" | "Critical"
  vulnerabilityDetail: string;
  outcome: string;
  heatmap: number[]; // simulated data array
  creditScore: number;
}

export interface PolicyState {
  creditThreshold: number;
  interestRate: number;
  scholarshipCutoff: number;
  hiringCriteria: number;
  protectedAttributesFilter: boolean;
  timeHorizon: 5 | 10 | 20;
}

export interface SimulationResult {
  approvalChange: number; // positive or negative percentage
  fairnessChange: number; // percentage
  revenueChange: number; // positive or negative in ₹ INR Crores
  socialImpactChange: number; // percentage
  regulatoryRiskChange: number; // percentage
}

export interface DoppelgangerModel {
  original: {
    name: string;
    gender: string;
    income: number;
    creditScore: number;
    decision: "Approved" | "Rejected";
  };
  cloned: {
    gender: string;
    income: number;
    creditScore: number;
    decision: "Approved" | "Rejected";
  };
  biasScore: number;
  systemicProbability: string;
}

export interface ModelMetric {
  name: string;
  accuracy: number;
  fairness: number;
  compliance: number;
  explainability: number;
  riskScore: number;
  governanceScore: number;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  region: string;
  percentage: number;
  status: "Pass" | "Monitor" | "Non-Compliant" | "Exempt";
  gaps: string[];
}

export interface MapRegion {
  id: string;
  stateName: string;
  approvalRate: number;
  biasHotspot: "Critical" | "High" | "Moderate" | "Low";
  riskClusterScore: number;
  impactedCount: number;
  coordinates: [number, number]; // custom placement
  svgPathClose?: string; // fallback mapping usage
}
