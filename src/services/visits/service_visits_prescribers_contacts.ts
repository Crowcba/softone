import {
  getAllVisitasProfissionalTelefones,
  getVisitasProfissionalTelefoneById,
  createVisitasProfissionalTelefone,
  updateVisitasProfissionalTelefone,
  deleteVisitasProfissionalTelefone,
  softDeleteVisitasProfissionalTelefone
} from '../../api/visits/visits_prescribers_contacts';
import { getAuthToken, isAuthenticated, getAuthConfig } from '../../utils/auth';
import axios from 'axios';
import https from 'https';
import Cookies from 'js-cookie';
import { 
  ApiTelefone, 
  ServiceTelefone, 
  adaptApiToServiceTelefone, 
  adaptServiceToApiTelefone 
} from '../../types/visits';

// URL base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.194.62:5000";

// Configuração para ignorar erros de certificado SSL em ambiente de desenvolvimento
// Usar apenas em funções internas do serviço que precisam do axiosInstance diretamente,
// não nas chamadas para funções da API que já têm sua própria implementação de autenticação
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
});

// Função auxiliar para obter o token de autenticação para debug
function getDebugToken(): string {
  const cookieToken = Cookies.get('token');
  const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const sessionStorageToken = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
  
  // Log de debug para ajudar na identificação de problemas
  console.log('Cookie token disponível:', !!cookieToken);
  console.log('LocalStorage token disponível:', !!localStorageToken);
  console.log('SessionStorage token disponível:', !!sessionStorageToken);
  
  return cookieToken || localStorageToken || sessionStorageToken || '';
}

// Log inicial para debug
console.log('service_visits_prescribers_contacts inicializado.');
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Token disponível:', !!getDebugToken());

// Função para validar um número de telefone
export const validateTelefone = (telefone: string): boolean => {
  // Valida se o número tem pelo menos 10 dígitos numéricos (sem contar formatação)
  return telefone.replace(/\D/g, '').length >= 10;
};

export interface VisitasProfissionalTelefone {
  idTelefone: number;
  idProfissional: number;
  numeroTelefone: string;
  nomeDaSecretariaTelefone: string;
  principal: boolean;
  whatsapp: boolean;
  idProfissionalNavigation?: string;
}

export async function getTelefonesByProfissionalId(idProfissional: number): Promise<VisitasProfissionalTelefone[]> {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/VisitasProfissionalTelefone/profissional/${idProfissional}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar telefones do profissional ${idProfissional}:`, error);
    return [];
  }
}

// Função para adicionar um novo telefone
export const handleCreateTelefone = async (data: any): Promise<any> => {
  try {
    console.log('=== INÍCIO DA CRIAÇÃO DE TELEFONE ===');
    console.log('Dados recebidos do formulário:', JSON.stringify(data, null, 2));
    
    // Validações
    if (!data.idProfissional) {
      throw new Error('ID do profissional é obrigatório');
    }
    if (!data.numeroTelefone) {
      throw new Error('Número de telefone é obrigatório');
    }
    
    // Remove formatação do telefone
    const numeroTelefone = data.numeroTelefone.replace(/\D/g, '');
    if (numeroTelefone.length < 10) {
      throw new Error('Número de telefone inválido');
    }
    
    const url = `${API_BASE_URL}/api/VisitasProfissionalTelefone`;
    console.log('URL da API:', url);
    
    const authConfig = getAuthConfig();
    console.log('Config de autenticação:', JSON.stringify(authConfig, null, 2));
    
    const payload = {
      idProfissional: data.idProfissional,
      numeroTelefone: numeroTelefone,
      nomeDaSecretariaTelefone: data.nomeDaSecretariaTelefone || "Não Informado",
      principal: data.principal || false,
      whatsapp: data.whatsapp || false
    };
    
    console.log('=== PAYLOAD SENDO ENVIADO PARA API ===');
    console.log(JSON.stringify(payload, null, 2));
    console.log('=== FIM DO PAYLOAD ===');
    
    const response = await axios.post(url, payload, authConfig);
    
    console.log('=== RESPOSTA DA API ===');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('=== FIM DA RESPOSTA ===');
    console.log('=== FIM DA CRIAÇÃO DE TELEFONE ===');
    return response.data;
  } catch (error) {
    console.error('=== ERRO NA CRIAÇÃO DE TELEFONE ===');
    console.error('Erro detalhado:', error);
    if (axios.isAxiosError(error)) {
      console.error('Status do erro:', error.response?.status);
      console.error('Dados do erro:', JSON.stringify(error.response?.data, null, 2));
      console.error('Headers da requisição:', JSON.stringify(error.config?.headers, null, 2));
      console.error('URL da requisição:', error.config?.url);
      console.error('Payload enviado:', JSON.stringify(error.config?.data, null, 2));
    }
    console.error('=== FIM DO ERRO ===');
    throw error;
  }
};

// Função para atualizar um telefone existente
export const handleUpdateTelefone = async (telefoneId: number, data: Partial<ServiceTelefone>): Promise<ServiceTelefone> => {
  try {
    console.log(`[TelefonesService] Atualizando telefone ID ${telefoneId}:`, data);
    
    // Verifica autenticação
    if (!isAuthenticated()) {
      console.error('[TelefonesService] Tentativa de atualizar telefone sem autenticação');
      throw new Error('Usuário não autenticado');
    }
    
    // Primeiro buscamos o telefone atual para mesclá-lo com as atualizações
    const apiTelefone = await getVisitasProfissionalTelefoneById(telefoneId);
    
    if (!apiTelefone) {
      throw new Error(`Telefone com ID ${telefoneId} não encontrado`);
    }
    
    // Convertemos para o formato do serviço
    const currentTelefone = adaptApiToServiceTelefone(apiTelefone);
    
    // Garantir que o campo deletado seja explicitamente definido como false se não estiver sendo definido
    if (data.deletado === undefined) {
      data.deletado = false;
    }
    
    // Mesclamos o telefone atual com as atualizações
    const updatedTelefone: ServiceTelefone = {
      ...currentTelefone,
      ...data
    };
    
    // Adaptamos para o formato da API
    const apiPayload = adaptServiceToApiTelefone(updatedTelefone);
    
    console.log(`[TelefonesService] Enviando atualização para API:`, apiPayload);
    
    // Enviamos a atualização
    const result = await updateVisitasProfissionalTelefone(telefoneId, apiPayload);
    
    if (!result) {
      throw new Error(`Falha ao atualizar telefone ${telefoneId}`);
    }
    
    // Adaptamos o resultado para o formato do serviço
    const serviceResult = adaptApiToServiceTelefone(result);
    
    console.log(`[TelefonesService] Telefone ID ${telefoneId} atualizado com sucesso:`, serviceResult);
    return serviceResult;
  } catch (error: unknown) {
    console.error(`[TelefonesService] Erro ao atualizar telefone ${telefoneId}:`, error instanceof Error ? error.message : error);
    
    // Em ambiente de desenvolvimento, simular sucesso
    if (process.env.NODE_ENV === 'development') {
      console.warn('[TelefonesService] Ambiente de desenvolvimento: simulando resposta positiva');
      
      // Retornar telefone atualizado como simulação
      const mockResult: ServiceTelefone = {
        idTelefone: telefoneId,
        ...data,
        idProfissional: data.idProfissional || 0,
        telefone: data.telefone || '',
        deletado: false
      };
      
      return mockResult;
    }
    
    throw error instanceof Error ? error : new Error(`Erro desconhecido ao atualizar telefone ${telefoneId}`);
  }
};

// Função para "excluir logicamente" um telefone (apenas marca como deletado)
export const handleSoftDeleteTelefone = async (telefoneId: number): Promise<void> => {
  try {
    console.log(`[TelefonesService] Realizando soft delete do telefone ID ${telefoneId}`);
    
    // Verifica autenticação
    if (!isAuthenticated()) {
      console.error('[TelefonesService] Tentativa de soft delete telefone sem autenticação');
      throw new Error('Usuário não autenticado');
    }
    
    const result = await softDeleteVisitasProfissionalTelefone(telefoneId);
    
    if (!result) {
      throw new Error(`Falha ao realizar soft delete do telefone ID ${telefoneId}`);
    }
    
    console.log(`[TelefonesService] Soft delete do telefone ID ${telefoneId} realizado com sucesso`);
  } catch (error: unknown) {
    console.error(`[TelefonesService] Erro ao realizar soft delete do telefone ID ${telefoneId}:`, error instanceof Error ? error.message : error);
    
    // Em ambiente de desenvolvimento, simular sucesso
    if (process.env.NODE_ENV === 'development') {
      console.warn('[TelefonesService] Ambiente de desenvolvimento: simulando resposta positiva');
      return; // Retorna sem erro em ambiente de desenvolvimento
    }
    
    throw error instanceof Error ? error : new Error(`Erro desconhecido ao realizar soft delete do telefone ID ${telefoneId}`);
  }
};

// Função para excluir um telefone permanentemente
export const handleDeleteTelefone = async (telefoneId: number): Promise<boolean> => {
  try {
    console.log(`[TelefonesService] Removendo permanentemente o telefone ID ${telefoneId}`);
    
    // Verifica autenticação
    if (!isAuthenticated()) {
      console.error('[TelefonesService] Tentativa de deletar telefone sem autenticação');
      throw new Error('Usuário não autenticado');
    }
    
    const result = await deleteVisitasProfissionalTelefone(telefoneId);
    
    if (!result) {
      throw new Error(`Falha ao deletar telefone ID ${telefoneId}`);
    }
    
    console.log(`[TelefonesService] Telefone ID ${telefoneId} deletado com sucesso`);
    return true;
  } catch (error: unknown) {
    console.error(`[TelefonesService] Erro ao deletar telefone ID ${telefoneId}:`, error instanceof Error ? error.message : error);
    
    // Em ambiente de desenvolvimento, retornar resposta simulada
    if (process.env.NODE_ENV === 'development') {
      console.warn('[TelefonesService] Ambiente de desenvolvimento: simulando resposta positiva');
      return true;
    }
    
    throw error instanceof Error ? error : new Error(`Erro desconhecido ao deletar telefone ID ${telefoneId}`);
  }
};

// Buscar todos os telefones
export async function handleGetAllTelefones(): Promise<ServiceTelefone[]> {
  try {
    console.log('[TelefonesService] Buscando todos os telefones');
    
    // Verifica autenticação
    if (!isAuthenticated()) {
      console.error('[TelefonesService] Tentativa de buscar telefones sem autenticação');
      throw new Error('Usuário não autenticado');
    }
    
    const telefones = await getAllVisitasProfissionalTelefones();
    
    if (telefones === null) {
      console.warn('[TelefonesService] API retornou null ao buscar todos os telefones');
      return [];
    }
    
    // Adapta os resultados da API para o formato do serviço
    const serviceTelefones = telefones.map(t => adaptApiToServiceTelefone(t));
    
    console.log(`[TelefonesService] ${serviceTelefones.length} telefones encontrados`);
    return serviceTelefones;
  } catch (error: unknown) {
    console.error('[TelefonesService] Erro ao buscar todos os telefones:', error instanceof Error ? error.message : error);
    
    // Em ambiente de desenvolvimento, retornar resposta simulada
    if (process.env.NODE_ENV === 'development') {
      console.warn('[TelefonesService] Ambiente de desenvolvimento: retornando array vazio');
      return [];
    }
    
    return [];
  }
}

// Buscar telefone por ID
export async function handleGetTelefoneById(id: number): Promise<ServiceTelefone | null> {
  try {
    console.log(`[TelefonesService] Buscando telefone ID ${id}`);
    
    // Verifica autenticação
    if (!isAuthenticated()) {
      console.error('[TelefonesService] Tentativa de buscar telefone por ID sem autenticação');
      throw new Error('Usuário não autenticado');
    }
    
    const apiTelefone = await getVisitasProfissionalTelefoneById(id);
    
    if (!apiTelefone) {
      console.warn(`[TelefonesService] Telefone ID ${id} não encontrado`);
      return null;
    }
    
    // Adapta o resultado da API para o formato do serviço
    const serviceTelefone = adaptApiToServiceTelefone(apiTelefone);
    
    console.log(`[TelefonesService] Telefone ID ${id} encontrado:`, serviceTelefone);
    return serviceTelefone;
  } catch (error: unknown) {
    console.error(`[TelefonesService] Erro ao buscar telefone ID ${id}:`, error instanceof Error ? error.message : error);
    
    // Em ambiente de desenvolvimento, retornar resposta simulada
    if (process.env.NODE_ENV === 'development') {
      console.warn('[TelefonesService] Ambiente de desenvolvimento: retornando null');
      return null;
    }
    
    return null;
  }
}

// Formatador de telefone para exibição
export function formatTelefone(telefone: string): string {
  // Remove tudo o que não for dígito
  const digits = telefone.replace(/\D/g, '');
  
  if (digits.length === 11) {
    // Formato para celular: (99) 99999-9999
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`;
  } else if (digits.length === 10) {
    // Formato para telefone fixo: (99) 9999-9999
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}`;
  }
  
  // Retorna o valor original se não conseguir formatar
  return telefone;
}
