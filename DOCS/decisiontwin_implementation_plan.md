# DecisionTwin: 48-Hour Implementation Plan 🚀

This document breaks down the DecisionTwin architecture into a very specific, actionable 48-hour execution plan. Stick to this timeline to ensure you have a polished, working prototype by submission time.

---

## Phase 1: Foundation & "Hello World" Deployment
**Goal:** Prove the infrastructure works. Do not write feature code until this phase is done.
**Estimated Time:** 4–6 Hours

### Frontend (Next.js & Firebase)
- [ ] Initialize a new Next.js application: `npx create-next-app@latest decisiontwin-ui`.
- [ ] Install Tailwind CSS and verify it builds.
- [ ] Install Tremor and Lucide React icons: `npm install @tremor/react lucide-react`.
- [ ] Initialize Firebase project via Firebase Console.
- [ ] Set up Firebase Hosting: `firebase init hosting` (ensure you opt into Web Frameworks support).
- [ ] **Deploy:** Push a "Hello World" Next.js page to Firebase Hosting to verify live CI/CD or manual deployment works.

### Backend (FastAPI & Cloud Run)
- [ ] Initialize a Python environment (e.g., `venv` or `poetry`).
- [ ] Install core dependencies: `pip install fastapi uvicorn google-cloud-aiplatform pandas scikit-learn fairlearn pydantic`.
- [ ] Create a trivial `main.py` with a simple `/health` endpoint returning `{"status": "ok"}`.
- [ ] Write a `Dockerfile` for the Python backend.
- [ ] **Deploy:** Use Google Cloud SDK to build and deploy to Cloud Run: `gcloud run deploy decisiontwin-api --source . --allow-unauthenticated`.
- [ ] **Connect:** Fetch the live Cloud Run `/health` url from your deployed Next.js frontend to prove Cross-Origin Resource Sharing (CORS) is correctly configured.

---

## Phase 2: Synthetic Data & The Baseline
**Goal:** We need data to visualize. We'll use Gemini to generate it.
**Estimated Time:** 6–8 Hours

### AI Integration
- [ ] Authenticate your local environment with GCP (Vertex AI): `gcloud auth application-default login`.
- [ ] In FastAPI, create a `/generate-synthetic-data` endpoint.
- [ ] Initialize `google-cloud-aiplatform` with Gemini 1.5 Pro.
- [ ] **Prompt Engineering:** Write a highly specific prompt instructing Gemini to return a JSON array containing synthetic "Persona" objects (age, gender, income, algorithmic decision outcome, etc.).
- [ ] Set `response_mime_type="application/json"` in the Gemini API call to guarantee structured output.
- [ ] Save this generated data locally as a JSON fixture to use for the next phase (saves API calls and time).

---

## Phase 3: The Core ML Model & Bias Logic
**Goal:** Implement the "Decision" and "Twin" (Simulation) logic.
**Estimated Time:** 10–12 Hours

### Backend Logic
- [ ] Create a basic Scikit-learn model (e.g., Logistic Regression) that makes a binary classification decision (e.g., Loan Approval, Hiring Decision) based on the synthetic data.
- [ ] **Introduce Bias:** Intentionally skew the synthetic data or the model's weights to exhibit bias against a specific protected demographic.
- [ ] **Measure Bias:** Implement Fairlearn to measure the disparity (e.g., Demographic Parity Difference, Equalized Odds).
- [ ] Create an endpoint `/simulate-bias` that takes adjusted parameters from the frontend and returns the new disparity metrics.

---

## Phase 4: Data Visualization UI & State
**Goal:** Make the ML data look beautiful and interactive.
**Estimated Time:** 10–12 Hours

### Frontend UI
- [ ] Setup **Zustand** store to manage simulation parameters (e.g., sliders for "Model Fairness Weight", "Demographic Distribution").
- [ ] Setup **React Query** (`@tanstack/react-query`) to handle POST requests to `/simulate-bias`.
- [ ] **Build the Dashboard:**
  - Create a KPI Header section using Tremor's `Card` and `Metric` components showing current bias levels.
  - Create a Before/After comparison area.
  - Use Tremor's `BarChart` or `LineChart` to visualize the disparity across demographics.
- [ ] Hook the Zustand parameter sliders to the React Query network request to make the dashboard dynamic.

---

## Phase 5: The "Executive Report" & Polish
**Goal:** Tie it all together to impress the judges.
**Estimated Time:** 6–8 Hours

### Humanizing the Data
- [ ] Create a FastAPI endpoint `/generate-report`.
- [ ] Have this endpoint accept the final Fairlearn statistical outputs.
- [ ] Pass these metrics to Gemini 1.5 Pro with a prompt: *"Act as an AI Ethics consultant. Given these statistical biases, write a 2-paragraph summary explaining the business impact and risk to non-technical executives."*
- [ ] Display this generated text readout on the frontend dashboard next to the charts.

### The Final Polish
- [ ] Tweak Tailwind styling (colors, spacing, typography) to make the UI look premium.
- [ ] Ensure the UI handles loading states cleanly (add basic spinners when waiting for GCP Model / Gemini responses).
- [ ] Re-deploy everything to Firebase / Cloud Run and perform a full end-to-end user test.
- [ ] Prepare your Hackathon pitch!
