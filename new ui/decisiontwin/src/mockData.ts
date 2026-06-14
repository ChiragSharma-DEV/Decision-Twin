import { Persona, ComplianceFramework, MapRegion, ModelMetric } from "./types";

export const INITIAL_PERSONAS: Persona[] = [
  {
    id: "dummy-1",
    name: "Priyanka Sen",
    role: "Low Income Female Applicant",
    category: "credit",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    gender: "Female",
    income: "₹50,000 / month",
    education: "Bachelor's Degree",
    disability: "None",
    location: "Kolkata, West Bengal (Socio-economic Tier 3 Zone)",
    approvalProbability: 38,
    riskScore: 68,
    creditScore: 710,
    vulnerability: "High",
    vulnerabilityDetail: "Compounding proxy penalty due to low residential pincode profile and high dependent ratio in background metrics.",
    outcome: "Rejected by credit automated scoring model due to historical demographic credit clusters.",
    heatmap: [80, 75, 60, 48, 38, 35, 30, 28, 25, 20]
  },
  {
    id: "dummy-2",
    name: "Aditya Murthy",
    role: "Disabled Rural Student",
    category: "education",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    gender: "Male",
    income: "₹18,000 / month",
    education: "High School Completer",
    disability: "Locomotor Disability",
    location: "Chitradurga, Karnataka (Remote Rural)",
    approvalProbability: 41,
    riskScore: 74,
    creditScore: 590,
    vulnerability: "Critical",
    vulnerabilityDetail: "Excluded by remote attendance frequency algorithms and credit risk proxies mapping physical mobility constraints with micro-repayment likelihoods.",
    outcome: "Blocked from premier education tech loan scheme by standard automated risk-rating engine.",
    heatmap: [65, 59, 50, 45, 41, 40, 38, 36, 35, 33]
  },
  {
    id: "dummy-3",
    name: "Arshad Rahim",
    role: "Minority Community Candidate",
    category: "employment",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    gender: "Male",
    income: "₹42,000 / month",
    education: "Master in Computer Applications",
    disability: "None",
    location: "Malappuram, Kerala",
    approvalProbability: 49,
    riskScore: 52,
    creditScore: 680,
    vulnerability: "Medium",
    vulnerabilityDetail: "Name-matching bias filters penalize historical hiring probability based on ethnic classification datasets.",
    outcome: "Flagged for manual review which historically converts to 84% pre-interview dropouts.",
    heatmap: [85, 78, 70, 60, 52, 49, 48, 47, 46, 45]
  },
  {
    id: "dummy-4",
    name: "Sunitha Rao",
    role: "Single Parent Applicant",
    category: "hr",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    gender: "Female",
    income: "₹35,000 / month",
    education: "Diploma in Nursing",
    disability: "None",
    location: "Vellore, Tamil Nadu",
    approvalProbability: 26,
    riskScore: 82,
    creditScore: 610,
    vulnerability: "High",
    vulnerabilityDetail: "Gap in employment history during maternity leave flag triggers high attrition prediction nodes in recruitment scoring model.",
    outcome: "Filtered out from administrative head nurse shortlist by career longevity score prediction.",
    heatmap: [60, 50, 42, 35, 26, 22, 18, 15, 10, 8]
  },
  {
    id: "dummy-5",
    name: "Karan Johal",
    role: "First Generation Graduate",
    category: "employment",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    gender: "Male",
    income: "₹28,000 / month",
    education: "B.Tech Mechanical (Tier 3 College)",
    disability: "None",
    location: "Rudrapur, Uttarakhand",
    approvalProbability: 55,
    riskScore: 48,
    creditScore: 720,
    vulnerability: "Medium",
    vulnerabilityDetail: "Lack of alumni network density mapping and legacy premium employer proxies penalizes general tier-3 institutional grads.",
    outcome: "Offered entry-level salary track 35% lower than peers with equivalent coding scores.",
    heatmap: [70, 68, 62, 58, 55, 54, 53, 52, 51, 50]
  },
  {
    id: "dummy-6",
    name: "Sophia Myat",
    role: "Refugee Applicant",
    category: "credit",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    gender: "Female",
    income: "₹22,000 / month",
    education: "Dentist (Non-Equivalence Certified)",
    disability: "None",
    location: "New Delhi, NCR",
    approvalProbability: 14,
    riskScore: 91,
    creditScore: 500,
    vulnerability: "Critical",
    vulnerabilityDetail: "Absolute lockouts caused by null parameters on domicile residency history, lack of long-term pan card scoring, and stateless status codes.",
    outcome: "Instant declination of all digital wallet credentials and business start-up loans.",
    heatmap: [30, 24, 20, 16, 14, 12, 10, 8, 5, 2]
  }
];

export const INITIAL_COMPLIANCE: ComplianceFramework[] = [
  {
    id: "comp-1",
    name: "RBI Digital Lending Guidelines",
    region: "India",
    percentage: 96,
    status: "Pass",
    gaps: [
      "Explicit audit logs for secondary proxy models",
      "Explainability constraints for automatic cooling periods"
    ]
  },
  {
    id: "comp-2",
    name: "NITI Aayog Responsible AI Strategy",
    region: "India",
    percentage: 92,
    status: "Pass",
    gaps: [
      "Inclusion metrics validation in rural clusters",
      "Staged multi-agent bias checking reviews"
    ]
  },
  {
    id: "comp-3",
    name: "DPDP Act (Digital Personal Data Protection)",
    region: "India",
    percentage: 88,
    status: "Monitor",
    gaps: [
      "Explicit consent models on prediction-based profiles",
      "Data portability in algorithmic retraining logs"
    ]
  },
  {
    id: "comp-4",
    name: "EU AI Act (High-Risk Sandbox Classification)",
    region: "Global",
    percentage: 79,
    status: "Monitor",
    gaps: [
      "Real-time technical documentation logging for bias tracking",
      "Digital doppelganger simulation compliance reports for regulatory checkups"
    ]
  },
  {
    id: "comp-5",
    name: "OECD AI Principles",
    region: "Global",
    percentage: 95,
    status: "Pass",
    gaps: [
      "Robustness and safety risk logging logs API",
      "Algorithmic impact statement automation"
    ]
  },
  {
    id: "comp-6",
    name: "ISO/IEC 42001 (AI Management System)",
    region: "Global",
    percentage: 100,
    status: "Pass",
    gaps: []
  }
];

export const INITIAL_MAP_REGIONS: MapRegion[] = [
  {
    id: "map-north",
    stateName: "North Zone (NCR, Punjab, Haryana)",
    approvalRate: 84,
    biasHotspot: "Low",
    riskClusterScore: 18,
    impactedCount: 320000,
    coordinates: [120, 140]
  },
  {
    id: "map-west",
    stateName: "West Zone (Maharashtra, Gujarat, Goa)",
    approvalRate: 72,
    biasHotspot: "Moderate",
    riskClusterScore: 42,
    impactedCount: 450000,
    coordinates: [90, 260]
  },
  {
    id: "map-south",
    stateName: "South Zone (Karnataka, TN, AP, Kerala)",
    approvalRate: 91,
    biasHotspot: "Low",
    riskClusterScore: 12,
    impactedCount: 510000,
    coordinates: [130, 360]
  },
  {
    id: "map-east",
    stateName: "East Zone (West Bengal, Bihar, Odisha)",
    approvalRate: 48,
    biasHotspot: "High",
    riskClusterScore: 78,
    impactedCount: 280000,
    coordinates: [240, 220]
  },
  {
    id: "map-northeast",
    stateName: "North-East Zone (Assam, Meghalaya etc)",
    approvalRate: 35,
    biasHotspot: "Critical",
    riskClusterScore: 92,
    impactedCount: 140000,
    coordinates: [290, 180]
  },
  {
    id: "map-central",
    stateName: "Central Zone (MP, Chhattisgarh)",
    approvalRate: 59,
    biasHotspot: "High",
    riskClusterScore: 68,
    impactedCount: 190000,
    coordinates: [150, 240]
  }
];

export const INITIAL_MODELS: ModelMetric[] = [
  {
    name: "Logistic Regression (Baseline)",
    accuracy: 78,
    fairness: 86,
    compliance: 94,
    explainability: 98,
    riskScore: 28,
    governanceScore: 91
  },
  {
    name: "Random Forest Sandbox",
    accuracy: 84,
    fairness: 82,
    compliance: 89,
    explainability: 74,
    riskScore: 42,
    governanceScore: 83
  },
  {
    name: "XGBoost Credit Classifier",
    accuracy: 91,
    fairness: 64,
    compliance: 71,
    explainability: 45,
    riskScore: 69,
    governanceScore: 72
  },
  {
    name: "Deep Neural Network",
    accuracy: 94,
    fairness: 58,
    compliance: 66,
    explainability: 18,
    riskScore: 84,
    governanceScore: 65
  },
  {
    name: "DecisionTwin Guardrailed Model",
    accuracy: 89,
    fairness: 97,
    compliance: 98,
    explainability: 94,
    riskScore: 12,
    governanceScore: 98
  }
];

// High-fidelity Policy Lab simulator calculator
export function calculatePolicySimulation(
  threshold: number,
  rate: number,
  cutoff: number,
  criteria: number,
  protectedFilterEnabled: boolean,
  horizon: number
) {
  // Let's create realistic, highly reactive mock dynamic results
  const baseApproval = 42;
  const baseFairness = 72;
  const baseRevenue = 2.4; // Crores Saved
  const baseSocialImpact = 65;
  const baseRegulatoryRisk = 38;

  // Modifiers based on sliders
  // Threshold slider: as threshold increases, approval rate goes down, revenue saved goes up, risk decreases
  const valThreshold = (threshold - 600) / 250; // normalized
  const appModByThreshold = -35 * valThreshold;
  const revModByThreshold = 4.2 * valThreshold;
  const riskModByThreshold = -25 * valThreshold;
  
  // Cutoff slider:
  const valCutoff = (cutoff - 50) / 50; // -1 to 1
  const fairnessModByCutoff = 15 * valCutoff * (protectedFilterEnabled ? 1.5 : 0.8);
  const socialModByCutoff = 20 * valCutoff;

  // Protected attributes filter:
  const filterFairnessBonus = protectedFilterEnabled ? 18 : -10;
  const filterRevenuePenalty = protectedFilterEnabled ? -0.8 : 1.2;
  const filterRiskReduction = protectedFilterEnabled ? -15 : 10;

  // Time horizon scaling: longer horizon amplifies compounding feedback loops
  const timeAmplifier = horizon === 20 ? 1.8 : horizon === 10 ? 1.2 : 0.8;

  // Compile
  const finalApprovalChange = Math.max(-50, Math.min(50, (appModByThreshold + 5) * timeAmplifier));
  const finalFairnessChange = Math.max(-30, Math.min(45, (fairnessModByCutoff + filterFairnessBonus) * timeAmplifier));
  const finalRevenueChange = Math.max(-1.5, Math.min(12, (revModByThreshold + filterRevenuePenalty) * timeAmplifier));
  const finalSocialImpactChange = Math.max(-40, Math.min(60, (socialModByCutoff + (protectedFilterEnabled ? 15 : -5)) * timeAmplifier));
  const finalRegulatoryRiskChange = Math.max(-80, Math.min(80, (riskModByThreshold + filterRiskReduction) * timeAmplifier));

  return {
    approvalChange: Math.round(finalApprovalChange),
    fairnessChange: Math.round(finalFairnessChange),
    revenueChange: Number(finalRevenueChange.toFixed(2)),
    socialImpactChange: Math.round(finalSocialImpactChange),
    regulatoryRiskChange: Math.round(finalRegulatoryRiskChange)
  };
}
