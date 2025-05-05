// Interface que representa o modelo usado na API
export interface ApiTelefone {
  id?: number;
  idProfissional: number;
  numeroTelefone: string;
  deletado?: boolean;
}

// Define a interface para o modelo de telefone usado no serviço
export interface ServiceTelefone {
  idTelefone: number;
  idProfissional?: number;
  telefone?: string;
  whatsapp?: boolean;
  principal?: boolean;
  nomeDaSecretariaTelefone?: string | null;
  deletado?: boolean;
}

// Interface que representa o modelo de profissional usado na API
export interface ApiProfissional {
  id?: number;
  nome: string;
  crm?: string;
  especialidade?: string;
  deletado?: boolean;
}

// Define a interface para o modelo de profissional usado no serviço
export interface ServiceProfissional {
  id?: number;
  nome: string;
  crm?: string;
  especialidade?: string;
  deletado?: boolean;
}

// Interface que representa o modelo de vínculo endereço-profissional usado na API
export interface ApiAddressProfessionalLink {
  id?: number;
  idProfissional: number;
  idOrigemDestinoOrigemDestino: number;
  idUsuario?: string;
}

// Define a interface para o modelo de vínculo endereço-profissional usado no serviço
export interface ServiceAddressProfessionalLink {
  id?: number;
  idProfissional: number;
  idOrigemDestinoOrigemDestino: number;
  idUsuario?: string;
}

// Funções de adaptação entre modelos

/**
 * Adapta um telefone do modelo da API para o modelo do serviço
 */
export function adaptApiToServiceTelefone(apiModel: ApiTelefone): ServiceTelefone {
  return {
    idTelefone: apiModel.id || 0,
    idProfissional: apiModel.idProfissional,
    telefone: apiModel.numeroTelefone,
    deletado: apiModel.deletado || false,
    whatsapp: false, // Valor padrão
    principal: false, // Valor padrão
    nomeDaSecretariaTelefone: null // Valor padrão
  };
}

/**
 * Adapta um telefone do modelo do serviço para o modelo da API
 */
export function adaptServiceToApiTelefone(serviceModel: ServiceTelefone): ApiTelefone {
  return {
    id: serviceModel.idTelefone,
    idProfissional: serviceModel.idProfissional || 0,
    numeroTelefone: serviceModel.telefone || '',
    deletado: serviceModel.deletado
  };
}

/**
 * Adapta um profissional do modelo da API para o modelo do serviço
 */
export function adaptApiToServiceProfissional(apiModel: ApiProfissional): ServiceProfissional {
  return {
    id: apiModel.id,
    nome: apiModel.nome,
    crm: apiModel.crm,
    especialidade: apiModel.especialidade,
    deletado: apiModel.deletado || false
  };
}

/**
 * Adapta um profissional do modelo do serviço para o modelo da API
 */
export function adaptServiceToApiProfissional(serviceModel: ServiceProfissional): ApiProfissional {
  return {
    id: serviceModel.id,
    nome: serviceModel.nome,
    crm: serviceModel.crm,
    especialidade: serviceModel.especialidade,
    deletado: serviceModel.deletado
  };
}

/**
 * Adapta um vínculo endereço-profissional do modelo da API para o modelo do serviço
 */
export function adaptApiToServiceAddressProfessionalLink(apiModel: ApiAddressProfessionalLink): ServiceAddressProfessionalLink {
  return {
    id: apiModel.id,
    idProfissional: apiModel.idProfissional,
    idOrigemDestinoOrigemDestino: apiModel.idOrigemDestinoOrigemDestino,
    idUsuario: apiModel.idUsuario
  };
}

/**
 * Adapta um vínculo endereço-profissional do modelo do serviço para o modelo da API
 */
export function adaptServiceToApiAddressProfessionalLink(serviceModel: ServiceAddressProfessionalLink): ApiAddressProfessionalLink {
  return {
    id: serviceModel.id,
    idProfissional: serviceModel.idProfissional,
    idOrigemDestinoOrigemDestino: serviceModel.idOrigemDestinoOrigemDestino,
    idUsuario: serviceModel.idUsuario
  };
} 