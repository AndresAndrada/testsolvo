import type { NextRequest } from "next/server";
import { errorResponse, fail, ok } from "@/services/apiResponse";
import { getRaceById } from "@/services/f1ApiClient";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return fail("INVALID_RACE_ID", "Race id is required", 400);
  }
  try {
    const race = await getRaceById(id);
    return ok({ race });
  } catch (error) {
    return errorResponse(error);
  }
}
