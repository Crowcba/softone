export interface VisitasAgenda {
  id: number;
  idPrescritor: number;
  idEndereco?: number;
  idUsuario?: string;
  data?: string;
  descricao?: string;
  produto?: number;
  ativo?: boolean;
  status: number;
  periodo?: number;
  tipo?: number;
}

export interface VisitasAgendaDetalhada {
  id: number;
  id_prescritor: number;
  id_endereco?: number;
  id_usuario?: string;
  data?: string;
  descricao?: string;
  produto?: number;
  ativo?: boolean;
  va_status: number;
  periodo?: number;
  tipo?: number;
  
  // Informações do Origem/Destino
  id_origem_destino?: number;
  local_de_atendimento_origem_destino?: string;
  endereco_origem_destino?: string;
  bairro_origem_destino?: string;
  cidade_origem_destino?: string;
  uf_origem_destino?: string;
  cep_origem_destino?: string;
  telefone_origem_destino?: string;
  numero_origem_destino?: string;
  vod_status?: boolean;
  
  // Informações do Profissional
  id_profissional?: number;
  nome_profissional?: string;
  sexo_profissional?: string;
  data_nascimento_profissional?: string;
  profissao_profissional?: string;
  especialidade_profissional?: string;
  Conselho_profissional?: string;
  numero_conselho_profissional?: string;
  email_profissional?: string;
  id_promotor?: string;
  id_conselho?: number | null;
  id_estado_conselho?: number | null;
  vp_status?: boolean;
  frequencia_visita?: string | null;
  tipo_visita?: string | null;
  
  // Informações do Usuário
  Nome?: string;
}

export interface VisitasAgendaResponse {
  data: VisitasAgenda[];
  total: number;
  page: number;
  limit: number;
}

export interface VisitasAgendaCreate {
  idPrescritor: number;
  idEndereco?: number;
  idUsuario?: string;
  data: string;
  descricao?: string;
  produto?: number;
  ativo?: boolean;
  status: number;
  periodo?: number;
  tipo?: number;
}

export interface VisitasAgendaUpdate extends VisitasAgendaCreate {
  id: number;
}

// Interface para o relatório de quilometragem por prescritor
export interface RelatorioKmPrescritor {
  id: number;
  id_origem: number;
  id_destino: number;
  km: number;
  rota_data: string;
  rota_id_usuario: string;
  rota_ativo: boolean;
  id_agenda: number;
  agenda_id: number;
  id_prescritor: number;
  id_endereco: number;
  id_usuario: string;
  data: string;
  descricao: string;
  produto: number;
  ativo: boolean;
  status_agenda: number;
  periodo: number;
  tipo: number | null;
  id_profissional: number | null;
  nome_profissional: string | null;
  sexo_profissional: string | null;
  data_nascimento_profissional: string | null;
  profissao_profissional: string | null;
  especialidade_profissional: string | null;
  Conselho_profissional: string | null;
  numero_conselho_profissional: string | null;
  email_profissional: string | null;
  id_promotor: number | null;
  id_conselho: number | null;
  id_estado_conselho: number | null;
  status_profissional: number | null;
  frequencia_visita: number | null;
  tipo_visita: number | null;
}
