import axios from 'axios';

export interface LoginResponse {
    id: string;
    userName: string;
    email?: string;
    token: string;
    companyId?: string;
    companyName?: string;
    roleId?: string;
    role?: string;
}

// Função para decodificar e verificar o token JWT (apenas para debugging)
function decodeJwt(token: string): { header: any, payload: any, isValid: boolean } {
    try {
        // Divide o token em suas 3 partes
        const parts = token.split('.');
        if (parts.length !== 3) {
            return { header: null, payload: null, isValid: false };
        }
        
        // Decodifica o header e payload (Base64URL para JSON)
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        
        // Verifica se o token está expirado
        const agora = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp && payload.exp < agora;
        
        return { header, payload, isValid: !isExpired };
    } catch (error) {
        return { header: null, payload: null, isValid: false };
    }
}

export async function apiLogin(username: string, password: string): Promise<{ token?: string }> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
        throw new Error('URL da API não configurada');
    }

    try {
        const loginUrl = `${apiUrl}/api/auth/login`;
        
        const response = await axios.post(loginUrl, { 
            Username: username, 
            Password: password 
        });
        
        if (response.data.token) {
            // Analisa o token JWT recebido silenciosamente
            decodeJwt(response.data.token);
        }
        
        return response.data;
    } catch (error) {
        throw error;
    }
}