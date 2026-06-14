import type {
  DoppelgangerExplainResponse,
  DoppelgangerPayload,
  SessionState,
  SimulationResponse,
  UploadDataResponse,
} from "./types";

const FASTAPI_BASE_URL =
  import.meta.env.VITE_FASTAPI_URL?.replace(/\/$/, "") || "http://localhost:8000";

const EXPRESS_BASE_URL =
  import.meta.env.VITE_EXPRESS_API_URL?.replace(/\/$/, "") || "";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail =
      typeof data === "object" && data !== null && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : res.statusText || "Request failed";
    throw new ApiError(detail, res.status);
  }
  return data as T;
}

export function uiDomainToBackend(domain: string): string {
  const map: Record<string, string> = {
    credit: "lending",
    education: "scholarship",
    employment: "hiring",
    hr: "lending",
    all: "lending",
  };
  return map[domain] ?? "lending";
}

export async function getSession(): Promise<SessionState> {
  const res = await fetch(`${FASTAPI_BASE_URL}/session`);
  return parseJson<SessionState>(res);
}

export interface UploadDataOptions {
  domain: string;
  protectedAttribute?: string;
  targetOutcome?: string;
  useMock?: boolean;
  file?: File;
  modelFile?: File;
}

export async function uploadData(
  options: UploadDataOptions
): Promise<UploadDataResponse> {
  const formData = new FormData();
  formData.append("domain", options.domain);
  formData.append(
    "protected_attribute",
    options.protectedAttribute ?? "gender"
  );
  formData.append("target_outcome", options.targetOutcome ?? "approved");
  formData.append("use_mock", String(options.useMock ?? true));

  if (options.file) {
    formData.append("file", options.file);
  }
  if (options.modelFile) {
    formData.append("model_file", options.modelFile);
  }

  const res = await fetch(`${FASTAPI_BASE_URL}/upload-data`, {
    method: "POST",
    body: formData,
  });
  return parseJson<UploadDataResponse>(res);
}

export interface RunSimulationOptions {
  years?: number;
  generatePersonas?: boolean;
  adversarialCount?: number;
}

export async function runSimulation(
  options: RunSimulationOptions = {}
): Promise<SimulationResponse> {
  const params = new URLSearchParams({
    years: String(options.years ?? 10),
    generate_personas: String(options.generatePersonas ?? false),
    adversarial_count: String(options.adversarialCount ?? 15),
  });

  const res = await fetch(
    `${FASTAPI_BASE_URL}/run-simulation?${params.toString()}`,
    { method: "POST" }
  );
  return parseJson<SimulationResponse>(res);
}

export async function runCrashTest(
  adversarialCount = 15
): Promise<SimulationResponse> {
  return runSimulation({
    years: 10,
    generatePersonas: true,
    adversarialCount,
  });
}

export async function explainDoppelganger(
  payload: DoppelgangerPayload
): Promise<DoppelgangerExplainResponse> {
  const base = EXPRESS_BASE_URL || "";
  const res = await fetch(`${base}/api/doppelganger-explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson<DoppelgangerExplainResponse>(res);
}

export { FASTAPI_BASE_URL, EXPRESS_BASE_URL };
