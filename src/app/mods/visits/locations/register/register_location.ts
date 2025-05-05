import { CreateVisitsLocationPayload } from "../../../../../api/visits/visits_locations";
import { getVisitsService } from "../../../../../services/visits/service_visits_locations";

export async function createNewVisitsLocation(data: CreateVisitsLocationPayload) {
  try {
    const service = await getVisitsService();
    const result = await service.createLocation(data);
    return result;
  } catch (error) {
    console.error("Erro ao criar local:", error);
    throw error;
  }
}
