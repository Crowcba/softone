import axios from 'axios';
import { getAuthToken } from '../utils/auth';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(config => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // Erro do servidor
            console.error('Erro na resposta:', error.response.data);
        } else if (error.request) {
            // Erro na requisição
            console.error('Erro na requisição:', error.request);
        } else {
            // Outros erros
            console.error('Erro:', error.message);
        }
        return Promise.reject(error);
    }
); 