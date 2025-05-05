import { handleLogin as apiLogin } from '@/services/auth/service_auth';
import { handleGetCompaniesByUserName } from '@/services/auth/companies';
import Cookies from 'js-cookie';
import { handleGetUserInfo } from '@/services/auth/service_usuaior';
import { getUserModulePermissions } from '@/api/modules/permission';

// Configurações de segurança para cookies
const COOKIE_OPTIONS = {
  secure: false, // Permitir HTTP
  sameSite: 'lax' as const, // Mais permissivo para desenvolvimento
  expires: 1, // 1 dia
  path: '/'
};

// Função para sanitizar stringsf
function sanitizeString(str: string): string {
  if (!str) return '';
  return str
    .replace(/[<>]/g, '') // Remove caracteres potencialmente perigosos
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// Função para sanitizar dados antes de armazenar
function sanitizeData(data: any): any {
  if (typeof data === 'string') {
    return sanitizeString(data);
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const key in data) {
      sanitized[key] = sanitizeData(data[key]);
    }
    return sanitized;
  }
  return data;
}

// Função para validar dados do usuário
function validateUserData(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  
  // Validação básica de campos obrigatórios
  const requiredFields = ['id', 'userName'];
  return requiredFields.every(field => 
    data[field] && typeof data[field] === 'string' && data[field].length > 0
  );
}

// Função simples para verificar se um token tem formato JWT válido
function isValidJwtFormat(token: string): boolean {
  if (!token) return false;
  
  // Verifica se o token segue o formato de três partes separadas por pontos
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }
  
  // Verifica se cada parte é um Base64 válido
  try {
    for (const part of parts.slice(0, 2)) { // Ignora a verificação da assinatura
      atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    }
    return true;
  } catch (e) {
    return false;
  }
}

// Interface para tipagem das informações do usuário
export interface UserInfo {
  id: string;
  nome: string;
  email: string;
  token: string;
  empresaId: string;
  empresaNome: string;
  perfilId: string;
  perfilNome: string;
}

// Constantes para os nomes dos cookies
export const COOKIE_NAMES = {
  USER_ID: 'user_id',
  USER_NAME: 'user_name',
  USER_EMAIL: 'user_email',
  TOKEN: 'token',
  COMPANY_ID: 'company_id',
  COMPANY_NAME: 'company_name',
  PROFILE_ID: 'profile_id',
  PROFILE_NAME: 'profile_name'
} as const;

// Função para salvar as informações do usuário em cookies separados
export function saveUserInfo(userInfo: UserInfo): void {
  // Define o tempo de expiração (por exemplo, 1 dia)
  const expires = 1;

  // Salva cada informação em um cookie separado
  Cookies.set(COOKIE_NAMES.USER_ID, userInfo.id, { expires });
  Cookies.set(COOKIE_NAMES.USER_NAME, userInfo.nome, { expires });
  Cookies.set(COOKIE_NAMES.USER_EMAIL, userInfo.email, { expires });
  Cookies.set(COOKIE_NAMES.TOKEN, userInfo.token, { expires });
  Cookies.set(COOKIE_NAMES.COMPANY_ID, userInfo.empresaId, { expires });
  Cookies.set(COOKIE_NAMES.COMPANY_NAME, userInfo.empresaNome, { expires });
  Cookies.set(COOKIE_NAMES.PROFILE_ID, userInfo.perfilId, { expires });
  Cookies.set(COOKIE_NAMES.PROFILE_NAME, userInfo.perfilNome, { expires });
}

// Função para recuperar todas as informações do usuário
export function getUserInfo(): UserInfo | null {
  const id = Cookies.get(COOKIE_NAMES.USER_ID);
  
  // Se não encontrar o ID, assume que não está logado
  if (!id) return null;

  return {
    id,
    nome: Cookies.get(COOKIE_NAMES.USER_NAME) || '',
    email: Cookies.get(COOKIE_NAMES.USER_EMAIL) || '',
    token: Cookies.get(COOKIE_NAMES.TOKEN) || '',
    empresaId: Cookies.get(COOKIE_NAMES.COMPANY_ID) || '',
    empresaNome: Cookies.get(COOKIE_NAMES.COMPANY_NAME) || '',
    perfilId: Cookies.get(COOKIE_NAMES.PROFILE_ID) || '',
    perfilNome: Cookies.get(COOKIE_NAMES.PROFILE_NAME) || ''
  };
}

// Função para limpar todos os cookies do usuário
export function clearUserInfo(): void {
  Object.values(COOKIE_NAMES).forEach(cookieName => {
    Cookies.remove(cookieName);
  });
}

// Funções auxiliares para obter informações específicas
export function getUserToken(): string | null {
  return Cookies.get(COOKIE_NAMES.TOKEN) || null;
}

export function getUserId(): string | null {
  return Cookies.get(COOKIE_NAMES.USER_ID) || null;
}

export function getCompanyId(): string | null {
  return Cookies.get(COOKIE_NAMES.COMPANY_ID) || null;
}

export function getUserName(): string | null {
  return Cookies.get(COOKIE_NAMES.USER_NAME) || null;
}

export function getProfileId(): string | null {
  return Cookies.get(COOKIE_NAMES.PROFILE_ID) || null;
}

// Função para verificar se o usuário está logado
export function isUserLoggedIn(): boolean {
  return !!getUserToken();
}

// Função para atualizar um dado específico do usuário
export function updateUserInfo(field: keyof UserInfo, value: string): void {
  const cookieName = COOKIE_NAMES[field.toUpperCase() as keyof typeof COOKIE_NAMES];
  if (cookieName) {
    Cookies.set(cookieName, value, { expires: 1 });
  }
}

export async function handleLogin(username: string, password: string): Promise<boolean> {
  // Sanitiza apenas o username, não a senha
  const sanitizedUsername = sanitizeString(username);
  
  // Validação básica dos inputs
  if (!sanitizedUsername || !password || 
      sanitizedUsername.length < 3 || password.length < 6) {
    Cookies.set("login_error", "Dados de login inválidos.", COOKIE_OPTIONS);
    clearUserInfo();
    sessionStorage.clear();
    localStorage.clear();
    if ('caches' in window) {
      caches.keys().then(function(names) {
        for (let name of names) caches.delete(name);
      });
    }
    return false;
  }
  
  try {
    // Usando a função importada
    const success = await apiLogin(sanitizedUsername, password);
    
    if (!success) {
      clearUserInfo();
      sessionStorage.clear();
      localStorage.clear();
      if ('caches' in window) {
        caches.keys().then(function(names) {
          for (let name of names) caches.delete(name);
        });
      }
      return false;
    }
    
    // Se chegou aqui, a autenticação foi bem-sucedida
    let token = localStorage.getItem('token');
    const cookieToken = Cookies.get('token');
    
    if (!token && cookieToken) {
      localStorage.setItem('token', cookieToken);
      token = cookieToken;
    }
    
    if (!token) {
      Cookies.set("login_error", "Falha na autenticação. Por favor, tente novamente.", COOKIE_OPTIONS);
      clearUserInfo();
      sessionStorage.clear();
      localStorage.clear();
      if ('caches' in window) {
        caches.keys().then(function(names) {
          for (let name of names) caches.delete(name);
        });
      }
      return false;
    }
    
    // Verifica se o formato do token parece válido
    if (!isValidJwtFormat(token)) {
      console.error('Token com formato inválido');
      Cookies.set("login_error", "Token inválido. Por favor, tente novamente.", COOKIE_OPTIONS);
      clearUserInfo();
      sessionStorage.clear();
      localStorage.clear();
      if ('caches' in window) {
        caches.keys().then(function(names) {
          for (let name of names) caches.delete(name);
        });
      }
      return false;
    }
    
    const userInfo = await handleGetUserInfo(sanitizedUsername);
    
    // Valida e sanitiza os dados do usuário antes de armazenar
    if (!validateUserData(userInfo)) {
      Cookies.set("login_error", "Dados do usuário inválidos.", COOKIE_OPTIONS);
      clearUserInfo();
      sessionStorage.clear();
      localStorage.clear();
      if ('caches' in window) {
        caches.keys().then(function(names) {
          for (let name of names) caches.delete(name);
        });
      }
      return false;
    }
    
    // Adiciona o nome do usuário ao objeto de informações
    const userInfoWithName = {
      ...userInfo,
      nome: userInfo?.nome || userInfo?.userName || sanitizedUsername
    };
    
    const sanitizedUserInfo = sanitizeData(userInfoWithName);

    // Remove o cookie info_usuario se existir
    Cookies.remove("info_usuario");
    
    // Salva as informações em cookies separados
    Cookies.set(COOKIE_NAMES.USER_ID, sanitizedUserInfo.id, COOKIE_OPTIONS);
    Cookies.set(COOKIE_NAMES.USER_NAME, sanitizedUserInfo.nome, COOKIE_OPTIONS);
    Cookies.set(COOKIE_NAMES.USER_EMAIL, sanitizedUserInfo.email || '', COOKIE_OPTIONS);
    Cookies.set(COOKIE_NAMES.TOKEN, token, COOKIE_OPTIONS);
    
    // Continua com o resto do fluxo...
    if (userInfo && userInfo.id) {
      try {
        const modulePermissions = await getUserModulePermissions(userInfo.id);
        
        // Verifica se modulePermissions é um array válido
        if (!Array.isArray(modulePermissions)) {
          console.error('Resposta de permissões inválida: não é um array');
          // Trata com array vazio para não quebrar o fluxo
          const emptyModules = [{
            id: 'visits',
            id_modulo: 'visits',
            nome: 'VISITAS',
            status: true
          }];
          
          Cookies.set("modulos_ativos", JSON.stringify(emptyModules), COOKIE_OPTIONS);
          Cookies.set("menu_items", JSON.stringify([{
            id: 'visits',
            name: 'VISITAS',
            path: '/visitas'
          }]), COOKIE_OPTIONS);
        } else {
          // Garante que os módulos ativos incluam o módulo VISITAS se necessário
          const activeModules = modulePermissions
            .filter(module => module && module.status === true)
            .map(({ id, id_modulo, nome }) => ({ 
              id: id || '', 
              id_modulo: id_modulo || '', 
              nome: sanitizeString(nome || '')
            }));

          // Adiciona o módulo VISITAS se não estiver presente
          const hasVisitasModule = activeModules.some(m => 
            m.nome && m.nome.toUpperCase() === 'VISITAS'
          );
          
          if (!hasVisitasModule) {
            // Adiciona o módulo VISITAS se não estiver na lista
            activeModules.push({
              id: 'visits',
              id_modulo: 'visits',
              nome: 'VISITAS'
            });
          }
          
          // Gera estrutura de menu a partir dos módulos ativos
          const menuItems = activeModules.map(({ id, id_modulo, nome }) => {
            const moduleName = nome?.toUpperCase();
            const moduleId = id || id_modulo || nome?.toLowerCase();
            
            // Converte nome para um path válido
            let path = '/';
            if (moduleName === 'VISITAS') {
              path = '/visitas';
            } else if (moduleName === 'VENDAS') {
              path = '/vendas';
            } else if (moduleName === 'CONFIGURAÇÃO') {
              path = '/config';
            } else {
              // Converte outros nomes para lowercase e remove acentos
              path = `/${nome?.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '_')}`;
            }
            
            return {
              id: moduleId,
              name: nome,
              path
            };
          });
          
          Cookies.set("modulos_ativos", JSON.stringify(activeModules), COOKIE_OPTIONS);
          Cookies.set("menu_items", JSON.stringify(menuItems), COOKIE_OPTIONS);
          sessionStorage.setItem("modulos_ativos", JSON.stringify(activeModules));
          sessionStorage.setItem("menu_items", JSON.stringify(menuItems));
        }
        
        // Busca as empresas do usuário
        const companiesResponse = await handleGetCompaniesByUserName(sanitizedUsername);
        
        if (!companiesResponse || !companiesResponse.data || companiesResponse.data.length === 0) {
          Cookies.set("login_error", "Nenhuma empresa encontrada para este usuário.", COOKIE_OPTIONS);
          clearUserInfo();
          sessionStorage.clear();
          localStorage.clear();
          if ('caches' in window) {
            caches.keys().then(function(names) {
              for (let name of names) caches.delete(name);
            });
          }
          return false;
        }
        
        // Formata as empresas e salva a primeira como ativa
        const companies = companiesResponse.data.map((company, index) => ({
          id: company.id || String(company.idEmpresa) || `company-${index}`,
          name: company.razaoSocial || company.nomeFantasia || company.fantasiaEmpresa || 'Empresa',
          logo: company.logo || company.logoEmpresa || ''
        }));
        
        const filteredCompanies = companies.filter(company => company.id && company.id.trim() !== '');
        
        if (filteredCompanies.length > 0) {
          const activeCompany = filteredCompanies[0];
          Cookies.set(COOKIE_NAMES.COMPANY_ID, activeCompany.id, COOKIE_OPTIONS);
          Cookies.set(COOKIE_NAMES.COMPANY_NAME, activeCompany.name, COOKIE_OPTIONS);
        }
        
        return true;
      } catch (error) {
        console.error('Erro ao buscar permissões de módulos:', error);
        Cookies.set("login_error", "Erro ao buscar permissões do usuário.", COOKIE_OPTIONS);
        clearUserInfo();
        sessionStorage.clear();
        localStorage.clear();
        if ('caches' in window) {
          caches.keys().then(function(names) {
            for (let name of names) caches.delete(name);
          });
        }
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro no processo de login:', error);
    Cookies.set("login_error", "Erro no login. Por favor, tente novamente.", COOKIE_OPTIONS);
    clearUserInfo();
    sessionStorage.clear();
    localStorage.clear();
    if ('caches' in window) {
      caches.keys().then(function(names) {
        for (let name of names) caches.delete(name);
      });
    }
    return false;
  }
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
}

export async function getUserCompanies(): Promise<Company[]> {
  try {
    const username = localStorage.getItem('username');
    
    if (!username) {
      return [];
    }
    
    // Verificação de tokens
    let token = localStorage.getItem('token');
    const cookieToken = Cookies.get('token');
    
    if (!token && cookieToken) {
      localStorage.setItem('token', cookieToken);
      token = cookieToken;
    }
    
    if (!token) {
      return [];
    }
    
    // Busca as empresas do usuário
    const companiesResponse = await handleGetCompaniesByUserName(username);
    
    if (!companiesResponse || !companiesResponse.data) {
      return [];
    }
    
    // Formata as empresas para o formato esperado
    const companies = companiesResponse.data.map((company, index) => ({
      id: company.id || String(company.idEmpresa) || `company-${index}`,
      name: company.razaoSocial || company.nomeFantasia || company.fantasiaEmpresa || 'Empresa',
      logo: company.logo || company.logoEmpresa || ''
    }));
    
    // Filtra qualquer empresa que ainda tenha ID vazio
    const filteredCompanies = companies.filter(company => company.id && company.id.trim() !== '');
    
    return filteredCompanies;
  } catch (error) {
    console.error('Erro ao buscar empresas do usuário:', error);
    return [];
  }
}

// Adicione a função no arquivo
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