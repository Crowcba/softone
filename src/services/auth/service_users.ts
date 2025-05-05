import axios from 'axios';
import { getAuthConfig } from '../../utils/auth';

interface AspNetUser {
    id: string;
    nome: string;
    email: string;
    // ... outros campos se necessário
}

export async function getUserById(id: string): Promise<AspNetUser | null> {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/AspNetUsers/${id}`,
            getAuthConfig()
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return null;
    }
} 