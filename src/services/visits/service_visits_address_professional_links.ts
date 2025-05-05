import {
  getAllAddressProfessionalLinks,
  getAddressProfessionalLinkById,
  getLinksByProfessionalId,
  getLinksByAddressId,
  createAddressProfessionalLink,
  updateAddressProfessionalLink,
  deleteAddressProfessionalLink
} from '../../api/visits/visits_address_professional_links';
import { getAuthToken, isAuthenticated } from '../../utils/auth';
import { 
  ServiceAddressProfessionalLink, 
  ApiAddressProfessionalLink,
  adaptApiToServiceAddressProfessionalLink,
  adaptServiceToApiAddressProfessionalLink 
} from '../../types/visits';

// Log inicial para debug
console.log('[AddressProfessionalLinksService] Inicializando serviço de vínculos entre endereços e profissionais');
console.log('[AddressProfessionalLinksService] Autenticação disponível:', isAuthenticated());
if (isAuthenticated()) {
  console.log('[AddressProfessionalLinksService] Token (primeiros 10 caracteres):', 
    getAuthToken().substring(0, 10) + '...');
}

/**
 * Busca todos os vínculos entre endereços e profissionais
 * @returns Array de vínculos
 */
export async function handleGetAllLinks(): Promise<ServiceAddressProfessionalLink[]> {
  try {
    console.log('[AddressProfessionalLinksService] Buscando todos os vínculos');
    
    // Verifica autenticação
    if (!isAuthenticated()) {
      console.error('[AddressProfessionalLinksService] Tentativa de buscar vínculos sem autenticação');
      throw new Error('Usuário não autenticado');
    }
    
    const apiLinks = await getAllAddressProfessionalLinks();
    
    if (apiLinks === null) {
      console.warn('[AddressProfessionalLinksService] API retornou null ao buscar todos os vínculos');
      return [];
    }
    
    // Adapta os resultados da API para o formato do serviço
    const serviceLinks = apiLinks.map(link => adaptApiToServiceAddressProfessionalLink(link));
    
    console.log(`[AddressProfessionalLinksService] ${serviceLinks.length} vínculos encontrados`);
    return serviceLinks;
  } catch (error: unknown) {
    console.error('[AddressProfessionalLinksService] Erro ao buscar todos os vínculos:', 
      error instanceof Error ? error.message : error);
    
    // Em ambiente de desenvolvimento, retornar array vazio
    if (process.env.NODE_ENV === 'development') {
      console.warn('[AddressProfessionalLinksService] Ambiente de desenvolvimento: retornando array vazio');
      return [];
    }
    
    return [];
  }
}

/**
 * Busca um vínculo específico pelo ID
 * @param id ID do vínculo
 * @returns Objeto do vínculo ou null se não encontrado
 */
export async function handleGetLinkById(id: number): Promise<ServiceAddressProfessionalLink | null> {
  try {
    console.log(`[AddressProfessionalLinksService] Buscando vínculo ID ${id}`);
    
    // Verifica autenticação
    if (!isAuthenticated()) {
      console.error('[AddressProfessionalLinksService] Tentativa de buscar vínculo por ID sem autenticação');
      throw new Error('Usuário não autenticado');
    }
    
    const apiLink = await getAddressProfessionalLinkById(id);
    
    if (!apiLink) {
      console.warn(`[AddressProfessionalLinksService] Vínculo ID ${id} não encontrado`);
      return null;
    }
    
    // Adapta o resultado da API para o formato do serviço
    const serviceLink = adaptApiToServiceAddressProfessionalLink(apiLink);
    
    console.log(`[AddressProfessionalLinksService] Vínculo ID ${id} encontrado:`, serviceLink);
    return serviceLink;
  } catch (error: unknown) {
    console.error(`[AddressProfessionalLinksService] Erro ao buscar vínculo ID ${id}:`, 
      error instanceof Error ? error.message : error);
    
    // Em ambiente de desenvolvimento, retornar null
    if (process.env.NODE_ENV === 'development') {
      console.warn('[AddressProfessionalLinksService] Ambiente de desenvolvimento: retornando null');
      return null;
    }
    
    return null;
  }
}

/**
 * Busca vínculos por ID do profissional
 * @param idProfissional ID do profissional
 * @returns Array de vínculos
 */
export async function handleGetLinksByProfessionalId(idProfissional: number): Promise<ServiceAddressProfessionalLink[]> {
  try {
    console.log(`[AddressProfessionalLinksService] Buscando vínculos do profissional ID ${idProfissional}`);
    
    // Verifica autenticação
    if (!isAuthenticated()) {
      console.error('[AddressProfessionalLinksService] Tentativa de buscar vínculos por profissional sem autenticação');
      throw new Error('Usuário não autenticado');
    }
    
    const apiLinks = await getLinksByProfessionalId(idProfissional);
    
    if (apiLinks === null) {
      console.warn(`[AddressProfessionalLinksService] API retornou null ao buscar vínculos do profissional ID ${idProfissional}`);
      return [];
    }
    
    // Adapta os resultados da API para o formato do serviço
    const serviceLinks = apiLinks.map(link => adaptApiToServiceAddressProfessionalLink(link));
    
    console.log(`[AddressProfessionalLinksService] ${serviceLinks.length} vínculos encontrados para o profissional ID ${idProfissional}`);
    return serviceLinks;
  } catch (error: unknown) {
    console.error(`[AddressProfessionalLinksService] Erro ao buscar vínculos do profissional ID ${idProfissional}:`, 
      error instanceof Error ? error.message : error);
    
    // Em ambiente de desenvolvimento, retornar array vazio
    if (process.env.NODE_ENV === 'development') {
      console.warn('[AddressProfessionalLinksService] Ambiente de desenvolvimento: retornando array vazio');
      return [];
    }
    
    return [];
  }
}

/**
 * Busca vínculos por ID do endereço
 * @param idAddress ID do endereço
 * @returns Array de vínculos
 */
export async function handleGetLinksByAddressId(idAddress: number): Promise<ServiceAddressProfessionalLink[]> {
  try {
    console.log(`[AddressProfessionalLinksService] Buscando vínculos do endereço ID ${idAddress}`);
    
    // Verifica autenticação
    if (!isAuthenticated()) {
      console.error('[AddressProfessionalLinksService] Tentativa de buscar vínculos por endereço sem autenticação');
      throw new Error('Usuário não autenticado');
    }
    
    const apiLinks = await getLinksByAddressId(idAddress);
    
    if (apiLinks === null) {
      console.warn(`[AddressProfessionalLinksService] API retornou null ao buscar vínculos do endereço ID ${idAddress}`);
      return [];
    }
    
    // Adapta os resultados da API para o formato do serviço
    const serviceLinks = apiLinks.map(link => adaptApiToServiceAddressProfessionalLink(link));
    
    console.log(`[AddressProfessionalLinksService] ${serviceLinks.length} vínculos encontrados para o endereço ID ${idAddress}`);
    return serviceLinks;
  } catch (error: unknown) {
    console.error(`[AddressProfessionalLinksService] Erro ao buscar vínculos do endereço ID ${idAddress}:`, 
      error instanceof Error ? error.message : error);
    
    // Em ambiente de desenvolvimento, retornar array vazio
    if (process.env.NODE_ENV === 'development') {
      console.warn('[AddressProfessionalLinksService] Ambiente de desenvolvimento: retornando array vazio');
      return [];
    }
    
    return [];
  }
}

/**
 * Cria um novo vínculo entre endereço e profissional
 * @param link Dados do vínculo a ser criado
 * @returns Vínculo criado
 */
export async function handleCreateLink(link: ServiceAddressProfessionalLink): Promise<ServiceAddressProfessionalLink> {
  try {
    console.log('[AddressProfessionalLinksService] Criando vínculo:', link);
    
    // Verifica autenticação
    if (!isAuthenticated()) {
      console.error('[AddressProfessionalLinksService] Tentativa de criar vínculo sem autenticação');
      throw new Error('Usuário não autenticado');
    }
    
    // Adiciona o ID do usuário atual, se não estiver definido
    if (!link.idUsuario) {
      link.idUsuario = 'sistema'; // Ou obter do contexto de autenticação
    }
    
    // Adapta para o formato da API
    const apiLink = adaptServiceToApiAddressProfessionalLink(link);
    
    const createdApiLink = await createAddressProfessionalLink(apiLink);
    
    if (!createdApiLink) {
      throw new Error('Falha ao criar vínculo: Resposta nula da API');
    }
    
    // Adapta de volta para o formato do serviço
    const createdServiceLink = adaptApiToServiceAddressProfessionalLink(createdApiLink);
    
    console.log('[AddressProfessionalLinksService] Vínculo criado com sucesso:', createdServiceLink);
    return createdServiceLink;
  } catch (error: unknown) {
    console.error('[AddressProfessionalLinksService] Erro ao criar vínculo:', 
      error instanceof Error ? error.message : error);
    
    // Em ambiente de desenvolvimento, simular resposta de sucesso
    if (process.env.NODE_ENV === 'development') {
      console.warn('[AddressProfessionalLinksService] Ambiente de desenvolvimento: simulando resposta positiva');
      const mockId = Math.floor(Math.random() * 1000);
      return { ...link, id: mockId };
    }
    
    throw error instanceof Error ? error : new Error('Erro desconhecido ao criar vínculo');
  }
}

/**
 * Atualiza um vínculo existente
 * @param id ID do vínculo
 * @param link Dados atualizados do vínculo
 * @returns true se bem-sucedido
 */
export async function handleUpdateLink(id: number, link: ServiceAddressProfessionalLink): Promise<boolean> {
  try {
    console.log(`[AddressProfessionalLinksService] Atualizando vínculo ID ${id}:`, link);
    
    // Verifica autenticação
    if (!isAuthenticated()) {
      console.error('[AddressProfessionalLinksService] Tentativa de atualizar vínculo sem autenticação');
      throw new Error('Usuário não autenticado');
    }
    
    // Adiciona o ID do usuário atual, se não estiver definido
    if (!link.idUsuario) {
      link.idUsuario = 'sistema'; // Ou obter do contexto de autenticação
    }
    
    // Adapta para o formato da API
    const apiLink = adaptServiceToApiAddressProfessionalLink(link);
    
    const success = await updateAddressProfessionalLink(id, apiLink);
    
    if (!success) {
      throw new Error(`Falha ao atualizar vínculo ID ${id}`);
    }
    
    console.log(`[AddressProfessionalLinksService] Vínculo ID ${id} atualizado com sucesso`);
    return true;
  } catch (error: unknown) {
    console.error(`[AddressProfessionalLinksService] Erro ao atualizar vínculo ID ${id}:`, 
      error instanceof Error ? error.message : error);
    
    // Em ambiente de desenvolvimento, simular resposta de sucesso
    if (process.env.NODE_ENV === 'development') {
      console.warn('[AddressProfessionalLinksService] Ambiente de desenvolvimento: simulando resposta positiva');
      return true;
    }
    
    throw error instanceof Error ? error : new Error(`Erro desconhecido ao atualizar vínculo ID ${id}`);
  }
}

/**
 * Remove um vínculo existente
 * @param id ID do vínculo
 * @returns true se bem-sucedido
 */
export async function handleDeleteLink(id: number): Promise<boolean> {
  try {
    console.log(`[AddressProfessionalLinksService] Removendo vínculo ID ${id}`);
    
    // Verifica autenticação
    if (!isAuthenticated()) {
      console.error('[AddressProfessionalLinksService] Tentativa de remover vínculo sem autenticação');
      throw new Error('Usuário não autenticado');
    }
    
    const success = await deleteAddressProfessionalLink(id);
    
    if (!success) {
      throw new Error(`Falha ao remover vínculo ID ${id}`);
    }
    
    console.log(`[AddressProfessionalLinksService] Vínculo ID ${id} removido com sucesso`);
    return true;
  } catch (error: unknown) {
    console.error(`[AddressProfessionalLinksService] Erro ao remover vínculo ID ${id}:`, 
      error instanceof Error ? error.message : error);
    
    // Em ambiente de desenvolvimento, simular resposta de sucesso
    if (process.env.NODE_ENV === 'development') {
      console.warn('[AddressProfessionalLinksService] Ambiente de desenvolvimento: simulando resposta positiva');
      return true;
    }
    
    throw error instanceof Error ? error : new Error(`Erro desconhecido ao remover vínculo ID ${id}`);
  }
} 