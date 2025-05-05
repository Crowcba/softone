import { getVisitsLocations, getVisitsLocationById, visitsLocation, updateVisitsLocation, UpdateVisitsLocationPayload, updateVisitsLocationStatus, createVisitsLocation, CreateVisitsLocationPayload } from '../../api/visits/visits_locations';
import axios from 'axios';
import { getAuthConfig } from '../../utils/auth';

interface VisitsService {
  locations: visitsLocation[];
  getLocations: () => Promise<visitsLocation[]>;
  getLocationById: (id: number) => Promise<visitsLocation | undefined>;
  getActiveLocations: () => visitsLocation[];
  updateLocation: (id: number, payload: UpdateVisitsLocationPayload) => Promise<visitsLocation | null>;
  updateLocationStatus: (id: number, status: boolean) => Promise<boolean>;
  createLocation: (payload: CreateVisitsLocationPayload) => Promise<visitsLocation | null>;
}

export async function getVisitsService(): Promise<VisitsService> {
  try {
    const locations = await getVisitsLocations();
    
    return {
      locations,
      
      async getLocations(): Promise<visitsLocation[]> {
        return locations;
      },
      
      async getLocationById(id: number): Promise<visitsLocation | undefined> {
        // Primeiro tenta encontrar nos dados já carregados
        const cachedLocation = locations.find(location => location.idOrigemDestino === id);
        if (cachedLocation) return cachedLocation;
        
        // Se não encontrar, busca diretamente da API
        const location = await getVisitsLocationById(id);
        return location || undefined;
      },
      
      getActiveLocations(): visitsLocation[] {
        return locations.filter(location => location.status === true);
      },

      async updateLocation(id: number, payload: UpdateVisitsLocationPayload): Promise<visitsLocation | null> {
        return await updateVisitsLocation(id, payload);
      },

      async updateLocationStatus(id: number, status: boolean): Promise<boolean> {
        const success = await updateVisitsLocationStatus(id, status);
        
        // Se a atualização for bem-sucedida, atualize o cache local
        if (success) {
          const index = locations.findIndex(loc => loc.idOrigemDestino === id);
          if (index !== -1) {
            locations[index] = {
              ...locations[index],
              status
            };
          }
        }
        
        return success;
      },

      async createLocation(payload: CreateVisitsLocationPayload): Promise<visitsLocation | null> {
        try {
          const newLocation = await createVisitsLocation(payload);
          if (newLocation) {
            locations.push(newLocation);
          }
          return newLocation;
        } catch (error) {
          console.error('Erro ao criar local de visita:', error);
          return null;
        }
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
    getLocationById: async () => undefined,
    getActiveLocations: () => [],
    updateLocation: async () => null,
    updateLocationStatus: async () => false,
    createLocation: async () => null
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.194.62:5000";

export interface OrigemDestino {
  idOrigemDestino: number;
  localDeAtendimentoOrigemDestino: string;
  enderecoOrigemDestino: string;
  bairroOrigemDestino: string;
  cidadeOrigemDestino: string;
  ufOrigemDestino: string;
  cepOrigemDestino: string;
  telefoneOrigemDestino: string;
  numeroOrigemDestino: string | null;
  status: boolean;
}

export interface VinculoEndereco {
  idProfissional: number;
  idOrigemDestinoOrigemDestino: number;
  idUsuario: string;
}

export const getLocations = async (): Promise<OrigemDestino[]> => {
  try {
    console.log('=== BUSCANDO LOCAIS ===');
    const url = `${API_BASE_URL}/api/VisitasOrigemDestino`;
    console.log('URL:', url);

    const response = await axios.get(url, getAuthConfig());
    console.log('Quantidade de locais encontrados:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar locais:', error);
    throw error;
  }
};

export const createLocationLink = async (vinculo: VinculoEndereco): Promise<any> => {
  try {
    console.log('=== CRIANDO VÍNCULO DE ENDEREÇO ===');
    console.log('Dados recebidos:', JSON.stringify(vinculo, null, 2));
    
    const payload = {
      idProfissional: vinculo.idProfissional,
      idOrigemDestinoOrigemDestino: vinculo.idOrigemDestinoOrigemDestino,
      idUsuario: vinculo.idUsuario
    };
    
    const url = `${API_BASE_URL}/api/VisitasVinculoEnderecoProfissional`;
    console.log('URL:', url);
    console.log('Payload final (exato):', JSON.stringify(payload, null, 2));
    console.log('Tipos dos campos:');
    console.log('- idProfissional:', typeof payload.idProfissional);
    console.log('- idOrigemDestinoOrigemDestino:', typeof payload.idOrigemDestinoOrigemDestino);
    console.log('- idUsuario:', typeof payload.idUsuario);

    const config = getAuthConfig();
    console.log('Config:', config);

    const response = await axios.post(url, payload, config);
    console.log('Resposta da API:', response.data);
    return response.data;
  } catch (error) {
    console.error('=== ERRO AO CRIAR VÍNCULO ===');
    console.error('Erro:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados do erro:', error.response.data);
      console.error('Headers da resposta:', error.response.headers);
      console.error('Payload que causou erro:', JSON.stringify(vinculo, null, 2));
    }
    throw error;
  }
};

export const getLocationByPrescriberId = async (idProfissional: number): Promise<OrigemDestino | null> => {
  try {
    console.log('=== BUSCANDO LOCAL DO PRESCRITOR ===');
    console.log('ID do Prescritor:', idProfissional);
    
    const url = `${API_BASE_URL}/api/VisitasVinculoEnderecoProfissional/profissional/${idProfissional}`;
    console.log('URL:', url);

    const config = getAuthConfig();
    const response = await axios.get(url, config);
    
    console.log('Resposta do vínculo:', response.data);

    if (response.data) {
      // Verifica se é um array e pega o primeiro item
      const vinculo = Array.isArray(response.data) ? response.data[0] : response.data;
      
      if (vinculo && vinculo.idOrigemDestinoOrigemDestino) {
        console.log('ID do local encontrado:', vinculo.idOrigemDestinoOrigemDestino);
        
        // Buscar os detalhes do local
        const locationUrl = `${API_BASE_URL}/api/VisitasOrigemDestino/${vinculo.idOrigemDestinoOrigemDestino}`;
        console.log('URL do local:', locationUrl);
        
        const locationResponse = await axios.get(locationUrl, config);
        console.log('Resposta do local:', locationResponse.data);
        
        return locationResponse.data;
      } else {
        console.log('Nenhum ID de local encontrado no vínculo:', vinculo);
      }
    } else {
      console.log('Nenhum dado retornado da API');
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar local do prescritor:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados do erro:', error.response.data);
    }
    return null;
  }
};
