import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface PrescriberList {
  id: number;
  idPrescritor: number;
  idLista: number;
}

export interface CreatePrescriberListPayload {
  idPrescritor: number;
  idLista: number;
}

export interface UpdatePrescriberListPayload {
  idPrescritor: number;
  idLista: number;
}

export async function getPrescriberLists(): Promise<PrescriberList[]> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return [];
    }
    
    const response = await axios.get(`${apiUrl}/api/VisitasPrescritoresListum`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Erro silencioso sem log
    }
    return [];
  }
}

export async function createPrescriberList(payload: CreatePrescriberListPayload): Promise<PrescriberList | null> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return null;
    }
    
    const response = await axios.post(`${apiUrl}/api/VisitasPrescritoresListum`, payload, {
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

export async function getPrescriberListById(id: number): Promise<PrescriberList | null> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return null;
    }
    
    const response = await axios.get(`${apiUrl}/api/VisitasPrescritoresListum/${id}`, {
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

export async function updatePrescriberList(id: number, payload: UpdatePrescriberListPayload): Promise<boolean> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return false;
    }
    
    await axios.put(`${apiUrl}/api/VisitasPrescritoresListum/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Erro silencioso sem log
    }
    return false;
  }
}

export async function deletePrescriberList(id: number): Promise<boolean> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return false;
    }
    
    await axios.delete(`${apiUrl}/api/VisitasPrescritoresListum/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Erro silencioso sem log
    }
    return false;
  }
}

export async function getPrescribersByListId(idLista: number): Promise<PrescriberList[]> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return [];
    }
    
    const response = await axios.get(`${apiUrl}/api/VisitasPrescritoresListum/lista/${idLista}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Erro silencioso sem log
    }
    return [];
  }
}

export async function getPrescribersByPrescriberId(idPrescritor: number): Promise<PrescriberList[]> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return [];
    }
    
    const response = await axios.get(`${apiUrl}/api/VisitasPrescritoresListum/prescritor/${idPrescritor}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Erro silencioso sem log
    }
    return [];
  }
}
