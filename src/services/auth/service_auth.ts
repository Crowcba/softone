import { LoginResponse } from '../../api/auth/auth';
import { saveUserInfo, clearUserInfo } from '../../app/mods/login/login';
import axios from 'axios';

// Permissões padrão para desenvolvimento
const DEFAULT_PERMISSIONS = {
    canViewDashboard: true,
    canManageVisits: true,
    canManageAgenda: true,
    canManagePrescribers: true,
    canManageLocations: true,
    canManageVehicles: true,
    canManageReports: true,
    canManageConfig: true,
    canManageUsers: true,
    canManageCompanies: true
};

export async function handleLogin(username: string, password: string): Promise<boolean> {
    try {
        const response = await axios.post<LoginResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, 
            {
                Username: username,
                Password: password
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                },
                withCredentials: true
            }
        );

        if (response.data && response.data.token) {
            // Salva as informações do usuário em cookies
            saveUserInfo({
                id: response.data.id,
                nome: response.data.userName,
                email: response.data.email || '',
                token: response.data.token,
                empresaId: response.data.companyId || 'default-company-id',
                empresaNome: response.data.companyName || 'Empresa Padrão',
                perfilId: response.data.roleId || 'default-role-id',
                perfilNome: response.data.role || 'Administrador'
            });

            // Salva as permissões padrão em localStorage para desenvolvimento
            if (process.env.NODE_ENV === 'development') {
                localStorage.setItem('userPermissions', JSON.stringify(DEFAULT_PERMISSIONS));
            }

            return true;
        }
        return false;
    } catch (error) {
        console.error('Erro no login:', error);
        if (axios.isAxiosError(error)) {
            console.error('Detalhes do erro:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
        }
        return false;
    }
}

// Função para verificar permissões
export function checkPermission(permission: keyof typeof DEFAULT_PERMISSIONS): boolean {
    if (process.env.NODE_ENV === 'development') {
        const permissions = JSON.parse(localStorage.getItem('userPermissions') || '{}');
        return permissions[permission] || false;
    }
    return false; // Em produção, retornar false por padrão
}

// Função para obter todas as permissões
export function getAllPermissions(): typeof DEFAULT_PERMISSIONS {
    if (process.env.NODE_ENV === 'development') {
        return JSON.parse(localStorage.getItem('userPermissions') || JSON.stringify(DEFAULT_PERMISSIONS));
    }
    return DEFAULT_PERMISSIONS;
}

export function logout(): void {
    clearUserInfo();
}

export function getEnvironmentMessage(): string | null {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return null;
    
    if (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')) {
        return 'Ambiente de Desenvolvimento';
    }
    
    if (apiUrl.includes('staging') || apiUrl.includes('homolog')) {
        return 'Ambiente de Homologação';
    }
    
    if (apiUrl.includes('test')) {
        return 'Ambiente de Testes';
    }
    
    return null;
}
