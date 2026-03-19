'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

/**
 * ProtectedRoute - Client-side route protection
 * Checks authentication state from Zustand store and redirects to login if needed
 * This avoids race condition issues with server-side middleware
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Only check after Zustand state is hydrated
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      // Redirect to login if not authenticated
      router.push('/auth/login');
      return;
    }

    // Check role if required
    if (requiredRole) {
      const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!user.role || !requiredRoles.includes(user.role)) {
        router.push('/');
        return;
      }
    }
  }, [user, isAuthenticated, isLoading, requiredRole, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Check role if required
  if (requiredRole) {
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!user.role || !requiredRoles.includes(user.role)) {
      return null;
    }
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
}
