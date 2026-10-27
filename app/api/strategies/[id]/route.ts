import type { NextRequest } from "next/server";
import { errorResponse, fail, ok } from "@/services/apiResponse";
import Strategy from "@/models/strategy";

type RouteContext = { params: Promise<{ id: string }> };

function parseId(id: string): number | null {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < 1) {
    return null;
  }
  return numericId;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const numericId = parseId(id);
  if (numericId === null) {
    return fail("INVALID_STRATEGY_ID", "Strategy id must be a positive integer", 400);
  }
  try {
    const strategy = await Strategy.findByPk(numericId);
    if (!strategy) {
      return fail("STRATEGY_NOT_FOUND", `Strategy ${numericId} not found`, 404);
    }
    return ok({ strategy });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const numericId = parseId(id);
  if (numericId === null) {
    return fail("INVALID_STRATEGY_ID", "Strategy id must be a positive integer", 400);
  }
  try {
    const strategy = await Strategy.findByPk(numericId);
    if (!strategy) {
      return fail("STRATEGY_NOT_FOUND", `Strategy ${numericId} not found`, 404);
    }
    await strategy.destroy();
    return ok({ deleted: true, id: numericId });
  } catch (error) {
    return errorResponse(error);
  }
}
