export interface VisitasRota {
  id: number;
  idOrigem?: number;
  idDestino?: number;
  km?: number;
  data?: string; // formato ISO 8601 (yyyy-MM-ddTHH:mm:ss)
  idUsuario?: string;
  ativo?: boolean;
  idAgenda?: number;
}

export interface VisitasRotaCompletoDTO {
  // Visitas Rotas
  id: number;
  idOrigem?: number;
  idDestino?: number;
  km?: number;
  data?: string; // formato ISO 8601
  idUsuario?: string;
  ativo?: boolean;
  idAgenda?: number;

  // Visitas Agenda
  agendaId: number;
  idPrescritor?: number;
  idEndereco?: number;
  agendaIdUsuario?: string;
  agendaData?: string; // formato ISO 8601
  descricao?: string;
  produto?: string;
  agendaAtivo?: boolean;
  agendaStatus?: string;
  periodo?: string;

  // Visitas Origem Destino
  idOrigemDestino?: number;
  localDeAtendimentoOrigemDestino?: string;
  enderecoOrigemDestino?: string;
  bairroOrigemDestino?: string;
  cidadeOrigemDestino?: string;
  ufOrigemDestino?: string;
  cepOrigemDestino?: string;
  telefoneOrigemDestino?: string;
  numeroOrigemDestino?: string;
  origemDestinoStatus?: string;

  // Visitas Profissional
  idProfissional?: number;
  nomeProfissional?: string;
  sexoProfissional?: string;
  dataNascimentoProfissional?: string; // formato ISO 8601
  profissaoProfissional?: string;
  especialidadeProfissional?: string;
  conselhoProfissional?: string;
  numeroConselhoProfissional?: string;
  emailProfissional?: string;
  idPromotor?: number;
  idConselho?: number;
  idEstadoConselho?: number;
  profissionalStatus?: string;
  frequenciaVisita?: string;
  tipoVisita?: string;

  // AspNetUsers
  nomeUsuario?: string;
}

export interface VisitasRotaResponse {
  success: boolean;
  data: VisitasRotaCompletoDTO[];
  message?: string;
}

export interface VisitasRotaCreate {
  idOrigem?: number;
  idDestino?: number;
  km?: number;
  data: string;
  idUsuario?: string;
  ativo?: boolean;
  idAgenda?: number;
}

export interface VisitasRotaUpdate extends VisitasRotaCreate {
  id: number;
}
