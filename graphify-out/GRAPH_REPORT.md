# Graph Report - Solution Challange 2026  (2026-06-15)

## Corpus Check
- 39 files · ~40,195 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 263 nodes · 392 edges · 24 communities detected
- Extraction: 68% EXTRACTED · 32% INFERRED · 0% AMBIGUOUS · INFERRED: 124 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]

## God Nodes (most connected - your core abstractions)
1. `SimulationCritic` - 40 edges
2. `ComplianceAuditor` - 30 edges
3. `PersonaGenerator` - 30 edges
4. `DecisionTwin High-Level Architecture & Tech Stack` - 16 edges
5. `DecisionTwin Product Requirements Document` - 13 edges
6. `DecisionTwin Comprehensive System Overview` - 10 edges
7. `probe_agent3_compliance()` - 9 edges
8. `DecisionTwin Current Working Features & Tech Stack` - 9 edges
9. `probe_crash_test_json()` - 8 edges
10. `parseJson()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `probe_bias_to_dollar()` --calls--> `SimulationCritic`  [INFERRED]
  decisiontwin-api\deep_diagnostic.py → decisiontwin-api\agents\simulation_critic.py
- `probe_crash_test_json()` --calls--> `PersonaGenerator`  [INFERRED]
  decisiontwin-api\deep_diagnostic.py → decisiontwin-api\agents\persona_generator.py
- `probe_agent3_compliance()` --calls--> `ComplianceAuditor`  [INFERRED]
  decisiontwin-api\deep_diagnostic.py → decisiontwin-api\agents\compliance_auditor.py
- `╔══════════════════════════════════════════════════════════════════════════════╗` --uses--> `SimulationCritic`  [INFERRED]
  decisiontwin-api\deep_diagnostic.py → decisiontwin-api\agents\simulation_critic.py
- `╔══════════════════════════════════════════════════════════════════════════════╗` --uses--> `PersonaGenerator`  [INFERRED]
  decisiontwin-api\deep_diagnostic.py → decisiontwin-api\agents\persona_generator.py

## Hyperedges (group relationships)
- **Bias Detection ML Pipeline** — decisiontwin_architecture_fairlearn, decisiontwin_architecture_scikit_learn, decisiontwin_architecture_pandas [INFERRED 0.90]
- **Google Cloud Platform Infrastructure Stack** — decisiontwin_architecture_gemini_pro, decisiontwin_architecture_cloud_run, decisiontwin_architecture_firebase_hosting [INFERRED 0.85]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (38): BaseModel, ComplianceAuditor, Ingests the simulation results, including demographics parity curves and Gemma's, compliance_scorecard(), ensure_mock_packs(), generate_detailed_report(), generate_report(), generate_synthetic_data() (+30 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (49): Dark Mode Design System, Diverging Area Charts for Bias Visualization, DecisionTwin Visual Identity & UI/UX Style Guide, Framer Motion, Glassmorphism Card Design, Semantic Ethics Color Palette, Gemini Forensic Audit Report Generation, Baseline Fairness Dashboard (+41 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (13): Runs the Dynamic Doppelgänger Test (Counterfactual Audit).     Returns the perc, run_doppelganger(), Create a simple legal-readiness scorecard for the current simulation run., Loads a model (.pkl or .onnx)., Performs model inference, automatically handling pipeline, sklearn models, or ON, Applies mathematical state transitions based on decisions:         - Lending: a, Calculates demographic parity ratio, difference, and disparate impact ratio., Queries Gemma 2 using Vertex AI or Ollama Local API. (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.28
Nodes (13): Generates a comprehensive ~1500-word, 7-section legal audit report using, broken(), fail(), info(), ok(), probe_agent3_compliance(), probe_bias_to_dollar(), probe_crash_test_json() (+5 more)

### Community 4 - "Community 4"
Cohesion: 0.18
Nodes (12): ApiError, explainDoppelganger(), generateDetailedReport(), getSession(), overrideDecision(), parseJson(), runCrashTest(), runDoppelganger() (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.23
Nodes (13): buildHeatmap(), calendarYearToSimulationYear(), formatCohortSize(), getMetricsForCalendarYear(), mapAdversarialPersonaToUI(), mapBusinessImpactToKpis(), mapSimulationToDashboardKpis(), mapYearlyResultsToTimeline() (+5 more)

### Community 6 - "Community 6"
Cohesion: 0.29
Nodes (2): Wait for the FastAPI server to be reachable., wait_for_server()

### Community 7 - "Community 7"
Cohesion: 0.6
Nodes (5): create_hiring_data(), create_lending_data(), create_scholarship_data(), main(), train_and_save_model()

### Community 8 - "Community 8"
Cohesion: 0.33
Nodes (4): Agent 1: Digital Crash-Test Dummies.     Generates intersectional edge-case syn, run_crash_test(), Agent 1: Adversarial Stress Tester.         Generates intersectional edge-case, Heuristic mock fallback for crash-test dummies.

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (6): Time-Travel Slider, Fairlearn, Scikit-learn, Rationale: Why Fairlearn, 80% Rule / Disparate Impact Threshold, Bias Simulation Engine Endpoint

### Community 13 - "Community 13"
Cohesion: 0.67
Nodes (1): EnsureMockPacksTests

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (1): Render-compatible entrypoint. Reads PORT from the environment so the process al

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (1): Ingests the base dataframe, analyzes schema and values, and generates         di

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (1): Fallback mock generator using simple random variations of the base dataset

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (1): Loads a model (.pkl or .onnx).

### Community 40 - "Community 40"
Cohesion: 1.0
Nodes (1): Performs model inference, automatically handling pipeline, sklearn models, or ON

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (1): Applies mathematical state transitions based on decisions:         - Lending: ap

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (1): Calculates demographic parity ratio, difference, and disparate impact ratio.

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (1): Runs the multi-year longitudinal simulation.         Applies decisions, HITL ove

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (1): Recharts

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (1): Tailwind CSS

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (1): Shadcn/UI

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (1): Docker

### Community 48 - "Community 48"
Cohesion: 1.0
Nodes (1): Pandas

## Knowledge Gaps
- **45 isolated node(s):** `Render-compatible entrypoint. Reads PORT from the environment so the process al`, `Wait for the FastAPI server to be reachable.`, `Ingests the simulation results, including demographics parity curves and Gemma's`, `Generates a comprehensive ~1500-word, 7-section legal audit report using`, `Ingests the base dataframe, analyzes schema and values, and generates         d` (+40 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 6`** (7 nodes): `test_domain_agnostic.py`, `Wait for the FastAPI server to be reachable.`, `test_1_cross_domain_ingestion()`, `test_2_agent1_context_adaptation()`, `test_3_agent2_dynamic_transition()`, `test_4_agent3_regulatory_shift()`, `wait_for_server()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (3 nodes): `test_mock_pack_validation.py`, `EnsureMockPacksTests`, `.test_regenerates_missing_mock_pack()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (2 nodes): `start.py`, `Render-compatible entrypoint. Reads PORT from the environment so the process al`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `Ingests the base dataframe, analyzes schema and values, and generates         di`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `Fallback mock generator using simple random variations of the base dataset`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `Loads a model (.pkl or .onnx).`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `Performs model inference, automatically handling pipeline, sklearn models, or ON`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (1 nodes): `Applies mathematical state transitions based on decisions:         - Lending: ap`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `Calculates demographic parity ratio, difference, and disparate impact ratio.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `Runs the multi-year longitudinal simulation.         Applies decisions, HITL ove`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `Recharts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `Tailwind CSS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (1 nodes): `Shadcn/UI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (1 nodes): `Docker`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `Pandas`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SimulationCritic` connect `Community 2` to `Community 0`, `Community 8`, `Community 3`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `PersonaGenerator` connect `Community 0` to `Community 8`, `Community 2`, `Community 3`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `ComplianceAuditor` connect `Community 0` to `Community 8`, `Community 2`, `Community 3`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 27 inferred relationships involving `SimulationCritic` (e.g. with `╔══════════════════════════════════════════════════════════════════════════════╗` and `SyntheticDataRequest`) actually correct?**
  _`SimulationCritic` has 27 INFERRED edges - model-reasoned connections that need verification._
- **Are the 24 inferred relationships involving `ComplianceAuditor` (e.g. with `╔══════════════════════════════════════════════════════════════════════════════╗` and `SyntheticDataRequest`) actually correct?**
  _`ComplianceAuditor` has 24 INFERRED edges - model-reasoned connections that need verification._
- **Are the 24 inferred relationships involving `PersonaGenerator` (e.g. with `╔══════════════════════════════════════════════════════════════════════════════╗` and `SyntheticDataRequest`) actually correct?**
  _`PersonaGenerator` has 24 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `DecisionTwin Product Requirements Document` (e.g. with `DecisionTwin 48-Hour Implementation Plan` and `DecisionTwin Comprehensive System Overview`) actually correct?**
  _`DecisionTwin Product Requirements Document` has 2 INFERRED edges - model-reasoned connections that need verification._