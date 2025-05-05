import { localPrescritorService } from '@/services/visits/service_visits_agenda_list';
import { getVisitsLocationById } from '@/api/visits/visits_locations';
import { getPrescribersByListId } from '@/api/visits/visits_list_agenda_prescribers';
// import { getVisitasListumById } from '@/api/visits/visits_list_agenda';
import VisitasProfissionaisService from '@/services/visits/service_visits_prescribers';
import type { FilterState, VisitListProps, VisitDetails } from './types';

export const getVisitsList = async (filters: FilterState): Promise<VisitListProps> => {
  try {
    const data = await localPrescritorService.getAll();
    const filteredData = filterItems(data, filters);
    const paginatedData = paginateItems(filteredData, filters.currentPage, filters.itemsPerPage);
    
    const visitsWithLocations = await Promise.all(
      paginatedData.map(async (visit) => {
        const location = await getVisitsLocationById(visit.idLocal);
        return {
          ...visit,
          localInfo: location
        };
      })
    );
    
    return {
      data: visitsWithLocations,
      isLoading: false,
      error: null,
      filters
    };
  } catch (error) {
    return {
      data: [],
      isLoading: false,
      error: 'Erro ao carregar lista de visitas',
      filters
    };
  }
};

export async function getVisitDetails(id: number): Promise<VisitDetails | null> {
  try {
    console.log('Buscando detalhes da visita:', id);
    
    // Buscar local e prescritores em paralelo
    const [localInfo, prescritores] = await Promise.all([
      getVisitsLocationById(id),
      getPrescribersByListId(id)
    ]);

    console.log('Local info:', localInfo);
    console.log('Prescritores:', prescritores);

    // Buscar detalhes dos prescritores
    const prescritoresDetalhados = await Promise.all(
      prescritores.map(async (prescritor) => {
        const detalhes = await VisitasProfissionaisService.getVisitasProfissionalById(prescritor.idPrescritor);
        console.log('Detalhes do prescritor:', detalhes);
        return {
          ...prescritor,
          nomeProfissional: detalhes?.nomeProfissional || 'Nome não encontrado',
          especialidadeProfissional: detalhes?.especialidadeProfissional || 'Especialidade não encontrada',
          conselhoProfissional: detalhes?.conselhoProfissional || 'Conselho não encontrado',
          numeroConselhoProfissional: detalhes?.numeroConselhoProfissional || 'Número não encontrado'
        };
      })
    );

    const result = {
      id,
      idLocal: id,
      idUsuario: '', // TODO: Adicionar idUsuario quando disponível
      descricao: localInfo?.localDeAtendimentoOrigemDestino || 'Descrição não encontrada',
      localInfo,
      prescritores: prescritoresDetalhados
    };

    console.log('Resultado final:', result);
    return result;
  } catch (error) {
    console.error('Erro ao buscar detalhes da visita:', error);
    return null;
  }
}

function filterItems(
  items: any[],
  filters: FilterState
): any[] {
  return items.filter(item => {
    return !filters.searchTerm || 
      (item.descricao?.toLowerCase() || '')
        .includes(filters.searchTerm.toLowerCase());
  });
}

function paginateItems(
  items: any[],
  page: number,
  itemsPerPage: number
): any[] {
  const startIndex = (page - 1) * itemsPerPage;
  return items.slice(startIndex, startIndex + itemsPerPage);
} 