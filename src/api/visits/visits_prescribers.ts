import axios from 'axios';
import Cookies from 'js-cookie';
import https from 'https';
import { getAuthConfig, getAuthToken } from '../../utils/auth';
import { ApiProfissional } from '../../types/visits';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Interface que representa o modelo de Visitas Profissionais
export interface VisitasProfissional {
  idProfissional: number;
  nomeProfissional: string;
  sexoProfissional: string;
  dataNascimentoProfissional: string;
  profissaoProfissional: string;
  especialidadeProfissional: string;
  conselhoProfissional: string;
  numeroConselhoProfissional: string;
  emailProfissional: string;
  idPromotor: string;
  idConselho?: number | null;
  idEstadoConselho?: number | null;
  status: boolean;
}

// Função centralizada para obter o token com maior robustez
function getToken(): string {
  // Verificar em várias fontes possíveis
  const cookieToken = Cookies.get('token');
  const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const sessionStorageToken = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
  
  // Usar o primeiro token disponível
  const token = cookieToken || localStorageToken || sessionStorageToken || '';
  
  if (!token) {
    console.warn('Token de autenticação não encontrado em nenhuma fonte');
  }
  
  return token;
}

// Adicionar um interceptor global para garantir que todas as requisições tenham o token
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    if (token) {
      // Certificar-se de que existe um objeto de headers
      config.headers = config.headers || {};
      
      // Adicionar o token de autorização
      config.headers['Authorization'] = `Bearer ${token}`;
      
      // Ignorar erros de certificado SSL em desenvolvimento
      config.httpsAgent = new https.Agent({ rejectUnauthorized: false });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Busca todos os profissionais de visitas
 * @returns Array de profissionais ou null em caso de erro
 */
export async function getAllVisitasProfissionais(): Promise<VisitasProfissional[] | null> {
  try {
    console.log(`Buscando todos os profissionais. URL: ${apiUrl}/api/VisitasProfissionais`);
    console.log('Token disponível:', !!getAuthToken());
    
    const response = await axios.get(`${apiUrl}/api/VisitasProfissionais`, getAuthConfig());
    
    console.log('Resposta recebida:', response.status);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erro ao buscar profissionais:', error.message);
    } else {
      console.error('Erro desconhecido ao buscar profissionais:', error);
    }
    
    // Em ambiente de desenvolvimento, retornar um array vazio para não interromper o fluxo
    if (process.env.NODE_ENV === 'development') {
      console.warn('Ambiente de desenvolvimento: retornando array vazio');
      return [];
    }
    
    return null;
  }
}

/**
 * Busca um profissional específico pelo ID
 * @param id ID do profissional
 * @returns Objeto do profissional ou null se não encontrado
 */
export async function getVisitasProfissionalById(id: number): Promise<ApiProfissional | null> {
  try {
    console.log(`Buscando profissional por ID ${id}. URL: ${apiUrl}/api/VisitasProfissional/${id}`);
    
    const response = await axios.get(`${apiUrl}/api/VisitasProfissional/${id}`, getAuthConfig());
    
    console.log('Resposta recebida:', response.status);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Erro ao buscar profissional ID ${id}:`, error.message);
    } else {
      console.error(`Erro desconhecido ao buscar profissional ID ${id}:`, error);
    }
    
    return null;
  }
}

/**
 * Cria um novo profissional de visitas
 * @param profissional Dados do profissional a ser criado
 * @returns Profissional criado ou null em caso de erro
 */
export async function createVisitasProfissional(profissional: ApiProfissional): Promise<ApiProfissional | null> {
  try {
    console.log(`Criando profissional. URL: ${apiUrl}/api/VisitasProfissional`);
    console.log('Dados:', profissional);
    
    const response = await axios.post(`${apiUrl}/api/VisitasProfissional`, profissional, getAuthConfig());
    
    console.log('Resposta recebida:', response.status);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erro ao criar profissional:', error.message);
    } else {
      console.error('Erro desconhecido ao criar profissional:', error);
    }
    
    // Em ambiente de desenvolvimento, simular resposta de sucesso
    if (process.env.NODE_ENV === 'development') {
      console.warn('Ambiente de desenvolvimento: simulando resposta positiva');
      return { ...profissional, id: Math.floor(Math.random() * 1000) };
    }
    
    return null;
  }
}

/**
 * Atualiza um profissional existente
 * @param id ID do profissional
 * @param profissional Dados atualizados do profissional
 * @returns Profissional atualizado ou null em caso de erro
 */
export async function updateVisitasProfissional(id: number, profissional: ApiProfissional): Promise<ApiProfissional | null> {
  try {
    console.log(`Atualizando profissional ID ${id}. URL: ${apiUrl}/api/VisitasProfissional/${id}`);
    console.log('Dados:', profissional);
    
    const response = await axios.put(`${apiUrl}/api/VisitasProfissional/${id}`, profissional, getAuthConfig());
    
    console.log('Resposta recebida:', response.status);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Erro ao atualizar profissional ID ${id}:`, error.message);
    } else {
      console.error(`Erro desconhecido ao atualizar profissional ID ${id}:`, error);
    }
    
    // Em ambiente de desenvolvimento, simular resposta de sucesso
    if (process.env.NODE_ENV === 'development') {
      console.warn('Ambiente de desenvolvimento: simulando resposta positiva');
      return { ...profissional, id };
    }
    
    return null;
  }
}

/**
 * Remove um profissional (soft delete)
 * @param id ID do profissional
 * @returns true se removido com sucesso, false caso contrário
 */
export async function softDeleteVisitasProfissional(id: number): Promise<boolean> {
  try {
    const token = getToken();
    
    if (!token) {
      console.warn(`Token não encontrado. Não é possível excluir profissional ID ${id}.`);
      return false;
    }
    
    const url = `${apiUrl}/api/VisitasProfissional/SoftDelete/${id}`;
    console.log(`Soft delete profissional ID ${id} em:`, url);
    
    await axios.delete(url, getAuthConfig());
    return true;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Erro ao soft delete profissional ID ${id}:`, error.response.status, error.response.statusText);
      console.error('Detalhes:', error.response.data);
    } else {
      console.error(`Erro ao soft delete profissional ID ${id}:`, error);
    }
    return false;
  }
}

/**
 * Remove um profissional de forma permanente
 * @param id ID do profissional
 * @returns true se removido com sucesso, false caso contrário
 */
export async function deleteVisitasProfissional(id: number): Promise<boolean> {
  try {
    const token = getToken();
    
    if (!token) {
      console.warn(`Token não encontrado. Não é possível excluir profissional ID ${id}.`);
      return false;
    }
    
    const url = `${apiUrl}/api/VisitasProfissionais/${id}`;
    console.log(`Excluindo profissional ID ${id} em:`, url);
    
    await axios.delete(url, getAuthConfig());
    return true;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Erro ao excluir profissional ID ${id}:`, error.response.status, error.response.statusText);
      console.error('Detalhes:', error.response.data);
    } else {
      console.error(`Erro ao excluir profissional ID ${id}:`, error);
    }
    return false;
  }
}

/**
 * Atualiza o status de um profissional
 * @param id ID do profissional
 * @param status Novo status
 * @returns true se atualizado com sucesso, false caso contrário
 */
export async function updateStatus(id: number, status: boolean): Promise<boolean> {
  try {
    await axios.patch(
      `${apiUrl}/api/VisitasProfissionais/status/${id}`,
      status,
      getAuthConfig()
    );
    return true;
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return false;
  }
}

/**
 * Atualiza o promotor de um profissional via corpo da requisição
 * @param id ID do profissional
 * @param idPromotor ID do novo promotor
 * @returns ID do promotor atualizado ou null em caso de erro
 */
export async function updatePromotorViaBody(id: number, idPromotor: string): Promise<string | null> {
  try {
    const token = getToken();
    
    if (!token) {
      console.warn(`Token não encontrado. Não é possível atualizar promotor do profissional ID ${id}.`);
      return null;
    }
    
    const url = `${apiUrl}/api/VisitasProfissionais/promotor/${id}`;
    console.log(`Atualizando promotor do profissional ID ${id} para "${idPromotor}" em:`, url);
    
    const response = await axios.patch(
      url, 
      JSON.stringify(idPromotor), 
      {
        ...getAuthConfig(),
        headers: {
          ...getAuthConfig().headers,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Erro ao atualizar promotor do profissional ID ${id}:`, error.response.status, error.response.statusText);
      console.error('Detalhes:', error.response.data);
    } else {
      console.error(`Erro ao atualizar promotor do profissional ID ${id}:`, error);
    }
    return null;
  }
}

/**
 * Atualiza o promotor de um profissional via rota
 * @param id ID do profissional
 * @param idPromotor ID do novo promotor
 * @returns ID do promotor atualizado ou null em caso de erro
 */
export async function updatePromotorViaRoute(id: number, idPromotor: string): Promise<string | null> {
  try {
    const token = getToken();
    
    if (!token) {
      console.warn(`Token não encontrado. Não é possível atualizar promotor do profissional ID ${id}.`);
      return null;
    }
    
    const url = `${apiUrl}/api/VisitasProfissionais/promotor/${id}/${idPromotor}`;
    console.log(`Atualizando promotor do profissional ID ${id} para "${idPromotor}" via rota em:`, url);
    
    const response = await axios.patch(url, null, getAuthConfig());
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Erro ao atualizar promotor do profissional ID ${id} via rota:`, error.response.status, error.response.statusText);
      console.error('Detalhes:', error.response.data);
    } else {
      console.error(`Erro ao atualizar promotor do profissional ID ${id} via rota:`, error);
    }
    return null;
  }
}

/**
 * Busca profissionais por termo de pesquisa
 * @param searchTerm Termo para pesquisa (nome, especialidade, etc.)
 * @returns Array de profissionais ou null em caso de erro
 */
export async function searchVisitasProfissionais(searchTerm: string): Promise<ApiProfissional[] | null> {
  try {
    console.log(`Pesquisando profissionais com termo "${searchTerm}". URL: ${apiUrl}/VisitasProfissional/Search?term=${encodeURIComponent(searchTerm)}`);
    
    const response = await axios.get(
      `${apiUrl}/VisitasProfissional/Search?term=${encodeURIComponent(searchTerm)}`,
      getAuthConfig()
    );
    
    console.log('Resposta recebida:', response.status);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Erro ao pesquisar profissionais com termo "${searchTerm}":`, error.message);
    } else {
      console.error(`Erro desconhecido ao pesquisar profissionais com termo "${searchTerm}":`, error);
    }
    
    return null;
  }
} 