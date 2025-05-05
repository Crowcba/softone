import axios from 'axios';
import https from 'https';
import { getAuthConfig, getAuthToken } from '../../utils/auth';
import { ApiTelefone } from '../../types/visits';

// Interface para compatibilidade com código existente
export interface VisitasProfissionalTelefone {
  idTelefone: number;
  idProfissional: number;
  telefone: string;
  whatsapp: boolean;
  principal?: boolean;
  nomeDaSecretariaTelefone?: string | null;
  deletado: boolean;
}

export interface CreateVisitasProfissionalTelefone {
  idProfissional: number;
  numeroTelefone: string;
  nomeDaSecretariaTelefone?: string;
  principal: boolean;
  whatsapp: boolean;
}

export interface UpdateVisitasProfissionalTelefone {
  idProfissional: number;
  numeroTelefone: string;
  nomeDaSecretariaTelefone?: string;
  principal: boolean;
  whatsapp: boolean;
}

// Usar a URL da API do ambiente ou o valor padrão
const apiBaseURL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7195/api/v1';

/**
 * Busca todos os telefones de profissionais de visitas
 * @returns Array de telefones ou null em caso de erro
 */
export async function getAllVisitasProfissionalTelefones(): Promise<ApiTelefone[] | null> {
  try {
    console.log(`Buscando todos os telefones. URL: ${apiBaseURL}/VisitasProfissionalTelefone`);
    console.log('Token disponível:', !!getAuthToken());
    
    const response = await axios.get(`${apiBaseURL}/VisitasProfissionalTelefone`, getAuthConfig());
    
    console.log('Resposta recebida:', response.status);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erro ao buscar telefones:', error.message);
    } else {
      console.error('Erro desconhecido ao buscar telefones:', error);
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
 * Busca um telefone específico pelo ID
 * @param id ID do telefone
 * @returns Objeto do telefone ou null se não encontrado
 */
export async function getVisitasProfissionalTelefoneById(id: number): Promise<ApiTelefone | null> {
  try {
    console.log(`Buscando telefone por ID ${id}. URL: ${apiBaseURL}/VisitasProfissionalTelefone/${id}`);
    
    const response = await axios.get(`${apiBaseURL}/VisitasProfissionalTelefone/${id}`, getAuthConfig());
    
    console.log('Resposta recebida:', response.status);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Erro ao buscar telefone ID ${id}:`, error.message);
    } else {
      console.error(`Erro desconhecido ao buscar telefone ID ${id}:`, error);
    }
    
    return null;
  }
}

/**
 * Cria um novo telefone para profissional de visitas
 * @param telefone Dados do telefone a ser criado
 * @returns Telefone criado ou null em caso de erro
 */
export async function createVisitasProfissionalTelefone(telefone: ApiTelefone): Promise<ApiTelefone | null> {
  try {
    console.log(`Criando telefone. URL: ${apiBaseURL}/VisitasProfissionalTelefone`);
    console.log('Dados:', telefone);
    
    const response = await axios.post(`${apiBaseURL}/VisitasProfissionalTelefone`, telefone, getAuthConfig());
    
    console.log('Resposta recebida:', response.status);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erro ao criar telefone:', error.message);
    } else {
      console.error('Erro desconhecido ao criar telefone:', error);
    }
    
    // Em ambiente de desenvolvimento, simular resposta de sucesso
    if (process.env.NODE_ENV === 'development') {
      console.warn('Ambiente de desenvolvimento: simulando resposta positiva');
      return { ...telefone, id: Math.floor(Math.random() * 1000) };
    }
    
    return null;
  }
}

/**
 * Atualiza um telefone existente
 * @param id ID do telefone
 * @param telefone Dados atualizados do telefone
 * @returns Telefone atualizado ou null em caso de erro
 */
export async function updateVisitasProfissionalTelefone(id: number, telefone: ApiTelefone): Promise<ApiTelefone | null> {
  try {
    console.log(`Atualizando telefone ID ${id}. URL: ${apiBaseURL}/VisitasProfissionalTelefone/${id}`);
    console.log('Dados:', telefone);
    
    const response = await axios.put(`${apiBaseURL}/VisitasProfissionalTelefone/${id}`, telefone, getAuthConfig());
    
    console.log('Resposta recebida:', response.status);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Erro ao atualizar telefone ID ${id}:`, error.message);
    } else {
      console.error(`Erro desconhecido ao atualizar telefone ID ${id}:`, error);
    }
    
    // Em ambiente de desenvolvimento, simular resposta de sucesso
    if (process.env.NODE_ENV === 'development') {
      console.warn('Ambiente de desenvolvimento: simulando resposta positiva');
      return { ...telefone, id };
    }
    
    return null;
  }
}

/**
 * Marca um telefone como deletado (soft delete)
 * @param id ID do telefone
 * @returns true se bem-sucedido, false caso contrário
 */
export async function softDeleteVisitasProfissionalTelefone(id: number): Promise<boolean> {
  try {
    console.log(`Soft delete telefone ID ${id}. URL: ${apiBaseURL}/VisitasProfissionalTelefone/SoftDelete/${id}`);
    
    const response = await axios.delete(`${apiBaseURL}/VisitasProfissionalTelefone/SoftDelete/${id}`, getAuthConfig());
    
    console.log('Resposta recebida:', response.status);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Erro ao realizar soft delete do telefone ID ${id}:`, error.message);
    } else {
      console.error(`Erro desconhecido ao realizar soft delete do telefone ID ${id}:`, error);
    }
    
    // Em ambiente de desenvolvimento, simular resposta de sucesso
    if (process.env.NODE_ENV === 'development') {
      console.warn('Ambiente de desenvolvimento: simulando resposta positiva');
      return true;
    }
    
    return false;
  }
}

/**
 * Remove permanentemente um telefone
 * @param id ID do telefone
 * @returns true se bem-sucedido, false caso contrário
 */
export async function deleteVisitasProfissionalTelefone(id: number): Promise<boolean> {
  try {
    console.log(`Deletando telefone ID ${id}. URL: ${apiBaseURL}/VisitasProfissionalTelefone/${id}`);
    
    const response = await axios.delete(`${apiBaseURL}/VisitasProfissionalTelefone/${id}`, getAuthConfig());
    
    console.log('Resposta recebida:', response.status);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Erro ao deletar telefone ID ${id}:`, error.message);
    } else {
      console.error(`Erro desconhecido ao deletar telefone ID ${id}:`, error);
    }
    
    // Em ambiente de desenvolvimento, simular resposta de sucesso
    if (process.env.NODE_ENV === 'development') {
      console.warn('Ambiente de desenvolvimento: simulando resposta positiva');
      return true;
    }
    
    return false;
  }
}

/**
 * Busca telefones por ID do profissional
 * @param idProfissional ID do profissional
 * @returns Array de telefones ou null em caso de erro
 */
export const getTelefonesByProfissionalId = async (id: number): Promise<VisitasProfissionalTelefone[]> => {
  try {
    console.log(`Buscando telefones do profissional ID ${id}`);
    const response = await axios.get(
      `${apiBaseURL}/VisitasProfissionalTelefone/ByProfissional/${id}`, 
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar telefones do profissional ID ${id}:`, error);
    if (process.env.NODE_ENV === 'development') {
      return [];
    }
    throw error;
  }
};
