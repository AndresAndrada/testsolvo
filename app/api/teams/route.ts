import { errorResponse, ok } from "@/services/apiResponse";
import { getTeams } from "@/services/f1ApiClient";

export async function GET() {
  try {
    const teams = await getTeams();
    return ok({ teams });
  } catch (error) {
    return errorResponse(error);
  }
}
