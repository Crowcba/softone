import {
  getAllLocaisPrescritores,
  getLocalPrescritoresById,
  getLocaisPrescritoresByUsuario,
  createLocalPrescritor,
  updateLocalPrescritor,
  deleteLocalPrescritor
} from '../../api/visits/visits_list_agenda';

interface LocalPrescritor {
  id: number;
  descricao: string;
  idLocal: number;
  idUsuario: string;
}

interface CreateLocalPrescritorPayload {
  descricao?: string;
  idLocal: number;
  idUsuario?: string;
}

interface UpdateLocalPrescritorPayload {
  id?: number;
  descricao?: string;
  idLocal: number;
  idUsuario?: string;
}

/**
 * Interface para o serviço de locais de prescritores
 */
interface LocalPrescritorService {
  getAll(): Promise<LocalPrescritor[]>;
  getById(id: number): Promise<LocalPrescritor | null>;
  getByUsuario(idUsuario: string): Promise<LocalPrescritor[]>;
  create(payload: CreateLocalPrescritorPayload): Promise<LocalPrescritor | null>;
  update(id: number, payload: UpdateLocalPrescritorPayload): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  
  // Métodos de manipulação em memória
  filterByDescricao(descricao: string): LocalPrescritor[];
  filterByLocal(idLocal: number): LocalPrescritor[];
  clearCache(): void;
  refreshCache(): Promise<void>;
}

/**
 * Implementação do serviço de locais de prescritores
 */
class LocalPrescritorServiceImpl implements LocalPrescritorService {
  private cache: LocalPrescritor[] = [];
  private initialized = false;

  /**
   * Inicializa o cache se ainda não estiver inicializado
   */
  private async initializeIfNeeded(): Promise<void> {
    if (!this.initialized) {
      await this.refreshCache();
    }
  }

  /**
   * Obtém todos os locais de prescritores
   * @returns Array de locais de prescritores
   */
  async getAll(): Promise<LocalPrescritor[]> {
    await this.initializeIfNeeded();
    return [...this.cache];
  }

  /**
   * Obtém um local de prescritor específico pelo ID
   * @param id ID do local de prescritor
   * @returns Local de prescritor ou null se não encontrado
   */
  async getById(id: number): Promise<LocalPrescritor | null> {
    // Tentar buscar do cache primeiro
    await this.initializeIfNeeded();
    const cachedItem = this.cache.find(item => item.id === id);
    
    if (cachedItem) {
      return cachedItem;
    }
    
    // Se não estiver no cache, buscar da API
    return await getLocalPrescritoresById(id);
  }

  /**
   * Obtém todos os locais de prescritores associados a um usuário
   * @param idUsuario ID do usuário
   * @returns Array de locais de prescritores do usuário
   */
  async getByUsuario(idUsuario: string): Promise<LocalPrescritor[]> {
    // Buscar diretamente da API para garantir dados atualizados
    const locais = await getLocaisPrescritoresByUsuario(idUsuario);
    
    // Atualizar o cache com os novos dados
    this.updateCacheWithItems(locais);
    
    return locais;
  }

  /**
   * Cria um novo local de prescritor
   * @param payload Dados do local de prescritor a ser criado
   * @returns Local de prescritor criado ou null em caso de erro
   */
  async create(payload: CreateLocalPrescritorPayload): Promise<LocalPrescritor | null> {
    const novoLocal = await createLocalPrescritor(payload);
    
    if (novoLocal) {
      // Adicionar ao cache
      this.cache.push(novoLocal);
    }
    
    return novoLocal;
  }

  /**
   * Atualiza um local de prescritor existente
   * @param id ID do local de prescritor a ser atualizado
   * @param payload Dados atualizados do local de prescritor
   * @returns true se atualizado com sucesso, false caso contrário
   */
  async update(id: number, payload: UpdateLocalPrescritorPayload): Promise<boolean> {
    const success = await updateLocalPrescritor(id, payload);
    
    if (success) {
      // Atualizar o cache
      const index = this.cache.findIndex(item => item.id === id);
      if (index !== -1) {
        this.cache[index] = {
          ...this.cache[index],
          ...payload,
          id // Garantir que o id não seja alterado
        };
      }
    }
    
    return success;
  }

  /**
   * Remove um local de prescritor
   * @param id ID do local de prescritor a ser removido
   * @returns true se removido com sucesso, false caso contrário
   */
  async delete(id: number): Promise<boolean> {
    const success = await deleteLocalPrescritor(id);
    
    if (success) {
      // Remover do cache
      this.cache = this.cache.filter(item => item.id !== id);
    }
    
    return success;
  }

  /**
   * Filtra locais de prescritores por descrição (busca parcial, case insensitive)
   * @param descricao Texto a ser buscado na descrição
   * @returns Array de locais de prescritores que correspondem ao filtro
   */
  filterByDescricao(descricao: string): LocalPrescritor[] {
    const searchTerm = descricao.toLowerCase();
    return this.cache.filter(item => 
      item.descricao && item.descricao.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Filtra locais de prescritores por ID do local
   * @param idLocal ID do local a ser filtrado
   * @returns Array de locais de prescritores com o idLocal especificado
   */
  filterByLocal(idLocal: number): LocalPrescritor[] {
    return this.cache.filter(item => item.idLocal === idLocal);
  }

  /**
   * Limpa o cache de locais de prescritores
   */
  clearCache(): void {
    this.cache = [];
    this.initialized = false;
  }

  /**
   * Atualiza o cache com novos itens
   * @param items Itens para atualizar o cache
   */
  private updateCacheWithItems(items: LocalPrescritor[]): void {
    // Para cada item, atualizar o cache se existir, senão adicionar
    items.forEach(item => {
      const index = this.cache.findIndex(cached => cached.id === item.id);
      if (index !== -1) {
        this.cache[index] = item;
      } else {
        this.cache.push(item);
      }
    });
  }

  /**
   * Atualiza o cache com dados da API
   */
  async refreshCache(): Promise<void> {
    const locais = await getAllLocaisPrescritores();
    if (locais) {
      this.cache = locais;
      this.initialized = true;
    }
  }
}

// Exportar uma instância única do serviço
export const localPrescritorService = new LocalPrescritorServiceImpl();

// Exportar a interface e implementação para uso externo
export type { LocalPrescritor, CreateLocalPrescritorPayload, UpdateLocalPrescritorPayload, LocalPrescritorService };
export { LocalPrescritorServiceImpl };
