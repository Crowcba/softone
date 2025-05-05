import type { LocalPrescritor as BaseLocalPrescritor } from '@/services/visits/service_visits_agenda_list';
import { visitsLocation } from '@/api/visits/visits_locations';
import { PrescriberList } from '@/api/visits/visits_list_agenda_prescribers';

export interface LocalPrescritor extends BaseLocalPrescritor {
  localInfo: visitsLocation | null;
}

export interface FilterState {
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
}

export interface VisitListProps {
  data: LocalPrescritor[];
  isLoading: boolean;
  error: string | null;
  filters: FilterState;
}

export interface PrescritorDetalhado extends PrescriberList {
  nomeProfissional: string;
  especialidadeProfissional: string;
  conselhoProfissional: string;
  numeroConselhoProfissional: string;
}

export interface VisitDetails {
  id: number;
  idLocal: number;
  idUsuario: string;
  descricao: string;
  localInfo: visitsLocation | null;
  prescritores: Array<{
    idPrescritor: number;
    nomeProfissional: string;
    especialidadeProfissional: string;
    conselhoProfissional: string;
    numeroConselhoProfissional: string;
    idLista: number;
  }>;
} 