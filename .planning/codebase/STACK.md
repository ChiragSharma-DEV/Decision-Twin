# Tech Stack

**Date:** 2026-04-19

## Overview
DecisionTwin is built using a modern decoupled architecture. The frontend is Next.js with React 19, and the backend is Python with FastAPI.

## Frontend Stack
- **Framework:** Next.js (App Router enabled)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, PostCSS
- **UI Components:** Tremor and Lucide React (Legacy peer deps enabled due to React 19 / Tremor compatibility)
- **State Management:** Zustand (planned), TanStack Query (planned)

## Backend Stack
- **Framework:** FastAPI
- **Language:** Python 3.11
- **Server:** Uvicorn
- **Data & ML Ecosystem:** Pandas, Scikit-learn, Fairlearn
- **AI SDK:** `google-cloud-aiplatform` (for Vertex AI Gemini 1.5 Pro integration)

## Infrastructure
- **Containerization:** Docker (`Dockerfile` in `decisiontwin-api/`)
- **Frontend Hosting:** Firebase Hosting (planned)
- **Backend Hosting:** Google Cloud Run (planned)
