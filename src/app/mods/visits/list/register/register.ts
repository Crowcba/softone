import { localPrescritorService } from '@/services/visits/service_visits_agenda_list';
import { visitsLocation } from '@/api/visits/visits_locations';
import { OrigemDestino, getLocations as fetchLocations } from '@/services/visits/service_visits_locations';
import { getAllVisitasProfissionais } from '@/api/visits/visits_prescribers';
import { VisitasProfissional } from '@/api/visits/visits_prescribers';

export interface RegisterFormData {
  descricao: string;
  idLocal: number;
  prescritores: number[];
}

export async function getLocations() {
  try {
    const locations = await fetchLocations();
    return { success: true, data: locations || [] };
  } catch (error) {
    console.error('Erro ao buscar locais:', error);
    return { success: false, error: 'Erro ao buscar locais' };
  }
}

export async function getPrescribers() {
  try {
    const prescribers = await getAllVisitasProfissionais();
    return { success: true, data: prescribers || [] };
  } catch (error) {
    console.error('Erro ao buscar prescritores:', error);
    return { success: false, error: 'Erro ao buscar prescritores' };
  }
}
