import { errorResponse, ok } from "@/services/apiResponse";
import { getDrivers } from "@/services/f1ApiClient";

export async function GET() {
  try {
    const drivers = await getDrivers();
    return ok({ drivers });
  } catch (error) {
    return errorResponse(error);
  }
}
