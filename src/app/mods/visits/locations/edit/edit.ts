import { UpdateVisitsLocationPayload } from '@/api/visits/visits_locations';
import { getVisitsService } from '@/services/visits/service_visits_locations';

export async function updateVisitsLocation(id: number, data: UpdateVisitsLocationPayload) {
  try {
    const service = await getVisitsService();
    return await service.updateLocation(id, data);
  } catch (error) {
    console.error('Erro ao atualizar local:', error);
    throw error;
  }
}

export async function updateVisitsLocationStatus(id: number, status: boolean) {
  try {
    const service = await getVisitsService();
    return await service.updateLocationStatus(id, status);
  } catch (error) {
    console.error('Erro ao atualizar status do local:', error);
    throw error;
  }
}
