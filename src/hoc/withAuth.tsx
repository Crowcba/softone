'use client';

import { ComponentType } from 'react';
import AuthGuard from '@/guards/AuthGuard';

/**
 * HOC para proteger componentes de página com autenticação
 * @param Component Componente a ser protegido
 * @param fallback Componente opcional a ser mostrado durante o carregamento
 * @returns Componente protegido que só será renderizado se o usuário estiver autenticado
 */
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function WithAuthComponent(props: P) {
    return (
      <AuthGuard fallback={fallback}>
        <Component {...props} />
      </AuthGuard>
    );
  };
} 