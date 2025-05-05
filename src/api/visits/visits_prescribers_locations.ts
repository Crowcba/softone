export interface VisitasProfissionalLocal {
  id: number;
  idProfissional: number;
  idOrigemDestino: number;
  idUsuario: string;
  dataHora: string;
  status?: boolean;
}

export interface CreateVisitasProfissionalLocal {
  idProfissional: number;
  idOrigemDestinoOrigemDestino: number;
  idUsuario: string;
}

export interface UpdateVisitasProfissionalLocal {
  id: number;
  idProfissional: number;
  idOrigemDestinoOrigemDestino: number;
  idUsuario: string;
} 