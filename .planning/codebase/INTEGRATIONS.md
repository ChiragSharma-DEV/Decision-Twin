# Integrations

**Date:** 2026-04-19

## External APIs & Services
1. **Google Vertex AI (Gemini 1.5 Pro):**
   - **Purpose:** Used for synthetic persona generation and generating forensic AI audit reports.
   - **Status:** Required backend dependency via `google-cloud-aiplatform`.
   - **Configuration:** Will require `gcloud auth application-default login` for local testing.

2. **Firebase:**
   - **Purpose:** Next.js frontend hosting.
   - **Status:** Planned. Needs `firebase init hosting`.

## Data Sources
- **Dataset Uploads:** Support for CSV, Parquet, JSON, and SQL formats as specified in the PRD.
- **Data Output:** JSON arrays for synthetic APIs.

## Authentication
- Currently, the API is running locally via generic CORS. Open to `*` for development; to be restricted in production.
