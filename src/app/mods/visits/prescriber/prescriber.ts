import { VisitasProfissional } from "../../../../services/visits/service_visits_prescribers";

export interface PrescriberPageProps {
  initialPrescribers?: VisitasProfissional[];
}

export interface PrescriberFilterState {
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  statusFilter: "all" | "active" | "inactive";
}

export function filterPrescribers(
  prescribers: VisitasProfissional[],
  filters: PrescriberFilterState
): VisitasProfissional[] {
  return prescribers.filter(prescriber => {
    // Filtro por termo de busca
    const matchesSearch = !filters.searchTerm || 
      (prescriber.nomeProfissional?.toLowerCase() || '')
        .includes(filters.searchTerm.toLowerCase());

    // Filtro por status
    const matchesStatus = filters.statusFilter === "all" 
      ? true 
      : filters.statusFilter === "active" 
        ? prescriber.status === true 
        : prescriber.status === false;

    return matchesSearch && matchesStatus;
  });
}

export function paginatePrescribers(
  prescribers: VisitasProfissional[],
  page: number,
  itemsPerPage: number
): VisitasProfissional[] {
  const startIndex = (page - 1) * itemsPerPage;
  return prescribers.slice(startIndex, startIndex + itemsPerPage);
}

export function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  return Math.ceil(totalItems / itemsPerPage);
}
