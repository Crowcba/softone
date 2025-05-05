import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface visitsLocation {
idOrigemDestino: number;
localDeAtendimentoOrigemDestino: string;
enderecoOrigemDestino: string;
bairroOrigemDestino: string;
cidadeOrigemDestino: string;
ufOrigemDestino: string;
cepOrigemDestino: string;
telefoneOrigemDestino: string;
numeroOrigemDestino: string | null;
status: boolean | null;
}

export interface CreateVisitsLocationPayload {
  localDeAtendimentoOrigemDestino: string;
  tipo?: string;
  enderecoOrigemDestino: string;
  complemento?: string;
  bairroOrigemDestino: string;
  cidadeOrigemDestino: string;
  ufOrigemDestino: string;
  cepOrigemDestino: string;
  telefoneOrigemDestino: string;
  numeroOrigemDestino: string;
  nomeContato?: string;
  email?: string;
  observacoes?: string;
  status: boolean;
}

export interface UpdateVisitsLocationPayload {
  idOrigemDestino: number;
  localDeAtendimentoOrigemDestino: string;
  enderecoOrigemDestino: string;
  bairroOrigemDestino: string;
  cidadeOrigemDestino: string;
  ufOrigemDestino: string;
  cepOrigemDestino: string;
  telefoneOrigemDestino: string;
  numeroOrigemDestino: string;
  status: boolean;
}

export async function getVisitsLocations(): Promise<visitsLocation[]> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return [];
    }
    
    const response = await axios.get(`${apiUrl}/api/VisitasOrigemDestino`, {
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

export async function createVisitsLocation(payload: CreateVisitsLocationPayload): Promise<visitsLocation | null> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return null;
    }
    
    const response = await axios.post(`${apiUrl}/api/VisitasOrigemDestino`, payload, {
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

export async function getVisitsLocationById(id: number): Promise<visitsLocation | null> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return null;
    }
    
    const response = await axios.get(`${apiUrl}/api/VisitasOrigemDestino/${id}`, {
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

export async function updateVisitsLocation(id: number, payload: UpdateVisitsLocationPayload): Promise<visitsLocation | null> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return null;
    }
    
    const response = await axios.put(`${apiUrl}/api/VisitasOrigemDestino/${id}`, payload, {
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

export async function updateVisitsLocationStatus(id: number, status: boolean): Promise<boolean> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return false;
    }

    // Faz a requisição PATCH no endpoint correto
    await axios.patch(
      `${apiUrl}/api/VisitasOrigemDestino/UpdateStatus/${id}`, 
      { status }, 
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    
    return true;
  } catch (error: unknown) {
    console.error('Erro ao atualizar status:', error);
    return false;
  }
}

// Função adicionada para compatibilidade com as importações existentes
export async function getAllVisitasOrigemDestino(): Promise<any[]> {
  try {
    // Reutiliza a lógica de getVisitsLocations, mas adapta para o formato que está sendo utilizado
    const locations = await getVisitsLocations();
    
    // Formato os dados para o formato esperado pelos componentes que usam esta função
    return locations.map(loc => ({
      id: loc.idOrigemDestino,
      descricao: loc.localDeAtendimentoOrigemDestino,
      codigo: loc.numeroOrigemDestino || '',
      endereco: loc.enderecoOrigemDestino,
      bairro: loc.bairroOrigemDestino,
      cidade: loc.cidadeOrigemDestino,
      uf: loc.ufOrigemDestino,
      cep: loc.cepOrigemDestino,
      telefone: loc.telefoneOrigemDestino,
      status: loc.status
    }));
  } catch (error) {
    console.error('Erro ao buscar locais de atendimento:', error);
    return [];
  }
}
