import axios, { AxiosError } from "axios";

export interface Circuit {
  id: string;
  name: string;
  country: string;
  type: string;
  laps: number;
  lengthKm: number;
  baseLapTime: number;
  pitStopLoss: number;
  tyreWear: number;
  overtakingDifficulty: number;
}

export interface Race {
  id: string;
  name: string;
  round: number;
  date: string;
  circuitId: string;
  laps: number;
  temperature: number;
  rainProbability: number;
  circuit?: Circuit;
}

export interface TyreCompound {
  compound: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET";
  pace: number;
  degradation: number;
  wetPerformance: number;
  optimalRainIntensity: { min: number; max: number };
}

export class F1ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "F1ApiError";
  }
}

interface ExternalEnvelope<T> {
  statusCode: number;
  code: string;
  message: string;
  data: T;
}

const client = axios.create({
  baseURL: process.env.F1_API_BASE_URL ?? "https://tech-challenge101.onrender.com",
  timeout: Number(process.env.F1_API_TIMEOUT_MS) || 60000,
  headers: { Accept: "application/json" },
});

function toF1ApiError(error: unknown): F1ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.code === "ECONNABORTED") {
      return new F1ApiError(
        "F1_API_TIMEOUT",
        "External F1 API timed out (Render cold start may be in progress)",
        504,
      );
    }
    if (axiosError.response) {
      const status = axiosError.response.status;
      if (status === 404) {
        return new F1ApiError("F1_API_NOT_FOUND", "Resource not found in external F1 API", 404);
      }
      return new F1ApiError(
        "F1_API_UPSTREAM_ERROR",
        `External F1 API responded with status ${status}`,
        502,
      );
    }
    return new F1ApiError(
      "F1_API_UNAVAILABLE",
      "External F1 API is unreachable (Render cold start may be in progress)",
      502,
    );
  }
  return new F1ApiError(
    "F1_API_ERROR",
    error instanceof Error ? error.message : "Unknown external F1 API error",
    502,
  );
}

async function request<T>(path: string): Promise<T> {
  try {
    const response = await client.get<ExternalEnvelope<T>>(path);
    if (!response.data || response.data.data === undefined) {
      throw new F1ApiError(
        "F1_API_INVALID_RESPONSE",
        "External F1 API returned an unexpected payload",
        502,
      );
    }
    return response.data.data;
  } catch (error) {
    if (error instanceof F1ApiError) throw error;
    throw toF1ApiError(error);
  }
}

interface CacheEntry {
  expiresAt: number;
  data: unknown;
}

const cache = new Map<string, CacheEntry>();

async function cached<T>(key: string, ttlMs: number, loader: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) {
    return hit.data as T;
  }
  const data = await loader();
  cache.set(key, { expiresAt: Date.now() + ttlMs, data });
  return data;
}

const MINUTE_MS = 60_000;

export async function getRaces(): Promise<Race[]> {
  return cached("races", 10 * MINUTE_MS, async () => {
    const data = await request<{ races: Race[] }>("/api/races");
    return data.races;
  });
}

export async function getRaceById(id: string): Promise<Race> {
  return cached(`race:${id}`, 10 * MINUTE_MS, () =>
    request<Race>(`/api/races/${encodeURIComponent(id)}`),
  );
}

export async function getTyres(): Promise<TyreCompound[]> {
  return cached("tyres", 60 * MINUTE_MS, async () => {
    const data = await request<{ tyres: TyreCompound[] }>("/api/tyres");
    return data.tyres;
  });
}

export async function getExternalApiStatus(): Promise<{
  status: "up" | "down";
  latencyMs: number;
  error?: string;
}> {
  const started = Date.now();
  try {
    await client.get("/api/races", { timeout: 10000 });
    return { status: "up", latencyMs: Date.now() - started };
  } catch (error) {
    return {
      status: "down",
      latencyMs: Date.now() - started,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
