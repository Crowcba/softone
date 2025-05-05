'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import { isUserAuthenticated } from '@/utils/auth';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Componente para proteger rotas que requerem autenticação
 * Redireciona para a página de login se o usuário não estiver autenticado
 */
export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar autenticação
    const authenticated = isUserAuthenticated();

    if (!authenticated) {
      // Redirecionar para login com parâmetro para mostrar alerta
      router.push('/login?unauthorized=true');
      return;
    }

    setIsAuthenticated(true);
    setIsLoading(false);
  }, [router]);

  // Mostrar um estado de carregamento enquanto verifica autenticação
  if (isLoading) {
    return fallback || <div>Carregando...</div>;
  }

  // Se autenticado, mostrar o conteúdo da página
  return isAuthenticated ? <>{children}</> : null;
} 