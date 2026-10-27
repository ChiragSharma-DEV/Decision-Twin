# Phase 1 Backend Audit — DecisionTwin API Core

Scope audited: `decisiontwin-api/main.py`, its upload routes, session state, and FastAPI request flow.

This review is intentionally focused on production-readiness for a SaaS backend and is limited to architectural and security flaws, not implementation changes.

---

## [CRITICAL BUGS]

### 1) Global in-memory session state is shared across all users and requests

- The backend keeps a module-level singleton `SESSION` dictionary at `decisiontwin-api/main.py:31-41`.
- That state stores the current dataset, model path, domain metadata, simulation results, and HITL decisions in one global object.
- `get_session()` at `main.py:110-122` simply returns this process-global state.
- `upload_data()` at `main.py:124-203` mutates the same `SESSION` object for every upload, including `SESSION["df"]`, `SESSION["model_path"]`, `SESSION["simulation_results"]`, and `SESSION["hitl_overrides"]`.

Why this breaks in production:
- If two users hit the API concurrently, their requests race against each other on the same Python process state.
- A user can overwrite another user’s dataset or model without any user scoping.
- A multi-instance deployment (Gunicorn/Uvicorn workers, Render/Cloud Run, autoscaling) will not share memory across instances, so the “current upload” is not actually coherent across a real SaaS cluster.
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
- Later loads it with `joblib.load(SESSION["model_path"])` in `run_crash_test()` at `main.py:355-369` and `sim_critic.load_model(SESSION["model_path"])` in `run_doppelganger()` at `main.py:329-338`.

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
- If multiple workers or containers are running, each instance may write to its own local disk, but the code still depends on local filesystem semantics and a single shared path within the process.
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
- `SyntheticDataRequest` and `OverrideRequest` at `main.py:204-206` and `main.py:416-419` are typed, but they are not the norm for the API; the main ingestion endpoint is not typed in the same way.
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

These endpoints call heavy pandas, scikit-learn, and LLM-related work directly. In FastAPI, sync endpoints are processed in a worker threadpool and can block threads. If the service gets multiple large requests, the threadpool can be exhausted and all other users queue behind CPU-bound jobs.

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

Even if the process is multi-threaded, the global dict forces the app into unsafe cross-request interference. This is especially harmful for a prototype that looks “simple” but is actually acting as a single shared session cache.

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
