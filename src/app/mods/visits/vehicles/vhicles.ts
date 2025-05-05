import { VisitsVehicle } from "../../../../api/visits/visits_vehicle";

export interface VehiclePageProps {
  initialVehicles?: VisitsVehicle[];
}

export interface VehicleFilterState {
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  statusFilter: "all" | "active" | "inactive";
}

export function filterVehicles(
  vehicles: VisitsVehicle[],
  filters: VehicleFilterState
): VisitsVehicle[] {
  return vehicles.filter(vehicle => {
    // Filtro por termo de busca (placa, marca/modelo ou proprietário)
    const matchesSearch = !filters.searchTerm || 
      ((vehicle.placaVeiculo?.toLowerCase() || '').includes(filters.searchTerm.toLowerCase()) ||
       (vehicle.marcaModeloVeiculo?.toLowerCase() || '').includes(filters.searchTerm.toLowerCase()) ||
       (vehicle.proprietarioVeiculo?.toLowerCase() || '').includes(filters.searchTerm.toLowerCase()));

    // Filtro por status
    const matchesStatus = filters.statusFilter === "all" 
      ? true 
      : filters.statusFilter === "active" 
        ? vehicle.ativo === true 
        : vehicle.ativo === false;

    return matchesSearch && matchesStatus;
  });
}

export function paginateVehicles(
  vehicles: VisitsVehicle[],
  page: number,
  itemsPerPage: number
): VisitsVehicle[] {
  const startIndex = (page - 1) * itemsPerPage;
  return vehicles.slice(startIndex, startIndex + itemsPerPage);
}

export function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  return Math.ceil(totalItems / itemsPerPage);
}
