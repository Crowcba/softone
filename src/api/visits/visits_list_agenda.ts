import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
 * Configuração padrão para requisições axios
 * @returns Objeto de configuração com headers padrão
 */
const getConfig = () => {
  const token = Cookies.get('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

/**
 * Obtém a lista de todos os locais de prescritores
 * @returns Array de LocalPrescritor ou null em caso de erro
 */
export const getAllLocaisPrescritores = async (): Promise<LocalPrescritor[] | null> => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/VisitasLocalPrescritoresListum`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar locais de prescritores:', error);
    return null;
  }
};

/**
 * Obtém um local de prescritor específico pelo ID
 * @param id ID do local de prescritor
 * @returns LocalPrescritor ou null em caso de erro/não encontrado
 */
export const getLocalPrescritoresById = async (id: number): Promise<LocalPrescritor | null> => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/VisitasLocalPrescritoresListum/${id}`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar local de prescritor com ID ${id}:`, error);
    return null;
  }
};

/**
 * Obtém todos os locais de prescritores associados a um usuário específico
 * @param idUsuario ID do usuário
 * @returns Array de LocalPrescritor ou array vazio em caso de erro
 */
export const getLocaisPrescritoresByUsuario = async (idUsuario: string): Promise<LocalPrescritor[]> => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/VisitasLocalPrescritoresListum/usuario/${idUsuario}`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar locais de prescritores para o usuário ${idUsuario}:`, error);
    return [];
  }
};

/**
 * Cria um novo local de prescritor
 * @param payload Dados do local de prescritor a ser criado
 * @returns LocalPrescritor criado ou null em caso de erro
 */
export const createLocalPrescritor = async (
  payload: CreateLocalPrescritorPayload
): Promise<LocalPrescritor | null> => {
  try {
    // Validar payload
    if (!payload.idLocal) {
      throw new Error('idLocal é obrigatório');
    }
    
    const response = await axios.post(
      `${apiUrl}/api/VisitasLocalPrescritoresListum`,
      payload,
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao criar local de prescritor:', error);
    return null;
  }
};

/**
 * Atualiza um local de prescritor existente
 * @param id ID do local de prescritor a ser atualizado
 * @param payload Dados atualizados do local de prescritor
 * @returns true se atualizado com sucesso, false caso contrário
 */
export const updateLocalPrescritor = async (
  id: number,
  payload: UpdateLocalPrescritorPayload
): Promise<boolean> => {
  try {
    // Validar payload
    if (!payload.idLocal) {
      throw new Error('idLocal é obrigatório');
    }
    
    await axios.put(
      `${apiUrl}/api/VisitasLocalPrescritoresListum/${id}`,
      payload,
      getConfig()
    );
    return true;
  } catch (error) {
    console.error(`Erro ao atualizar local de prescritor com ID ${id}:`, error);
    return false;
  }
};

/**
 * Remove um local de prescritor do sistema
 * @param id ID do local de prescritor a ser removido
 * @returns true se removido com sucesso, false caso contrário
 */
export const deleteLocalPrescritor = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(
      `${apiUrl}/api/VisitasLocalPrescritoresListum/${id}`,
      getConfig()
    );
    return true;
  } catch (error) {
    console.error(`Erro ao excluir local de prescritor com ID ${id}:`, error);
    return false;
  }
};
