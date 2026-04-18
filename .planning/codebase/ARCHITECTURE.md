# Architecture

**Date:** 2026-04-19

## System Pattern
Decoupled client-server architecture. The backend acts as a stateless microservice running machine learning operations and communicating with Vertex AI, while the Next.js frontend manages the simulation state locally with Zustand and handles visualization.

## Layers & Components
1. **Frontend UI Layer (Next.js):**
   - `decisiontwin-ui/`
   - Handles dataset upload, UI visualization (Tremor charts), and the Time-Travel Slider.
2. **Backend API Layer (FastAPI):**
   - `decisiontwin-api/main.py`
   - Provides REST endpoints (`/health`, `/generate-synthetic-data`, `/simulate-bias`, `/generate-report`).
3. **Machine Learning Engine Layer:**
   - Scikit-learn and Fairlearn run synchronously inside FastAPI routes for computing demographic parity and disparate impact.
4. **AI Capabilities Layer:**
   - Integrates Gemini 1.5 Pro for generating millions of synthetic personas with complex trait interactions.

## Data Flow
- CSV Upload -> Next.js parses features -> Sends metadata to API.
- API prompts Gemini -> Receives synthetic personas -> Next.js displays initial Sandbox.
- Sim Slider scrubbing -> Zustand tracks state -> Calls API for next year extrapolation.
