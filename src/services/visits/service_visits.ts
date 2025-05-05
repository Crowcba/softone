import { getVisitsLocations, visitsLocation } from '../../api/visits/visits';

interface VisitsService {
  locations: visitsLocation[];
  getLocations: () => Promise<visitsLocation[]>;
  getLocationById: (id: number) => visitsLocation | undefined;
  getActiveLocations: () => visitsLocation[];
}

export async function getVisitsService(): Promise<VisitsService> {
  try {
    const locations = await getVisitsLocations();
    
    return {
      locations,
      
      async getLocations(): Promise<visitsLocation[]> {
        return locations;
      },
      
      getLocationById(id: number): visitsLocation | undefined {
        return locations.find(location => location.idOrigemDestino === id);
      },
      
      getActiveLocations(): visitsLocation[] {
        return locations.filter(location => location.status === true);
      }
    };
  } catch (error) {
    console.error('Erro ao obter locais de visita:', error);
    return createEmptyVisitsService();
  }
}

function createEmptyVisitsService(): VisitsService {
  return {
    locations: [],
    getLocations: async () => [],
    getLocationById: () => undefined,
    getActiveLocations: () => [],
  };
}
