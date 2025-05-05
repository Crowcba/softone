import axios from 'axios';
import { getAuthToken } from '@/utils/auth';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface Company {
  idEmpresa: number;
  fantasiaEmpresa: string;
  logoEmpresa?: string;
  id?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  logo?: string;
}

export async function getCompaniesByUserName(userName: string): Promise<{data: Company[]}> {
    try {
        const token = getAuthToken();
        
        if (!token) {
            throw new Error('Token não encontrado');
        }
        
        const url = `${apiUrl}/api/CadastroAspnetusersEmpresas/ByUserName/${userName}`;
        
        const response = await axios.get(url, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            httpsAgent: new (require('https').Agent)({  
                rejectUnauthorized: false
            })
        });
        
        return {
            data: Array.isArray(response.data) ? response.data : []
        };
    } catch (error) {
        console.error('Erro ao buscar empresas do usuário:', error);
        return { data: [] };
    }
}