import { 
  getPrescriberLists, 
  getPrescriberListById, 
  PrescriberList, 
  updatePrescriberList, 
  UpdatePrescriberListPayload, 
  deletePrescriberList, 
  createPrescriberList, 
  CreatePrescriberListPayload,
  getPrescribersByListId,
  getPrescribersByPrescriberId
} from '../../api/visits/visits_list_agenda_prescribers';

interface PrescriberListService {
  prescriberLists: PrescriberList[];
  getLists: () => Promise<PrescriberList[]>;
  getListById: (id: number) => Promise<PrescriberList | undefined>;
  createList: (payload: CreatePrescriberListPayload) => Promise<PrescriberList | null>;
  updateList: (id: number, payload: UpdatePrescriberListPayload) => Promise<boolean>;
  deleteList: (id: number) => Promise<boolean>;
  getPrescribersByList: (idLista: number) => Promise<PrescriberList[]>;
  getPrescribersByPrescriber: (idPrescritor: number) => Promise<PrescriberList[]>;
}

export async function getPrescriberListService(): Promise<PrescriberListService> {
  try {
    const prescriberLists = await getPrescriberLists();
    
    return {
      prescriberLists,
      
      async getLists(): Promise<PrescriberList[]> {
        return prescriberLists;
      },
      
      async getListById(id: number): Promise<PrescriberList | undefined> {
        const cachedList = prescriberLists.find(list => list.id === id);
        if (cachedList) return cachedList;
        
        const list = await getPrescriberListById(id);
        return list || undefined;
      },
      
      async createList(payload: CreatePrescriberListPayload): Promise<PrescriberList | null> {
        try {
          const newList = await createPrescriberList(payload);
          if (newList) {
            prescriberLists.push(newList);
          }
          return newList;
        } catch (error) {
          console.error('Erro ao criar lista de prescritores:', error);
          return null;
        }
      },

      async updateList(id: number, payload: UpdatePrescriberListPayload): Promise<boolean> {
        try {
          const success = await updatePrescriberList(id, payload);
          if (success) {
            const index = prescriberLists.findIndex(list => list.id === id);
            if (index !== -1) {
              prescriberLists[index] = {
                ...prescriberLists[index],
                ...payload
              };
            }
          }
          return success;
        } catch (error) {
          console.error('Erro ao atualizar lista de prescritores:', error);
          return false;
        }
      },

      async deleteList(id: number): Promise<boolean> {
        try {
          const success = await deletePrescriberList(id);
          if (success) {
            const index = prescriberLists.findIndex(list => list.id === id);
            if (index !== -1) {
              prescriberLists.splice(index, 1);
            }
          }
          return success;
        } catch (error) {
          console.error('Erro ao deletar lista de prescritores:', error);
          return false;
        }
      },

      async getPrescribersByList(idLista: number): Promise<PrescriberList[]> {
        try {
          return await getPrescribersByListId(idLista);
        } catch (error) {
          console.error('Erro ao buscar prescritores por lista:', error);
          return [];
        }
      },

      async getPrescribersByPrescriber(idPrescritor: number): Promise<PrescriberList[]> {
        try {
          return await getPrescribersByPrescriberId(idPrescritor);
        } catch (error) {
          console.error('Erro ao buscar listas por prescritor:', error);
          return [];
        }
      }
    };
  } catch (error) {
    console.error('Erro ao obter serviço de lista de prescritores:', error);
    return createEmptyPrescriberListService();
  }
}

function createEmptyPrescriberListService(): PrescriberListService {
  return {
    prescriberLists: [],
    getLists: async () => [],
    getListById: async () => undefined,
    createList: async () => null,
    updateList: async () => false,
    deleteList: async () => false,
    getPrescribersByList: async () => [],
    getPrescribersByPrescriber: async () => []
  };
}
