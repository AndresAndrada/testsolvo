import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { F1ApiError } from "./f1ApiClient";

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}

export function fail(
  code: string,
  message: string,
  status = 500,
  details?: unknown,
): NextResponse {
  const error: { code: string; message: string; details?: unknown } = {
    code,
    message,
  };
  if (details !== undefined) {
    error.details = details;
  }
  return NextResponse.json({ error }, { status });
}

export function validationResponse(error: ZodError): NextResponse {
  const details = error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
  return fail("VALIDATION_ERROR", "Invalid strategy payload", 400, details);
}

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof F1ApiError) {
    return fail(error.code, error.message, error.status);
  }
  console.error("[api] Unhandled error:", error);
  return fail("INTERNAL_ERROR", "An unexpected server error occurred", 500);
}
