# Phase 1 Backend Audit — DecisionTwin API Core

Scope audited: `decisiontwin-api/main.py`, its upload routes, session state, and FastAPI request flow.

This review is intentionally focused on production-readiness for a SaaS backend and is limited to architectural and security flaws, not implementation changes.

---

## [CRITICAL BUGS]

### 1) Global in-memory session state is shared across all users and requests

- The backend keeps a module-level singleton `SESSION` dictionary at `decisiontwin-api/main.py:31-41`.
- That state stores the current dataset, model path, domain metadata, simulation results, and HITL decisions in one global object.
- `get_session()` at `main.py:110-122` simply returns this process-global state.
- `upload_data()` at `main.py:124-203` mutates the same `SESSION` object for every upload, including `SESSION["df"]`, `SESSION["model_path"]`, `SESSION["simulation_results"]`, and `SESSION["hitl_o[...]

Why this breaks in production:
- If two users hit the API concurrently, their requests race against each other on the same Python process state.
- A user can overwrite another user’s dataset or model without any user scoping.
- A multi-instance deployment (Gunicorn/Uvicorn workers, Render/Cloud Run, autoscaling) will not share memory across instances, so the “current upload” is not actually coherent across a real S[...]
- This means the app is effectively a single-user prototype, not a multi-tenant backend.

Production impact:
- Cross-user data leakage.
- Random overwrites of in-flight work.
- Session reset when workers restart or autoscale.

---

### 2) Uploaded `.pkl` files are executed by untrusted deserialization with no sandboxing

The upload flow in `upload_data()` does the following:
- Accepts `model_file: Optional[UploadFile] = File(None)`.
- Validates only by extension `['.pkl', '.onnx']` at `main.py:173-180`.
- Saves the file to a shared directory: `TEMP_DIR = "temp_uploads"` and `dest_path = os.path.join(TEMP_DIR, filename)` at `main.py:48-52` and `main.py:182-185`.
- Later loads it with `joblib.load(SESSION["model_path"])` in `run_crash_test()` at `main.py:355-369` and `sim_critic.load_model(SESSION["model_path"])` in `run_doppelganger()` at `main.py:329-338[...]

This is the most serious security flaw in the backend.

Why it is dangerous:
- `.pkl` files are Python pickle payloads, not safe data blobs.
- Malicious pickle content can trigger arbitrary code execution during unpickling.
- There is no signature verification, ISA check, sandbox, quarantine, model integrity validation, or restricted execution environment.
- A user can upload a malicious pickle and the server will deserialize it in-process.

This is a textbook unsafe unpickling issue and is not acceptable in a production backend.

---

### 3) File uploads are saved to a shared local folder with no collision protection or cleanup

At `main.py:48-52`:
- `TEMP_DIR = "temp_uploads"`
- `os.makedirs(TEMP_DIR, exist_ok=True)`

At `main.py:182-185`:
- `dest_path = os.path.join(TEMP_DIR, filename)`
- `with open(dest_path, "wb") as buffer: shutil.copyfileobj(...)`

Problems:
- Original filename is used directly, so if two users upload `model.pkl` at the same time, the second user overwrites the first user’s file in the same folder.
- If multiple workers or containers are running, each instance may write to its own local disk, but the code still depends on local filesystem semantics and a single shared path within the process[...]
- There is no per-user namespace, UUID-based storage, or storage lifecycle management.
- There is no file size cap or quota enforcement.
- There is no automatic cleanup for stale uploads.

This is not SaaS-safe and will become reliability failure under real concurrent traffic.

---

### 4) CSV ingestion is vulnerable to corrupted or malicious input and not validated

The CSV path in `upload_data()` is:
- `content = await file.read()` at `main.py:168`
- `df = pd.read_csv(io.StringIO(content.decode('utf-8')))` at `main.py:169`

Problems:
- It reads the entire file into memory with no maximum-size limit; a large uploaded CSV can consume RAM and crash the service.
- It assumes UTF-8 encoding without inspecting the actual file. A slightly malformed or binary file raises an exception and is treated as a generic 500.
- It does not validate required columns, required schema, row count, file type, or header integrity.
- It does not reject dangerous payloads masquerading as CSV.
- `pd.read_csv` will happily parse malformed CSV in ways that can create huge dataframes or silent type coercion errors.
- Corrupted CSVs or edge-case files trigger the broad `except Exception as e:` at `main.py:201-202` and return a 500 with stringified error details.

This layer is not hardened against malformed user input or resource exhaustion.

---

### 5) There is no robust request validation model for upload-data; raw dicts are returned and validated weakly

- `upload_data()` accepts form fields (`domain`, `protected_attribute`, `target_outcome`, `use_mock`) but does not use a Pydantic model.
- The endpoint returns raw dictionaries directly with no response schema.
- `SyntheticDataRequest` and `OverrideRequest` at `main.py:204-206` and `main.py:416-419` are typed, but they are not the norm for the API; the main ingestion endpoint is not typed in the same way[...]
- There are no explicit validation constraints such as `Field(gt=0)`, enumeration of allowed domains, or secure allowed-attribute names.
- The code relies on broad try/except blocks and `HTTPException` for failure handling rather than proper schema validation or structured API contracts.

This makes the API impossible to reason about under production client variation and makes it easy to submit malformed payloads or unexpected values.

---

### 6) No centralized exception handling; unhandled Python exceptions are not safely mapped to production-safe API errors

The project has no global exception handlers for:
- HTTP validation errors
- model deserialization failures
- unexpected Python runtime exceptions
- database/file-system failures

Instead, the code pattern is repeated everywhere:
- `except Exception as e: raise HTTPException(status_code=500, detail=f"... {str(e)}")`

This creates two issues:
- Error messages leak internal exception text and sometimes internal library names to the frontend or logs.
- Unhandled exceptions can fall back to FastAPI/Uvicorn defaults without a production-safe policy.

In a production SaaS, you need explicit handlers for:
- `RequestValidationError`
- `HTTPException`
- generic `Exception`
- filesystem errors
- untrusted-artifact errors

Without that, random errors from library internals can surface in ways clients and logs should not see.

---

### 7) `async def` endpoints are not actually offloading CPU-heavy work from the event loop

Key example: `upload_data()` is defined as `async def` at `main.py:124-132`, but inside it the code does:
- `await file.read()`
- `pd.read_csv(...)`
- file writes to disk
- model validation logic

This is still synchronous heavy work being executed inside the request coroutine. It is not a true async pipeline.

Also, many of the main computational endpoints are plain sync functions, not async:
- `generate_synthetic_data()` at `main.py:208-223`
- `run_simulation()` at `main.py:225-315`
- `run_doppelganger()` at `main.py:317-339`
- `run_crash_test()` at `main.py:342-415`
- `override_decision()` at `main.py:421-474`

These endpoints call heavy pandas, scikit-learn, and LLM-related work directly. In FastAPI, sync endpoints are processed in a worker threadpool and can block threads. If the service gets multiple[...]

This creates a scalability bottleneck that is incompatible with production SaaS traffic.

---

## [SECURITY RISKS]

### A. Unsafe pickle upload and deserialization

- `.pkl` upload is accepted and stored in a user-writable folder.
- The backend later calls `joblib.load` on it.
- This is arbitrary code execution when the file is malicious.
- No quarantine, no sandbox, no checksum trust boundary.

### B. Path traversal via uploaded filename

- `filename = model_file.filename` is used directly in `os.path.join(TEMP_DIR, filename)`.
- A user-controlled filename such as `../../some/other/place/file.pkl` can escape the intended upload directory.
- On some systems, absolute paths and traversal sequences can also be abused.

### C. File system abuse and disk exhaustion

- Uploaded CSVs and pickles are saved to local disk without quotas.
- The app has no cleanup or retention policy.
- A multi-user environment can fill disk with large files and crash the service.

### D. Lack of content and type verification

- The backend checks extension only, not content type or actual file validity.
- A malicious file can spoof `.pkl` or `.csv` and still be accepted.
- Untrusted data enters the ML pipeline without validation.

### E. Data leakage via global session state

- Session data is process-global.
- One user can access the other user’s dataset, model, or simulation results if the server is not fully isolated.

---

## [PERFORMANCE BOTTLENECKS]

### 1) CPU-bound pandas/scikit-learn work occurs on request threads

The app is performing heavy synchronous tasks inside request execution:
- `pd.read_csv` on upload
- `pd.concat` and DataFrame transforms in simulation
- `joblib.load` / `model.predict`
- repeated large simulation loops

These operations are expensive and can block the event loop or request threadpool.

### 2) Blocking the API under load with large datasets

`upload_data()` reads the whole CSV into memory, and the simulation endpoints can also create large intermediate DataFrames and repeated loops. In production this causes:
- slow responses for all users
- queueing behind heavy work
- reduced throughput and unstable latency

### 3) Parallel user requests are effectively serialized by shared global state

Even if the process is multi-threaded, the global dict forces the app into unsafe cross-request interference. This is especially harmful for a prototype that looks “simple” but is actually a[...]

---

## [RECOMMENDED FIXES]

### Fix 1: Replace global `SESSION` with a per-user session store or database-backed state

Recommended architecture:
- Associate each user/session with a unique session ID.
- Store dataset/model metadata, simulation results, and overrides in a database, Redis, or secure managed storage keyed by session/user.
- Use `app.state` or dependency injection for per-request access, not module-level globals.

Required behavior:
- One user’s dataset must never overwrite another user’s dataset.
- Session state must be recoverable across restarts or workers.
- Each upload must have a unique record ID and storage path.

### Fix 2: Stop accepting raw `.pkl` from end users in the request pipeline

Best practice for SaaS:
- Do not accept arbitrary `.pkl` uploads for production inference.
- Move model loading to a trusted artifact registry or internal admin-only upload flow.
- If pickles are unavoidable, only accept signed, validated artifacts and deserialize in a separate isolated worker or sandbox with no network access.

If model upload is retained:
- enforce file size limits
- scan content type and magic bytes
- validate against expected model schema
- quarantine uploads outside runtime directories
- verify a cryptographic signature before trust

### Fix 3: Use per-upload UUID paths and cleanup policies

Instead of:
- `os.path.join(TEMP_DIR, filename)`

Use:
- a UUID-based path stored with metadata
- a user-specific directory or object-store bucket
- TTL-based cleanup
- per-upload retention metadata
- strong file size quotas

Also add:
- purge stale files on startup or cron
- reject absolute paths and path traversal
- disallow weird filenames

### Fix 4: Harden CSV ingestion and add strict validation before DataFrame processing

Use a defensive ingestion contract:
- file size cap
- content-type sniffing
- explicit CSV dialect/encoding policy
- schema validation for required columns and types
- row count limits
- reject malformed or empty files before `pd.read_csv`
- sanitize column names
- handle duplicate header names

If the backend must accept upload data:
- validate with a Pydantic model or explicit schema-check function
- block unsupported file types for the ingestion path
- log and return clean validation errors without leaking raw stack traces

### Fix 5: Move heavy work off the request thread

For a production API:
- use async I/O only for network/file I/O
- offload CPU-heavy data science and model work to a background worker queue (Celery, RQ, Dramatiq, Cloud Run jobs, or a dedicated async worker pool)
- use `asyncio.to_thread()` or an executor for blocking pandas/scikit-learn tasks, but keep them isolated and queued
- return a job ID immediately for long-running tasks

This is essential if the backend will run prediction, simulation, or large model operations for multiple users.

### Fix 6: Add robust Pydantic schemas, response models, and centralized exception handling

Adopt:
- request models for upload, simulation, and session metadata
- response models for all public API contracts
- centralized exception handlers for 400, 401, 404, 422, 500
- sanitized error payloads that do not reveal stack traces or raw exception strings to clients

This makes the API predictable, easier to validate, and safer for HTTP clients and frontend teams.

### Fix 7: Separate ingestion, modeling, and session persistence into distinct production layers

Recommended backend architecture:
- API layer: accepts requests, validates auth, stores metadata
- Ingestion layer: validates and transforms uploaded data
- Model artifact layer: stores trusted models in secured object storage
- Worker layer: executes heavy simulation/prediction tasks asynchronously
- Persistence layer: tracks sessions/jobs/results in DB/Redis
- Cleanup service: removes stale temp files and orphaned artifacts

This is the minimum architecture required for a real SaaS product.

---

## Final assessment

This code is a solid prototype but not a production backend.

The most severe issues are:
- unsafe unpickling of user-controlled `.pkl` files
- single global session state shared across users
- local disk uploads without quotas, collision protection, or cleanup
- blocking CPU-heavy work on request threads
- weak validation and no centralized error handling

If this were deployed as-is to production, the most likely outcomes would be:
- cross-user state corruption
- arbitrary code execution via malicious model files
- disk exhaustion from repeated uploads
- request starvation under moderate concurrent traffic
- production errors that are neither safe nor diagnosable for end users

This is Phase 1 backend audit complete: the core API should be considered unsafe for production SaaS use without the architectural changes above.

---

Audit file generated for: `Phase 1 — Backend Core & Data Flow`.

No code was modified outside this audit artifact.

## PHASE 5: API WIRING & MOCK DATA HUNT

This phase is a cross-stack integration audit focused on whether the frontend is actually consuming the live FastAPI backend, or whether the application is still being driven by local defaults, stale mock branches, and optimistic UI state.

### [UNWIRED ENDPOINTS]

1. The frontend and backend are partially wired, but the wiring is selective and incomplete.

- The API service layer in `decisiontwin-ui/src/services/api.ts` does call several backend endpoints directly:
  - `getSession()` -> `GET /session`
  - `uploadData()` -> `POST /upload-data`
  - `runSimulation()` -> `POST /run-simulation?years=...&generate_personas=...&adversarial_count=...`
  - `runDoppelganger()` -> `POST /run-doppelganger`
  - `overrideDecision()` -> `POST /override-decision`
  - `generateDetailedReport()` -> `POST /generate-detailed-report`

- However, this does not mean the entire backend is wired. The architecture is heavily skewed toward a subset of endpoints and ignores the richer server surface in practice.

2. The most obvious wiring gap is the “crash test” route.

- In `decisiontwin-ui/src/services/api.ts:111-119`, the UI does not call a dedicated `POST /run-crash-test`; instead it delegates to `runSimulation({ generatePersonas: true, adversarialCount })`.
- That is a design smell: the frontend is using a simulation endpoint as a surrogate for a dedicated crash-test endpoint rather than respecting the server’s domain-specific route separation.
- If `decisiontwin-api/main.py` contains a distinct crash-test endpoint, the frontend is not invoking it. That creates a risk that the UI is exercising a different code path than the one the API author intended.

3. The app is also not fully using the backend as a source of truth during session bootstrapping.

- In `decisiontwin-ui/src/store/useDecisionTwinStore.ts:63-99`, `initSession()` calls `getSession()`, then, if the session is missing or mismatched, it performs `uploadData()` with `useMock: true` and re-fetches the session.
- This means the app is intentionally bootstrapping itself with mock-backed data in the “normal” initialization path.
- That is not a harmless fallback; it is a production anti-pattern in a SaaS app that claims to use real uploaded data.

4. There is no dedicated API contract enforcement in the frontend beyond raw JSON parsing.

- `decisiontwin-ui/src/services/api.ts:26-35` parses the JSON response and only checks `res.ok` before throwing.
- If the backend responds with a 200 but an unexpected payload shape, the frontend often treats it as success and continues rendering with partial or undefined data.
- That means the API is effectively “loosely coupled,” and the UI can silently continue with wrong state.

5. Any backend endpoint that is not explicitly represented in the service layer is effectively dead from the UI’s perspective.

- For a production app, every server action should have a matching front-end service call and a corresponding state mutation or user trigger.
- The current pattern only covers a subset of server features while relying on hardcoded store logic and fallback behavior for everything else.

### [FAKE DATA SPOTS]

1. There are no direct imports from a `mockData.ts` or `mockData.js` file in the active Vite UI code paths.

- A direct search across `decisiontwin-ui/src` for `mockData|mock_data|MockData` returned no results.
- This means the fake data is not centralized in one obvious file. It is distributed across state initialization and fallback logic instead.

2. The clearest “fake data” branch is in the Zustand store initialization path.

- File: `decisiontwin-ui/src/store/useDecisionTwinStore.ts`
- Lines: `63-99`
- Evidence:
  - `await uploadData({ domain: backendDomain, useMock: true, targetOutcome: defaults.target, protectedAttribute: defaults.protected });`
  - This is not a live-data upload flow; it deliberately seeds the session with mock data during initialization if no real session exists.

3. The session bootstrap path still depends on a mock-first policy rather than strict user state.

- File: `decisiontwin-ui/src/store/useDecisionTwinStore.ts`
- Lines: `74-88`
- The app explicitly chooses a default target/protected attribute map and then calls the backend with `useMock: true`.
- That is a live example of “mock data is still actively used in the normal app path.”

4. The app also preserves stale UI state when the backend gives empty or partial data.

- File: `decisiontwin-ui/src/store/useDecisionTwinStore.ts`
- Lines: `171-177`
- Evidence:
  - `const personas = simulation.adversarial_personas?.length > 0 ? mapAdversarialPersonasToUI(simulation.adversarial_personas) : get().personas;`
  - If the backend returns zero personas or partial data, the store falls back to the existing local `personas` array rather than showing a clean empty state.
  - This silently preserves old/mock values instead of surfacing the actual backend result.

5. The API parsing layer swallows malformed non-JSON payloads and turns them into empty objects.

- File: `decisiontwin-ui/src/services/api.ts`
- Lines: `26-35`
- Evidence:
  - `const data = await res.json().catch(() => ({}));`
  - This is a classic silent failure path. A malformed or empty response becomes a harmless object instead of a visible contract violation.

6. The "UI is still dressed as a demo" pattern is visible in hardcoded text and default-state assumptions.

- File: `decisiontwin-ui/src/App.tsx`
- Lines: `19-24`, `41-47`, `82-87`, `189-195`
- Example:
  - `const [isLoggedIn, setIsLoggedIn] = useState(false);` is a local, browser-side gate, not a real authenticated session contract.
  - `const [selectedDomain, setSelectedDomain] = useState("all")` and domain labels mapping are static client values.
- These are not “fake data” in the literal CSV sense, but they are explicit demo assumptions baked into the production UI path.

### [BROKEN DATA FLOWS]

1. The store is not consistently using backend responses as the source of truth.

- File: `decisiontwin-ui/src/store/useDecisionTwinStore.ts`
- Lines: `171-184` and `187-205`
- The store sets `simulation` and `personas` from the response, but immediately falls back to cached local values when response fields are empty or missing.
- That means partial backend failures can masquerade as legitimate UI state.
- This is a silent data-flow break: the user sees the app “working,” but the underlying data may be stale, defaulted, or anti-correlated with the backend.

2. The initialization flow can still create a fake session even when the app is supposed to be live.

- File: `decisiontwin-ui/src/store/useDecisionTwinStore.ts`
- Lines: `63-99`
- Before any real user data is available, the app deliberately runs:
  - default target selection
  - default protected attribute selection
  - a `useMock: true` upload
- This is a hardcoded path that bypasses a “strict live data only” requirement.

3. If the backend returns a valid 200 but the JSON is structurally different from the expected contract, the UI often does not fail loudly.

- File: `decisiontwin-ui/src/services/api.ts`
- Lines: `26-35`
- The code converts a failed JSON parse into `{}` and only throws if the HTTP status is not OK.
- That means an API contract mismatch can appear as an empty UI state rather than an actionable error.

4. `App.tsx` is effectively orchestrating a UI simulation state machine without proving that every child component is receiving real live data.

- File: `decisiontwin-ui/src/App.tsx`
- Lines: `73-87`, `89-143`
- The app calls `checkActiveSession()`, then `initSession(selectedDomain)` on session changes, and then updates notifications based on `simulation` data.
- This is a fragile dependency chain: a change in one stage can create a stale or misleading simulation state, while the UI continues rendering pre-populated components with no robust contract validation.

5. The UI components are repeatedly reading from Zustand state, but they are not all state-consistent.

- Files:
  - `decisiontwin-ui/src/components/DashboardView.tsx`
  - `decisiontwin-ui/src/components/CrashTestDummies.tsx`
  - `decisiontwin-ui/src/components/DoppelgangerLab.tsx`
- These components are reading aggregated state from the store and then creating their own derived local state, but they do not always verify that the incoming store values were actually refreshed from the latest API call.
- This is especially visible when `personas` is preserved from a prior session while a new route is triggered.

### [RECOMMENDED FIXES]

1. Enforce a strict API contract and fail fast on malformed responses.

- Replace `catch(() => ({}))` with explicit validation logic and typed response checks.
- If the JSON payload is missing required fields, reject it clearly and display a real error state instead of silently proceeding.

2. Remove mock-first bootstrapping from the production path.

- `useDecisionTwinStore.initSession()` should not call `uploadData({ useMock: true })` as part of the default initialization flow.
- Only use mock data in explicit demo/test environments, behind a feature flag with a clear indicator.

3. Ensure live backend data is the sole source of truth for store updates.

- Any empty response should clear previous data, not preserve stale state.
- For example, when `simulation.adversarial_personas` is empty, the store should explicitly set empty arrays instead of reusing stale `personas`.

4. Add direct API coverage for each server route and keep the service layer honest.

- Every endpoint in `decisiontwin-api/main.py` should have a direct matching function in `src/services/api.ts`.
- If a route is intentionally not used by the UI, it should be documented as such, not silently orphaned.

5. Use explicit backend validation for session creation and dataset upload.

- Validate response payload shape after `GET /session` and `POST /upload-data` before updating the store.
- Fail with a visible state boundary rather than merging partial objects into the app state.

6. Add end-to-end visibility and telemetry for failed API transitions.

- Log request/response mismatches and track empty payloads, stale state reuse, and mock fallback usage.
- This will expose the exact fraction of app behavior that is still being powered by local defaults instead of the backend.

7. Separate demo mode from production mode in the UI.

- A real SaaS frontend should clearly distinguish between “test/demo data” and “live production session data.”
- The current behavior blurs the line too much, which is why the app appears functional while still depending on mock bootstrap logic.

Final assessment for Phase 5:
The frontend is not fully live-wired to the backend. It does call a subset of the API, but it also seeds and preserves state with mock-style defaults, silently swallows malformed payloads, and often falls back to stale local state instead of surfacing real backend errors. That is the signature of a demo-grade integration, not a production-ready SaaS data flow.

This phase is the clearest evidence that the app still has a “mock-first” startup path and a selectively wired backend. The practical outcome is that the UI can appear healthy while internally running on stale state or default assumptions rather than the live API contract.

No source code was modified as part of this audit. This was an analysis-only append to the existing Phase 1 audit artifact.

---

END OF FILE

