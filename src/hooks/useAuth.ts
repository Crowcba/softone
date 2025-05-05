'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  const checkAuth = () => {
    // Verificar token no cookie
    const token = Cookies.get('token');
    
    // Verificar informações no sessionStorage
    // Usamos try/catch porque sessionStorage não está disponível durante SSR
    let empresaAtiva, infoUsuario;
    try {
      empresaAtiva = sessionStorage.getItem('empresa_ativa');
      infoUsuario = sessionStorage.getItem('info_usuario');
    } catch (error) {
      // Em SSR, sessionStorage não está disponível
      return false;
    }
    
    // O usuário está autenticado se tiver token e as informações no sessionStorage
    return !!(token && empresaAtiva && infoUsuario);
  };
  
  useEffect(() => {
    // Verificar autenticação
    const isAuthenticated = checkAuth();

    if (!isAuthenticated) {
      // Adicionar parâmetro para mostrar alerta
      router.push('/login?unauthorized=true');
      return;
    }

    setIsLoading(false);
  }, [router]);
  
  return { isLoading, checkAuth };
}
