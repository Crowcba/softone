'use client';

import { useAuth } from '@/hooks/useAuth';
import { useCSRF } from '@/hooks/useCSRF';
import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading, checkAuth } = useAuth();
  
  // Inicializa a proteção CSRF
  useCSRF();

  if (isLoading || !checkAuth()) {
    return null;
  }

  return <>{children}</>;
}
