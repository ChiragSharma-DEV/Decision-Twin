# Directory Structure

**Date:** 2026-04-19

## Root Organization
- `decisiontwin-ui/`: Next.js frontend application. Generated using `create-next-app`. Includes `src/` for React components.
- `decisiontwin-api/`: Python FastAPI backend.
- `DOCS/`: PRD, Schema docs, Style guides, Implementation plan.

## Key Locations
- `decisiontwin-ui/src/app`: Contains Next.js pages and routing. Next.js 13+ App router format.
- `decisiontwin-ui/tailwind.config.*` / `postcss.config.js`: Tailwind styling configuration for UI.
- `decisiontwin-api/main.py`: The entry point for FastAPI backend, where all endpoints are declared.
- `decisiontwin-api/requirements.txt`: Python package registry.
- `decisiontwin-api/Dockerfile`: Used to package FastAPI for Google Cloud Run.

## Naming Conventions
- Backend endpoints use `kebab-case` paths (e.g., `/generate-synthetic-data`).
- Python functions use `snake_case`.
- React components use `PascalCase`.
