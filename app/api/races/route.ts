import { errorResponse, ok } from "@/services/apiResponse";
import { getRaces } from "@/services/f1ApiClient";

export async function GET() {
  try {
    const races = await getRaces();
    return ok({ races });
  } catch (error) {
    return errorResponse(error);
  }
}
