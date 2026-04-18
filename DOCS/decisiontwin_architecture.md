# DecisionTwin: High-Level Architecture & Tech Stack
**Prepared by:** Cloud Solutions Architect (GDG Expert)
**Objective:** A high-speed, scalable, and integration-ready stack for a 48-hour hackathon build.

## 1. Frontend: High-Performance Data Visualization
* **Framework:** **Next.js (React)** 
  * Why: Provides out-of-the-box routing, API capabilities (if middleware is needed), and incredible developer velocity.
* **Component / UI Library:** **Tremor.so** combined with **Tailwind CSS**.
  * Why: Tremor provides beautifully designed, copy-paste dashboard components (charts, KPIs, tables) explicitly built for data visualization. You will skip 10+ hours of CSS work.
* **Complex Charting (Fallback):** **Recharts**
  * Why: If Tremor's built-in charts aren't specific enough for longitudinal bias simulation graphs, Recharts is the most reliable, declarative charting library for React.

## 2. Backend: ML Heavy-Lifting API
* **Framework:** **FastAPI (Python)**
  * Why: It’s the absolute gold standard for Python APIs right now. You get asynchronous route handling, automatic interactive API documentation (Swagger/OpenAPI for instantly testing endpoints), and it natively serializes Pydantic to JSON.
* **ML Ecosystem:** **Pandas, Scikit-learn, Fairlearn**
  * Why: Pandas for data manipulation, Scikit-learn for model handling, and Fairlearn to assess and mitigate "Invisible Bias."

## 3. AI: Gemini 1.5 Pro via Vertex AI
* **SDK:** `google-cloud-aiplatform` (Vertex AI SDK for Python)
* **Use Cases:**
  * **Synthetic Data Generation:** Feed Gemini 1.5 Pro a prompt outlining the schema and required distributions (e.g., demographic edge cases). Use Gemini's JSON format response to instantly stream synthetic personas and transaction histories into the simulation.
  * **Analyst Report Generation:** Pass the outputs from Fairlearn and Scikit-learn directly into a Gemini prompt. Gemini can instantly synthesize complex statistical disparity metrics into a human-readable "Bias Impact Report" for FinTech or HR stakeholders.
  * *Hackathon Tip:* Use Gemini's massive 1M+ token context window to literally ingest entire datasets or rulebooks if you don't have time to build complex RAG pipelines.

## 4. State Management: Complex Simulation Data
* **Global State:** **Zustand**
  * Why: Redux has too much boilerplate for a 48-hour hackathon, and Context API causes too many re-renders. Zustand provides a simple global store that can easily handle deeply nested, constantly updating simulation state data.
* **Server State / Fetching:** **TanStack Query (React Query)**
  * Why: Offload the caching, background updating, and loading/error states of your FastAPI requests entirely to React Query. It pairs perfectly with Zustand (Zustand for client simulation state, React Query for server data).

## 5. Deployment: Speed & Scalability
* **Backend Deployment:** **Google Cloud Run**
  * Why: Simply write a `Dockerfile` for your FastAPI app. Cloud Run gives you a serverless HTTP endpoint that scales automatically (even to zero, saving money) and handles heavy Python compute flawlessly.
* **Frontend Deployment:** **Firebase Hosting (App Hosting)**
  * Why: Firebase now natively supports Next.js. You can deploy it with a single `firebase deploy` command. It handles the CDN, SSL, and server-side rendering automatically. 
* *Integration:* Using Cloud Run and Firebase keeps everything under the GCP umbrella, simplifying IAM permissions and Vertex AI authentication.

---

### Hackathon Execution Strategy (48 Hours)
1. **Hour 1-4:** Scaffold Next.js frontend and FastAPI backend. Setup Docker and prove GCP Cloud Run / Firebase deployment works with a "Hello World" endpoint.
2. **Hour 4-12:** Build the Synthetic Data generator using Vertex AI (Gemini 1.5 Pro). Seed your application with this data.
3. **Hour 12-24:** Set up Fairlearn and Scikit-learn endpoints in Python. Build the simulation logic.
4. **Hour 24-36:** Connect Next.js to FastAPI using React Query. Map the ML output to Tremor charts. Use Zustand to manage the "Simulate" button states and timeline scrubbing.
5. **Hour 36-48:** Feed the simulation results back through Gemini 1.5 Pro to generate the final UX reports. Polish, debug, and finalize pitch material.
