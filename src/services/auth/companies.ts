import { getCompaniesByUserName } from '@/api/auth/companies';
import { Company } from '@/api/auth/companies';

export interface CompanyResponse {
    data: Company[];
}

export async function handleGetCompaniesByUserName(userName: string): Promise<CompanyResponse | null> {
    try {
        const response = await getCompaniesByUserName(userName);
        return response;
    } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        return null;
    }
}