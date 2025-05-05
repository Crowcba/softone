import Cookies from 'js-cookie';
import https from 'https';
import axios from 'axios';

/**
 * Função centralizada para obter o token de autenticação de várias fontes possíveis
 * @returns O token de autenticação encontrado ou string vazia se não encontrado
 */
export function getAuthToken(): string {
  const cookieToken = Cookies.get('token');
  const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const sessionStorageToken = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
  
  // Usar o primeiro token disponível
  const token = cookieToken || localStorageToken || sessionStorageToken || '';
  
  if (!token) {
    console.warn('Token de autenticação não encontrado em nenhuma fonte');
  }
  
  return token;
}

/**
 * Verifica se há um token de autenticação disponível
 * @returns true se o token estiver disponível, false caso contrário
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Armazena o token em todas as formas de armazenamento para garantir disponibilidade
 * @param token O token a ser armazenado
 */
export function storeAuthToken(token: string): void {
  // Armazenar em cookie com validade de 7 dias
  Cookies.set('token', token, { expires: 7, path: '/' });
  
  // Armazenar também no localStorage para maior disponibilidade
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    sessionStorage.setItem('token', token);
  }
  
  console.log('Token de autenticação armazenado com sucesso');
}

/**
 * Remove o token de autenticação de todas as formas de armazenamento
 */
export function clearAuthToken(): void {
  Cookies.remove('token');
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }
  
  console.log('Token de autenticação removido com sucesso');
}

/**
 * Configura um interceptor global para o axios que adiciona o token a todas as requisições
 */
export function setupAxiosInterceptors(): void {
  axios.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      
      if (token) {
        // Certificar-se de que existe um objeto de headers
        config.headers = config.headers || {};
        
        // Adicionar o token de autorização
        config.headers['Authorization'] = `Bearer ${token}`;
        
        // Ignorar erros de certificado SSL em desenvolvimento
        config.httpsAgent = new https.Agent({ rejectUnauthorized: false });
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  console.log('Interceptors do axios configurados com sucesso');
}

/**
 * Retorna a configuração padrão para requisições autenticadas
 */
export const getAuthConfig = () => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Configurar interceptors automaticamente quando este módulo for importado
setupAxiosInterceptors();

// Log inicial para debug
console.log('=================================================');
console.log('Módulo de autenticação inicializado.');
console.log('Token disponível:', isAuthenticated());
if (isAuthenticated()) {
  console.log('Token (primeiros 10 caracteres):', getAuthToken().substring(0, 10) + '...');
}
console.log('=================================================');

/**
 * Verifica se o usuário está autenticado através dos cookies e sessionStorage
 * @returns boolean indicando se o usuário está autenticado
 */
export const isUserAuthenticated = (): boolean => {
  // Verificar token no cookie
  const token = Cookies.get('token');
  
  // Verificar informações no sessionStorage
  // Usamos try/catch porque sessionStorage não está disponível durante SSR
  let empresaAtiva, infoUsuario;
  try {
    empresaAtiva = sessionStorage.getItem('empresa_ativa');
    infoUsuario = sessionStorage.getItem('info_usuario');
  } catch {
    // Em SSR, sessionStorage não está disponível
    return false;
  }
  
  // O usuário está autenticado se tiver token e as informações no sessionStorage
  return !!(token && empresaAtiva && infoUsuario);
};

/**
 * Obtém as informações do usuário armazenadas no sessionStorage
 * @returns Objeto com as informações do usuário ou null se não estiver disponível
 */
export const getUserInfo = () => {
  try {
    const infoUsuarioStr = sessionStorage.getItem('info_usuario');
    if (infoUsuarioStr) {
      return JSON.parse(infoUsuarioStr);
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Obtém as informações da empresa ativa armazenada no sessionStorage
 * @returns Objeto com as informações da empresa ou null se não estiver disponível
 */
export const getEmpresaAtiva = () => {
  try {
    const empresaAtivaStr = sessionStorage.getItem('empresa_ativa');
    if (empresaAtivaStr) {
      return JSON.parse(empresaAtivaStr);
    }
    return null;
  } catch {
    return null;
  }
};

export const getUserInfoFromCookie = () => {
  try {
    const userInfoCookie = Cookies.get('info_usuario');
    if (!userInfoCookie) return null;
    
    // Decodificar o cookie
    const decodedCookie = decodeURIComponent(userInfoCookie);
    // Converter para objeto
    const userInfo = JSON.parse(decodedCookie);
    
    return userInfo;
  } catch (error) {
    console.error('Erro ao obter informações do usuário do cookie:', error);
    return null;
  }
}; 