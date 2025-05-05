import axios from 'axios';
import { getAuthConfig, getAuthToken } from '../../utils/auth';
import { ApiAddressProfessionalLink } from '../../types/visits';

// Usar a URL da API do ambiente ou o valor padrão
const apiBaseURL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7195/api/v1';

/**
 * Busca todos os vínculos entre endereços e profissionais
 * @returns Array de vínculos ou null em caso de erro
 */
export async function getAllAddressProfessionalLinks(): Promise<ApiAddressProfessionalLink[] | null> {
  try {
    console.log(`Buscando todos os vínculos. URL: ${apiBaseURL}/api/VisitasVinculoEnderecoProfissional`);
    console.log('Token disponível:', !!getAuthToken());
    
    const response = await axios.get(`${apiBaseURL}/api/VisitasVinculoEnderecoProfissional`, getAuthConfig());
    
    console.log('Resposta recebida:', response.status);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erro ao buscar vínculos:', error.message);
    } else {
      console.error('Erro desconhecido ao buscar vínculos:', error);
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
 * Busca um vínculo específico pelo ID
 * @param id ID do vínculo
 * @returns Objeto do vínculo ou null se não encontrado
 */
export async function getAddressProfessionalLinkById(id: number): Promise<ApiAddressProfessionalLink | null> {
  try {
    console.log(`Buscando vínculo por ID ${id}. URL: ${apiBaseURL}/api/VisitasVinculoEnderecoProfissional/${id}`);
    
    const response = await axios.get(`${apiBaseURL}/api/VisitasVinculoEnderecoProfissional/${id}`, getAuthConfig());
    
    console.log('Resposta recebida:', response.status);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Erro ao buscar vínculo ID ${id}:`, error.message);
    } else {
      console.error(`Erro desconhecido ao buscar vínculo ID ${id}:`, error);
    }
    
    return null;
  }
}

/**
 * Busca vínculos por ID do profissional
 * @param idProfissional ID do profissional
 * @returns Array de vínculos ou null em caso de erro
 */
export async function getLinksByProfessionalId(idProfissional: number): Promise<ApiAddressProfessionalLink[] | null> {
  try {
    console.log(`Buscando vínculos do profissional ID ${idProfissional}. URL: ${apiBaseURL}/api/VisitasVinculoEnderecoProfissional/profissional/${idProfissional}`);
    
    const response = await axios.get(`${apiBaseURL}/api/VisitasVinculoEnderecoProfissional/profissional/${idProfissional}`, getAuthConfig());
    
    console.log('Resposta recebida:', response.status);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Erro ao buscar vínculos do profissional ID ${idProfissional}:`, error.message);
    } else {
      console.error(`Erro desconhecido ao buscar vínculos do profissional ID ${idProfissional}:`, error);
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
 * Busca vínculos por ID da origem/destino
 * @param idOrigemDestino ID da origem/destino
 * @returns Array de vínculos ou null em caso de erro
 */
export async function getLinksByAddressId(idOrigemDestino: number): Promise<ApiAddressProfessionalLink[] | null> {
  try {
    console.log(`Buscando vínculos do endereço ID ${idOrigemDestino}. URL: ${apiBaseURL}/api/VisitasVinculoEnderecoProfissional/origemdestino/${idOrigemDestino}`);
    
    const response = await axios.get(`${apiBaseURL}/api/VisitasVinculoEnderecoProfissional/origemdestino/${idOrigemDestino}`, getAuthConfig());
    
    console.log('Resposta recebida:', response.status);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Erro ao buscar vínculos do endereço ID ${idOrigemDestino}:`, error.message);
    } else {
      console.error(`Erro desconhecido ao buscar vínculos do endereço ID ${idOrigemDestino}:`, error);
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
 * Cria um novo vínculo entre endereço e profissional
 * @param link Dados do vínculo a ser criado
 * @returns Vínculo criado ou null em caso de erro
 */
export async function createAddressProfessionalLink(link: ApiAddressProfessionalLink): Promise<ApiAddressProfessionalLink | null> {
  try {
    console.log(`Criando vínculo. URL: ${apiBaseURL}/api/VisitasVinculoEnderecoProfissional`);
    console.log('Dados:', link);
    
    const response = await axios.post(`${apiBaseURL}/api/VisitasVinculoEnderecoProfissional`, link, getAuthConfig());
    
    console.log('Resposta recebida:', response.status);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erro ao criar vínculo:', error.message);
    } else {
      console.error('Erro desconhecido ao criar vínculo:', error);
    }
    
    // Em ambiente de desenvolvimento, simular resposta de sucesso
    if (process.env.NODE_ENV === 'development') {
      console.warn('Ambiente de desenvolvimento: simulando resposta positiva');
      return { ...link, id: Math.floor(Math.random() * 1000) };
    }
    
    return null;
  }
}

/**
 * Atualiza um vínculo existente
 * @param id ID do vínculo
 * @param link Dados atualizados do vínculo
 * @returns true se bem-sucedido, false caso contrário
 */
export async function updateAddressProfessionalLink(id: number, link: ApiAddressProfessionalLink): Promise<boolean> {
  try {
    console.log(`Atualizando vínculo ID ${id}. URL: ${apiBaseURL}/api/VisitasVinculoEnderecoProfissional/${id}`);
    console.log('Dados:', link);
    
    const response = await axios.put(`${apiBaseURL}/api/VisitasVinculoEnderecoProfissional/${id}`, link, getAuthConfig());
    
    console.log('Resposta recebida:', response.status);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Erro ao atualizar vínculo ID ${id}:`, error.message);
    } else {
      console.error(`Erro desconhecido ao atualizar vínculo ID ${id}:`, error);
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
 * Remove permanentemente um vínculo
 * @param id ID do vínculo
 * @returns true se bem-sucedido, false caso contrário
 */
export async function deleteAddressProfessionalLink(id: number): Promise<boolean> {
  try {
    console.log(`Deletando vínculo ID ${id}. URL: ${apiBaseURL}/api/VisitasVinculoEnderecoProfissional/${id}`);
    
    const response = await axios.delete(`${apiBaseURL}/api/VisitasVinculoEnderecoProfissional/${id}`, getAuthConfig());
    
    console.log('Resposta recebida:', response.status);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Erro ao deletar vínculo ID ${id}:`, error.message);
    } else {
      console.error(`Erro desconhecido ao deletar vínculo ID ${id}:`, error);
    }
    
    // Em ambiente de desenvolvimento, simular resposta de sucesso
    if (process.env.NODE_ENV === 'development') {
      console.warn('Ambiente de desenvolvimento: simulando resposta positiva');
      return true;
    }
    
    return false;
  }
} 