import type { NextRequest } from "next/server";
import {
  errorResponse,
  fail,
  ok,
  validationResponse,
} from "@/services/apiResponse";
import { createStrategySchema } from "@/services/strategySchema";
import Strategy from "@/models/strategy";

export async function GET(request: NextRequest) {
  try {
    const raceId = request.nextUrl.searchParams.get("raceId");
    const strategies = await Strategy.findAll({
      where: raceId ? { raceId } : undefined,
      order: [["id", "DESC"]],
    });
    return ok({ strategies });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("INVALID_JSON", "Request body must be valid JSON", 400);
  }

  const parsed = createStrategySchema.safeParse(body);
  if (!parsed.success) {
    return validationResponse(parsed.error);
  }

  try {
    const strategy = await Strategy.create(parsed.data);
    return ok({ strategy }, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
