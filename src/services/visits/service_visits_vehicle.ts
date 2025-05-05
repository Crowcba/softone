import {   getVisitsVehicles,   getVisitsVehicleById, 
  getVisitsVehiclesByUser,
  createVisitsVehicle,
  updateVisitsVehicle,
  toggleVisitsVehicleStatus,
  deleteVisitsVehicle,
  VisitsVehicle,
  CreateVisitsVehiclePayload,
  UpdateVisitsVehiclePayload
} from '../../api/visits/visits_vehicle';

interface VisitsVehicleService {
  vehicles: VisitsVehicle[];
  getVehicles: () => Promise<VisitsVehicle[]>;
  getVehicleById: (id: number) => Promise<VisitsVehicle | undefined>;
  getVehiclesByUser: (userId: string) => Promise<VisitsVehicle[]>;
  getActiveVehicles: () => VisitsVehicle[];
  createVehicle: (payload: CreateVisitsVehiclePayload) => Promise<VisitsVehicle | null>;
  updateVehicle: (id: number, payload: UpdateVisitsVehiclePayload) => Promise<VisitsVehicle | null>;
  toggleVehicleStatus: (id: number) => Promise<VisitsVehicle | null>;
  deleteVehicle: (id: number) => Promise<boolean>;
}

export async function getVisitsVehicleService(): Promise<VisitsVehicleService> {
  try {
    const vehicles = await getVisitsVehicles();
    
    return {
      vehicles,
      
      async getVehicles(): Promise<VisitsVehicle[]> {
        return vehicles;
      },
      
      async getVehicleById(id: number): Promise<VisitsVehicle | undefined> {
        // Primeiro tenta encontrar nos dados já carregados
        const cachedVehicle = vehicles.find(vehicle => vehicle.idVeiculo === id);
        if (cachedVehicle) return cachedVehicle;
        
        // Se não encontrar, busca diretamente da API
        const vehicle = await getVisitsVehicleById(id);
        return vehicle || undefined;
      },
      
      async getVehiclesByUser(userId: string): Promise<VisitsVehicle[]> {
        // Verifica se já temos veículos deste usuário no cache
        const cachedUserVehicles = vehicles.filter(vehicle => vehicle.idUsuario === userId);
        
        // Se encontrou veículos no cache, retorna eles
        if (cachedUserVehicles.length > 0) {
          return cachedUserVehicles;
        }
        
        // Se não encontrou no cache, busca da API
        const userVehicles = await getVisitsVehiclesByUser(userId);
        
        // Adiciona os veículos encontrados ao cache, caso ainda não existam
        userVehicles.forEach(vehicle => {
          if (!vehicles.some(v => v.idVeiculo === vehicle.idVeiculo)) {
            vehicles.push(vehicle);
          }
        });
        
        return userVehicles;
      },
      
      getActiveVehicles(): VisitsVehicle[] {
        return vehicles.filter(vehicle => vehicle.ativo === true);
      },
      
      async createVehicle(payload: CreateVisitsVehiclePayload): Promise<VisitsVehicle | null> {
        try {
          const newVehicle = await createVisitsVehicle(payload);
          if (newVehicle) {
            vehicles.push(newVehicle);
          }
          return newVehicle;
        } catch (error) {
          console.error('Erro ao criar veículo:', error);
          return null;
        }
      },
      
      async updateVehicle(id: number, payload: UpdateVisitsVehiclePayload): Promise<VisitsVehicle | null> {
        const updatedVehicle = await updateVisitsVehicle(id, payload);
        
        // Se a atualização for bem-sucedida, atualize o cache local
        if (updatedVehicle) {
          const index = vehicles.findIndex(v => v.idVeiculo === id);
          if (index !== -1) {
            vehicles[index] = updatedVehicle;
          }
        }
        
        return updatedVehicle;
      },
      
      async toggleVehicleStatus(id: number): Promise<VisitsVehicle | null> {
        const updatedVehicle = await toggleVisitsVehicleStatus(id);
        
        // Se a atualização for bem-sucedida, atualize o cache local
        if (updatedVehicle) {
          const index = vehicles.findIndex(v => v.idVeiculo === id);
          if (index !== -1) {
            vehicles[index] = updatedVehicle;
          }
        }
        
        return updatedVehicle;
      },
      
      async deleteVehicle(id: number): Promise<boolean> {
        const success = await deleteVisitsVehicle(id);
        
        // Se a exclusão for bem-sucedida, remova do cache local
        if (success) {
          const index = vehicles.findIndex(v => v.idVeiculo === id);
          if (index !== -1) {
            vehicles.splice(index, 1);
          }
        }
        
        return success;
      }
    };
  } catch (error) {
    console.error('Erro ao obter veículos:', error);
    return createEmptyVisitsVehicleService();
  }
}

function createEmptyVisitsVehicleService(): VisitsVehicleService {
  return {
    vehicles: [],
    getVehicles: async () => [],
    getVehicleById: async () => undefined,
    getVehiclesByUser: async () => [],
    getActiveVehicles: () => [],
    createVehicle: async () => null,
    updateVehicle: async () => null,
    toggleVehicleStatus: async () => null,
    deleteVehicle: async () => false
  };
}


