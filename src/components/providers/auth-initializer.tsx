'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * AuthInitializer - Sincroniza o estado de autenticação quando a app carrega
 * Zustand persist já restaura o estado do localStorage automaticamente,
 * mas isso garante a sincronização com o estado de cookies no backend
 */
export function AuthInitializer() {
  useEffect(() => {
    // Zustand persist já restaura o estado do localStorage
    // Esse componente serve principalmente para garantir sincronização
    // quando há alterações no estado de autenticação

    // A autenticação é validada através de:
    // 1. Middleware Next.js (verifica cookies)
    // 2. Zustand persist (restaura do localStorage)
    // 3. API withCredentials (envia cookies automaticamente)

    const state = useAuthStore.getState();

    if (!state.user && state.isAuthenticated) {
      // Se houver inconsistência, resetar estado
      useAuthStore.setState({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    }
  }, []);

  // Don't render anything, just handle initialization
  return null;
}
