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
    const limitParam = request.nextUrl.searchParams.get("limit");
    const offsetParam = request.nextUrl.searchParams.get("offset");
    
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 50) : 10;
    const offset = offsetParam ? Math.max(parseInt(offsetParam, 10), 0) : 0;

    const { count, rows: strategies } = await Strategy.findAndCountAll({
      where: raceId ? { raceId } : undefined,
      order: [["id", "DESC"]],
      limit,
      offset,
    });

    const hasMore = offset + strategies.length < count;
    const nextOffset = hasMore ? offset + strategies.length : offset + strategies.length;

    return ok({ 
      strategies,
      pagination: {
        limit,
        offset,
        totalItems: count,
        hasMore,
        nextOffset,
      }
    });
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
