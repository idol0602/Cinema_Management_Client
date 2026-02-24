'use client';

import { useEffect } from 'react';
import { socketService } from '@/lib/socket';
import { useAuthStore } from '@/store/useAuthStore';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      socketService.connect();
    } else {
      socketService.disconnect();
    }

    return () => {
      // We don't necessarily disconnect on unmount of the provider since it's at the root
      // but we could if we wanted to cleanly tear down.
    };
  }, [isAuthenticated]);

  return <>{children}</>;
}
