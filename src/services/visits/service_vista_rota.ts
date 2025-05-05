import { VisitasRota, VisitasRotaCompletoDTO, VisitasRotaCreate, VisitasRotaUpdate, VisitasRotaResponse } from '@/api/visits/vista_rota';
import { getApiClient } from '@/services/api';

export interface RotaDados {
  idOrigem: number;
  idDestino: number;
  km: number;
  data: string;
  idUsuario: string;
  ativo: boolean;
  idAgenda: number;
}

export interface Rota {
  id: number;
  id_origem: number;
  id_destino: number;
  km: number;
  data: string;
  id_usuario: string;
  ativo: boolean;
  id_agenda: number;
}

export class VisitasRotaService {
  private baseUrl = '/api/VisitasRota';
  private api = getApiClient();
  private rotasEndpoint = '/api/VisitRotas';

  // Obter todas as rotas
  async getAll(): Promise<VisitasRotaCompletoDTO[]> {
    const response = await this.api.get<VisitasRotaCompletoDTO[]>(this.baseUrl);
    return response.data;
  }

  // Obter uma rota por ID
  async getById(id: number): Promise<VisitasRota> {
    const response = await this.api.get<VisitasRota>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Criar nova rota
  async createRota(data: RotaDados): Promise<VisitasRotaResponse> {
    console.log('Enviando dados para API:', data);
    
    // Mapeia as propriedades corretamente se necessário
    const createData: VisitasRotaCreate = {
      idOrigem: data.idOrigem,
      idDestino: data.idDestino,
      km: data.km,
      data: data.data,
      idUsuario: data.idUsuario,
      ativo: data.ativo,
      idAgenda: data.idAgenda
    };
    
    const response = await this.api.post<VisitasRotaResponse>(this.baseUrl, createData);
    return response.data;
  }

  // Atualizar rota
  async update(id: number, data: VisitasRotaUpdate): Promise<VisitasRotaResponse> {
    const response = await this.api.put<VisitasRotaResponse>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  // Excluir rota
  async delete(id: number): Promise<void> {
    await this.api.delete(`${this.baseUrl}/${id}`);
  }

  // Buscar rotas por ID de agendamento
  async getRotasByAgendaId(agendaId: number): Promise<VisitasRota[]> {
    try {
      // Primeiro tenta buscar usando um endpoint específico para filtrar por agendamento
      const response = await this.api.get<VisitasRota[]>(`${this.baseUrl}/agenda/${agendaId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar rotas para o agendamento ${agendaId} pelo endpoint específico:`, error);
      
      try {
        // Se o endpoint específico não existir, busca todas as rotas e filtra manualmente
        const allRoutes = await this.getAll();
        return allRoutes.filter(rota => rota.idAgenda === agendaId);
      } catch (secondError) {
        console.error(`Erro ao buscar todas as rotas para filtrar pelo agendamento ${agendaId}:`, secondError);
        return []; // Retorna array vazio em caso de falha
      }
    }
  }
}

export function getVisitasRotaService(): VisitasRotaService {
  return new VisitasRotaService();
}
