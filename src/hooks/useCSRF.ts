import { useEffect } from 'react';
import { generateCSRFToken, setCSRFToken, setupAxiosCSRF } from '@/utils/csrf';
import axios from 'axios';

export const useCSRF = () => {
  useEffect(() => {
    // Gera um novo token CSRF quando o componente é montado
    const token = generateCSRFToken();
    setCSRFToken(token);

    // Configura o interceptor do Axios para incluir o token CSRF em todas as requisições
    setupAxiosCSRF(axios);

    // Cleanup function
    return () => {
      // Remove o interceptor quando o componente é desmontado
      axios.interceptors.request.clear();
    };
  }, []);
}; 