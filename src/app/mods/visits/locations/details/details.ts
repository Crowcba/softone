import { useRouter } from 'next/navigation';
import { visitsLocation } from '@/api/visits/visits_locations';
import { getVisitsService } from '@/services/visits/service_visits_locations';

export function useLocationDetails() {
  const router = useRouter();

  const handleEdit = (location: visitsLocation) => {
    // Correção do caminho para a página de edição
    router.push(`/mods/visits/locations/edit?id=${location.idOrigemDestino}`);
  };

  const handleBack = () => {
    return;
  };

  const fetchLocationDetails = async (locationId: number) => {
    try {
      const service = await getVisitsService();
      const detailedLocation = await service.getLocationById(locationId);
      return detailedLocation;
    } catch (error) {
      console.error("Erro ao carregar detalhes do local:", error);
      return null;
    }
  };

  return {
    handleEdit,
    handleBack,
    fetchLocationDetails
  };
}
