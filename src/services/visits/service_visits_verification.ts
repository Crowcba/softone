/**
 * service_visits_verification.ts
 * Serviço para verificação e cache de agendas e vínculos
 */

import { api } from "../../config/api";
import { handleGetLinksByProfessionalId } from "./service_visits_address_professional_links";
import { getAgendaService } from "./service_agenda";

// Interface para agendas armazenadas em cache
interface CachedAgenda {
  id: number | string;
  idPrescritor: number;
  idEndereco: number;
  data: string;
  periodo: number;
  descricao?: string;
  tipo?: number;
  status: number;
  salvaNaApi: boolean;
  dataCriacao: string;
  erro?: string;
}

// Verificar se existe vínculo entre profissional e local
export async function verificarVinculoProfissionalLocal(idProfissional: number, idLocal: number): Promise<boolean> {
  try {
    console.log(`[Verificação] Verificando vínculo entre profissional ${idProfissional} e local ${idLocal}`);
    
    // Buscar vínculos do profissional
    const vinculos = await handleGetLinksByProfessionalId(idProfissional);
    
    // Verificar se algum vínculo corresponde ao local
    const vinculoExiste = vinculos.some(vinculo => vinculo.idOrigemDestinoOrigemDestino === idLocal);
    
    console.log(`[Verificação] Vínculo entre profissional ${idProfissional} e local ${idLocal}: ${vinculoExiste ? 'Existe' : 'Não existe'}`);
    
    return vinculoExiste;
  } catch (error) {
    console.error('[Verificação] Erro ao verificar vínculo:', error);
    // Em caso de erro, retornar false para ser mais seguro
    return false;
  }
}

// Criar vínculo entre profissional e local
export async function criarVinculo(idProfissional: number, idLocal: number, idUsuario: string): Promise<boolean> {
  try {
    console.log(`[Verificação] Criando vínculo entre profissional ${idProfissional} e local ${idLocal}`);
    
    // Verificar se já existe o vínculo
    const vinculoExiste = await verificarVinculoProfissionalLocal(idProfissional, idLocal);
    
    if (vinculoExiste) {
      console.log('[Verificação] Vínculo já existe, não é necessário criar');
      return true;
    }
    
    // Criar o vínculo
    const response = await api.post('/api/VisitasVinculoEnderecoProfissional', {
      id_profissional: idProfissional,
      id_origem_destino_origem_destino: idLocal,
      id_usuario: idUsuario
    });
    
    console.log('[Verificação] Vínculo criado com sucesso:', response.data);
    return true;
  } catch (error) {
    console.error('[Verificação] Erro ao criar vínculo:', error);
    return false;
  }
}

// Salvar agenda com cache local
export async function salvarAgendaComCache(dadosAgenda: any): Promise<{ success: boolean; message: string; id?: number }> {
  try {
    console.log('[Verificação] Salvando agenda com cache:', dadosAgenda);
    
    // Tentar salvar na API
    const agendaService = await getAgendaService();
    const response = await agendaService.createVisitaAgenda(dadosAgenda);
    
    // Se chegou aqui, foi salvo com sucesso na API
    console.log('[Verificação] Agenda salva na API com sucesso:', response);
    
    // Adicionar ao cache local para redundância
    const agendasLocais = getAgendasDoCache();
    
    const agendaComId = {
      id: response.id || `local_${Date.now()}`,
      idPrescritor: dadosAgenda.idPrescritor,
      idEndereco: dadosAgenda.idEndereco,
      data: dadosAgenda.data,
      periodo: dadosAgenda.periodo,
      descricao: dadosAgenda.descricao,
      tipo: dadosAgenda.tipo,
      status: dadosAgenda.status || 1,
      salvaNaApi: true,
      dataCriacao: new Date().toISOString()
    };
    
    agendasLocais.push(agendaComId);
    salvarAgendasNoCache(agendasLocais);
    
    return { 
      success: true, 
      message: 'Agenda salva com sucesso na API e em cache local',
      id: response.id
    };
  } catch (error: any) {
    console.error('[Verificação] Erro ao salvar na API:', error);
    
    // Salvar apenas localmente com flag
    const agendasLocais = getAgendasDoCache();
    
    const agendaLocal: CachedAgenda = {
      id: `local_${Date.now()}`,
      idPrescritor: dadosAgenda.idPrescritor,
      idEndereco: dadosAgenda.idEndereco,
      data: dadosAgenda.data,
      periodo: dadosAgenda.periodo,
      descricao: dadosAgenda.descricao,
      tipo: dadosAgenda.tipo,
      status: dadosAgenda.status || 1,
      salvaNaApi: false,
      dataCriacao: new Date().toISOString(),
      erro: error.message || 'Erro desconhecido'
    };
    
    agendasLocais.push(agendaLocal);
    salvarAgendasNoCache(agendasLocais);
    
    return { 
      success: false, 
      message: 'Agenda salva apenas localmente. Será sincronizada quando possível.' 
    };
  }
}

// Verificar se agenda foi realmente salva tentando buscar da API
export async function verificarAgendaSalva(id: number): Promise<boolean> {
  try {
    console.log(`[Verificação] Verificando se agenda ${id} foi salva`);
    
    // Tentar buscar a agenda pelo ID
    const agendaService = await getAgendaService();
    const agenda = await agendaService.getVisitaAgendaById(id);
    
    return !!agenda && !!agenda.id;
  } catch (error) {
    console.error(`[Verificação] Erro ao verificar agenda ${id}:`, error);
    return false;
  }
}

// Obter agendas do cache local
export function getAgendasDoCache(): CachedAgenda[] {
  try {
    const agendasJson = localStorage.getItem('agendasPendentes');
    return agendasJson ? JSON.parse(agendasJson) : [];
  } catch (error) {
    console.error('[Verificação] Erro ao obter agendas do cache:', error);
    return [];
  }
}

// Salvar agendas no cache local
export function salvarAgendasNoCache(agendas: CachedAgenda[]): void {
  try {
    localStorage.setItem('agendasPendentes', JSON.stringify(agendas));
  } catch (error) {
    console.error('[Verificação] Erro ao salvar agendas no cache:', error);
  }
}

// Sincronizar agendas pendentes
export async function sincronizarAgendasPendentes(): Promise<{ success: number; failed: number }> {
  const agendas = getAgendasDoCache();
  const agendasPendentes = agendas.filter(a => !a.salvaNaApi);
  
  if (agendasPendentes.length === 0) {
    return { success: 0, failed: 0 };
  }
  
  console.log(`[Verificação] Sincronizando ${agendasPendentes.length} agendas pendentes`);
  
  let success = 0;
  let failed = 0;
  const agendaService = await getAgendaService();
  
  for (const agenda of agendasPendentes) {
    try {
      // Converter para o formato esperado pela API
      const dadosAgenda = {
        idPrescritor: agenda.idPrescritor,
        idEndereco: agenda.idEndereco,
        data: agenda.data,
        periodo: agenda.periodo,
        descricao: agenda.descricao || '',
        tipo: agenda.tipo || 1,
        status: agenda.status || 1
      };
      
      // Tentar salvar na API
      await agendaService.createVisitaAgenda(dadosAgenda);
      
      // Marcar como salva na API
      const index = agendas.findIndex(a => a.id === agenda.id);
      if (index >= 0) {
        agendas[index].salvaNaApi = true;
        agendas[index].erro = undefined;
      }
      
      success++;
    } catch (error) {
      console.error(`[Verificação] Erro ao sincronizar agenda ${agenda.id}:`, error);
      failed++;
    }
  }
  
  // Atualizar cache local
  salvarAgendasNoCache(agendas);
  
  return { success, failed };
} 