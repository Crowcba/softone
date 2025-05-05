import axios from 'axios';
import { getAuthConfig, getUserInfoFromCookie } from '@/utils/auth';
import { 
  VisitasProfissionalLocal, 
  CreateVisitasProfissionalLocal, 
  UpdateVisitasProfissionalLocal 
} from '@/api/visits/visits_prescribers_locations';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const handleGetLinksByProfessionalId = async (idProfissional: number): Promise<VisitasProfissionalLocal[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/VisitasVinculoEnderecoProfissional/profissional/${idProfissional}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar vínculos do profissional:', error);
    if (process.env.NODE_ENV === 'development') {
      return [];
    }
    throw error;
  }
};

const getUserIdFromCookie = (): string => {
  try {
    const userInfo = getUserInfoFromCookie();
    return userInfo?.id || 'sistema';
  } catch (error) {
    console.error('Erro ao obter ID do usuário:', error);
    return 'sistema';
  }
};

export const handleCreateLink = async (data: CreateVisitasProfissionalLocal): Promise<VisitasProfissionalLocal> => {
  try {
    if (!data.idOrigemDestinoOrigemDestino) {
      throw new Error('ID do local de atendimento não fornecido');
    }

    console.log('Criando vínculo:', data);
    const response = await axios.post(
      `${API_BASE_URL}/api/VisitasVinculoEnderecoProfissional`,
      {
        idProfissional: data.idProfissional,
        idOrigemDestino: data.idOrigemDestinoOrigemDestino,
        idUsuario: getUserIdFromCookie()
      },
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao criar vínculo:', error);
    throw error;
  }
};

export const handleUpdateLink = async (id: number, data: UpdateVisitasProfissionalLocal): Promise<VisitasProfissionalLocal> => {
  try {
    console.log('Atualizando vínculo:', id, data);
    const response = await axios.put(
      `${API_BASE_URL}/api/VisitasVinculoEnderecoProfissional/${id}`,
      {
        id: id,
        idProfissional: data.idProfissional,
        idOrigemDestino: data.idOrigemDestinoOrigemDestino,
        idUsuario: data.idUsuario
      },
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar vínculo:', error);
    throw error;
  }
};

export const handleDeleteLink = async (id: number): Promise<void> => {
  try {
    await axios.delete(
      `${API_BASE_URL}/api/VisitasVinculoEnderecoProfissional/${id}`,
      getAuthConfig()
    );
  } catch (error) {
    console.error('Erro ao excluir vínculo:', error);
    throw error;
  }
}; 