import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface UserInfo {
  id: string;
  userName: string;
  passwordHash: string;
  admissao: string;
  nome: string;
}

export async function getUserInfo(userName: string): Promise<UserInfo | null> {
  try {
    const token = Cookies.get('token'); // Extraindo o token dos cookies
    
    if (!token) {
      return null;
    }
    
    const url = `${apiUrl}/api/AspNetUsers/infoUsuario/${userName}`;
    
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data;
  } catch (error: unknown) {
    return null; // Retorna null em caso de erro
  }
}
