import { visitsLocation } from "../../../../api/visits/visits_locations";

export interface LocationsPageProps {
  initialLocations?: visitsLocation[];
}

export interface LocationsFilterState {
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  statusFilter: "all" | "active" | "inactive";
}

export function filterLocations(
  locations: visitsLocation[],
  filters: LocationsFilterState
): visitsLocation[] {
  return locations.filter(location => {
    // Filtro por termo de busca
    const matchesSearch = !filters.searchTerm || 
      (location.localDeAtendimentoOrigemDestino?.toLowerCase() || '')
        .includes(filters.searchTerm.toLowerCase());

    // Filtro por status
    const matchesStatus = filters.statusFilter === "all" 
      ? true 
      : filters.statusFilter === "active" 
        ? location.status === true 
        : location.status === false;

    return matchesSearch && matchesStatus;
  });
}

export function paginateLocations(
  locations: visitsLocation[],
  page: number,
  itemsPerPage: number
): visitsLocation[] {
  const startIndex = (page - 1) * itemsPerPage;
  return locations.slice(startIndex, startIndex + itemsPerPage);
}

export function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  return Math.ceil(totalItems / itemsPerPage);
}
