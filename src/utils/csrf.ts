import { randomBytes } from 'crypto';
import Cookies from 'js-cookie';

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

// Configurações de segurança para o cookie CSRF
const CSRF_COOKIE_OPTIONS = {
  secure: true, // Apenas HTTPS
  sameSite: 'strict' as const, // Proteção contra CSRF
  path: '/',
  httpOnly: true
};

/**
 * Gera um novo token CSRF
 */
export const generateCSRFToken = (): string => {
  return randomBytes(32).toString('hex');
};

/**
 * Define o token CSRF no cookie
 */
export const setCSRFToken = (token: string): void => {
  Cookies.set(CSRF_COOKIE_NAME, token, CSRF_COOKIE_OPTIONS);
};

/**
 * Obtém o token CSRF do cookie
 */
export const getCSRFToken = (): string | undefined => {
  return Cookies.get(CSRF_COOKIE_NAME);
};

/**
 * Remove o token CSRF do cookie
 */
export const removeCSRFToken = (): void => {
  Cookies.remove(CSRF_COOKIE_NAME, CSRF_COOKIE_OPTIONS);
};

/**
 * Verifica se o token CSRF é válido
 */
export const validateCSRFToken = (token: string): boolean => {
  const storedToken = getCSRFToken();
  return !!storedToken && storedToken === token;
};

/**
 * Obtém o nome do header CSRF
 */
export const getCSRFHeaderName = (): string => {
  return CSRF_HEADER_NAME;
};

/**
 * Configura o token CSRF para uma requisição Axios
 */
export const setupAxiosCSRF = (axiosInstance: any): void => {
  axiosInstance.interceptors.request.use((config: any) => {
    const token = getCSRFToken();
    if (token) {
      config.headers[CSRF_HEADER_NAME] = token;
    }
    return config;
  });
}; 