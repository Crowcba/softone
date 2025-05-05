import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface VisitsVehicle {
  idVeiculo: number;
  idUsername: string;
  idUsuario: string;
  placaVeiculo: string;
  marcaModeloVeiculo: string;
  modeloVeiculo: string;
  corVeiculo: string;
  proprietarioVeiculo: string;
  ativo: boolean;
}

export interface CreateVisitsVehiclePayload {
  idUsername?: string;
  idUsuario?: string;
  placaVeiculo: string;
  marcaModeloVeiculo?: string;
  modeloVeiculo?: string;
  corVeiculo?: string;
  proprietarioVeiculo?: string;
  ativo?: boolean;
}

export interface UpdateVisitsVehiclePayload {
  idUsername?: string;
  idUsuario?: string;
  placaVeiculo: string;
  marcaModeloVeiculo?: string;
  modeloVeiculo?: string;
  corVeiculo?: string;
  proprietarioVeiculo?: string;
  ativo?: boolean;
}

export async function getVisitsVehicles(): Promise<VisitsVehicle[]> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return [];
    }
    
    const response = await axios.get(`${apiUrl}/api/VisitasVeiculo`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Erro silencioso sem log
    }
    return []; // Retorna array vazio em caso de erro
  }
}

export async function getVisitsVehiclesByUser(userId: string): Promise<VisitsVehicle[]> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return [];
    }
    
    const response = await axios.get(`${apiUrl}/api/VisitasVeiculo/usuario/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Erro silencioso sem log
    }
    return []; // Retorna array vazio em caso de erro
  }
}

export async function getVisitsVehicleById(id: number): Promise<VisitsVehicle | null> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return null;
    }
    
    const response = await axios.get(`${apiUrl}/api/VisitasVeiculo/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Erro silencioso sem log
    }
    return null; // Retorna null em caso de erro
  }
}

export async function createVisitsVehicle(payload: CreateVisitsVehiclePayload): Promise<VisitsVehicle | null> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return null;
    }
    
    const response = await axios.post(`${apiUrl}/api/VisitasVeiculo`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Erro silencioso sem log
    }
    return null; // Retorna null em caso de erro
  }
}

export async function updateVisitsVehicle(id: number, payload: UpdateVisitsVehiclePayload): Promise<VisitsVehicle | null> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return null;
    }
    
    const response = await axios.put(`${apiUrl}/api/VisitasVeiculo/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // A API retorna 204 No Content para atualizações bem-sucedidas
    if (response.status === 204) {
      // Como a API não retorna o objeto atualizado, precisamos buscá-lo
      return await getVisitsVehicleById(id);
    }
    
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Erro silencioso sem log
    }
    return null;
  }
}

export async function toggleVisitsVehicleStatus(id: number): Promise<VisitsVehicle | null> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return null;
    }
    
    const response = await axios.patch(`${apiUrl}/api/VisitasVeiculo/${id}/toggle-ativo`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Erro silencioso sem log
    }
    return null;
  }
}

export async function deleteVisitsVehicle(id: number): Promise<boolean> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return false;
    }
    
    const response = await axios.delete(`${apiUrl}/api/VisitasVeiculo/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.status === 204; // Retorna true se o status for 204 (No Content)
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Erro silencioso sem log
    }
    return false;
  }
}
