import axios from 'axios';
import { getAuthToken } from '@/utils/auth';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface ModulePermission {
  id: number;
  id_usuario: string;
  id_modulo: number;
  status: boolean;
  nome: string;
}

export async function getUserModulePermissions(userId: string): Promise<ModulePermission[]> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return [];
    }
    
    // Log do cabeçalho da requisição
    console.log('Cabeçalhos da requisição:', { Authorization: `Bearer ${token}` });
    
    const response = await axios.get(`${apiUrl}/api/CadastroPermissao/usuario/${userId}`, {
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
