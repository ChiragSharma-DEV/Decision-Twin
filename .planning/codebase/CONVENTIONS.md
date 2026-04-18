# Code Conventions

**Date:** 2026-04-19

## Python / FastAPI
- **Type Hinting:** Required. Use Pydantic `BaseModel` for validation of request payloads. Example: `class SyntheticDataRequest(BaseModel):`
- **Application Setup:** Use `CORSMiddleware` with configurable origins.
- **Entry point check:** `if __name__ == "__main__": uvicorn.run(...)` standard.

## TypeScript / Next.js
- **TypeScript Strict Mode:** Enabled via `tsconfig.json`. Types for components are expected.
- **Styling:** Use Tailwind CSS utility classes and Shadcn defaults. Follow `decision_twin_style_guide.md` guidelines for color tokens (Zinc 900/950 for dark mode).
- **Imports:** Aliased imports configured to `@/*`.

## General
- Build for performance. Use debouncing on the Time-Travel slider and React Query for asynchronous API states.
