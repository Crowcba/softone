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
