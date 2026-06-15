"""
Render-compatible entrypoint.
Reads PORT from the environment so the process always binds to the
port Render expects, regardless of how env vars are injected.
"""
import os
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    print(f"Starting DecisionTwin API on port {port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port)
