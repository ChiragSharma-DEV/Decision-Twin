export interface FairnessMetrics {
  demographic_parity_ratio: number;
  demographic_parity_diff: number;
  disparate_impact: number;
}

export interface BorderlineCase {
  row_index: number;
  traits: Record<string, unknown>;
  model_decision: number;
  actual_decision: number;
  is_overridden: boolean;
}

export interface YearlyResult {
  year: number;
  metrics: FairnessMetrics;
  average_target_rate: number;
  borderline_cases: BorderlineCase[];
  data_snapshot?: Record<string, unknown>[];
  decisions?: number[];
}

export interface BusinessImpact {
  financial_loss_amount: number;
  currency_formatted: string;
  impact_statement: string;
}

export interface AdversarialPersona {
  persona_id: string;
  traits: Record<string, unknown>;
  metadata?: string | Record<string, unknown>;
}

export interface SimulationResponse {
  status: string;
  years_simulated: number;
  adversarial_personas_count: number;
  adversarial_personas: AdversarialPersona[];
  gemma_critique: string;
  yearly_results: YearlyResult[];
  business_impact?: BusinessImpact;
}

export interface SessionState {
  has_data: boolean;
  model_path: string | null;
  domain: string;
  protected_attribute: string;
  target_outcome: string;
  years_simulated: number;
  row_count: number;
  columns: string[];
}

export interface UploadDataResponse {
  status: string;
  message: string;
  columns: string[];
  row_count: number;
  custom_model_uploaded?: boolean;
}

export interface DoppelgangerPayload {
  original: {
    name: string;
    gender: string;
    income: number;
    creditScore: number;
    decision: string;
  };
  cloned: {
    gender: string;
    income: number;
    creditScore: number;
    decision: string;
  };
  biasScore: number;
}

export interface DoppelgangerExplainResponse {
  explanation: string;
}

export interface DashboardYearMetrics {
  fairness: number;
  riskAccumulation: number;
  approvalRate: number;
  disparityEvolution: number;
  feedbackScore: number;
}

export interface DashboardKpis {
  govScore: number;
  compliancePct: number;
  fairnessPct: number;
  revenueDisplay: string;
  cohortDisplay: string;
  projectedFineDisplay: string;
  fineSubtitle: string;
  govSubtitle: string;
  complianceSubtitle: string;
  fairnessSubtitle: string;
  revenueSubtitle: string;
}
