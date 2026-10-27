import { NextResponse } from "next/server";
import { Client } from "pg";
import { getExternalApiStatus } from "@/services/f1ApiClient";

async function checkDatabase(): Promise<{
  status: "up" | "down";
  latencyMs: number;
  error?: string;
}> {
  const started = Date.now();
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionTimeoutMillis: 5000,
  });
  try {
    await client.connect();
    await client.query("SELECT 1");
    return { status: "up", latencyMs: Date.now() - started };
  } catch (error) {
    return {
      status: "down",
      latencyMs: Date.now() - started,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  } finally {
    await client.end().catch(() => undefined);
  }
}

export async function GET() {
  const [database, externalApi] = await Promise.all([
    checkDatabase(),
    getExternalApiStatus(),
  ]);
  const healthy = database.status === "up";
  return NextResponse.json(
    {
      data: {
        status: healthy ? "ok" : "degraded",
        database,
        externalApi,
        timestamp: new Date().toISOString(),
      },
    },
    { status: healthy ? 200 : 503 },
  );
}
