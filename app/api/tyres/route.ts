import { errorResponse, ok } from "@/services/apiResponse";
import { getTyres } from "@/services/f1ApiClient";

export async function GET() {
  try {
    const tyres = await getTyres();
    return ok({ tyres });
  } catch (error) {
    return errorResponse(error);
  }
}
