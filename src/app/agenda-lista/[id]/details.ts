import { localPrescritorService } from '@/services/visits/service_visits_agenda_list';
import { getVisitsLocationById, visitsLocation } from '@/api/visits/visits_locations';

export interface VisitDetails {
  id: number;
  descricao: string;
  idLocal: number;
  idUsuario: string;
  localInfo: visitsLocation | null;
}

export const getVisitDetails = async (id: string): Promise<VisitDetails | null> => {
  try {
    const visit = await localPrescritorService.getById(Number(id));
    if (!visit) return null;

    const location = await getVisitsLocationById(Number(visit.idLocal));

    return {
      ...visit,
      localInfo: location
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes da visita:', error);
    return null;
  }
}; 