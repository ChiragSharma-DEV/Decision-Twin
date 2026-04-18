# Testing

**Date:** 2026-04-19

## Test Frameworks
- Currently, there are no test frameworks initialized for either the frontend or backend in this initial stage.

## Manual Testing & Health
- Local validation relies on manual testing of the `decisiontwin-api/health` endpoint.
- Local dev servers test code incrementally: `npm run dev` and `uvicorn main:app --reload`.

## Planned Testing Strategy (Hackathon Scope)
- Unit Testing is extremely limited given the 48-hour context.
- Validation rests primarily on End-to-End manual sandbox testing combining CSV ingestion, simulation processing, and PDF generation.
