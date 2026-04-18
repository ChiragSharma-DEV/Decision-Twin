# Areas of Concern

**Date:** 2026-04-19

## Technical Debt & Issues
1. **React 19 vs Tremor Compatibility:** Next.js initialized with React 19, but `@tremor/react` peer dependencies expect React 18. Packages are installed via `--legacy-peer-deps`. This could trigger hydration or rendering runtime bugs.
2. **CORS Vulnerability:** The FastAPI backend `.add_middleware` currently allows `allow_origins=["*"]`. Must lock this down before production deploy.
3. **Vertex AI Scalability:** Synchronous calls to Gemini 1.5 Pro might result in API timeouts if generating a huge JSON batch constraint. Ensure streaming responses or background tasks if payload size blows up.
4. **Hackathon Hacks:** State is managed purely in temporary variables currently. `Zustand` must be careful not to trigger memory leaks when retaining the state vector across 10-year timelines.

## Next Steps to Address
- Monitor Tremor components runtime behavior closely.
- Set up proper GCP service account JSON locally via `APPLICATION_DEFAULT_CREDENTIALS`.
