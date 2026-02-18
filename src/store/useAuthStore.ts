import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User } from '@/types/user.type';
import type { AuthContextType} from '@/types/auth.type';
import { authService } from '@/services/auth.service';

interface AuthStore extends AuthContextType {
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.login({email, password});
            if (response.error) {
              set({ error: response.error, isLoading: false });
              throw new Error(response.error);
            }
            if (response.data) {
              set({ user: response.data.user as User, isAuthenticated: true, isLoading: false, error: null });
            }
          } catch (error: any) {
            set({ isLoading: false, error: error.message });
            throw error;
          }
        },
        logout: async () => {
          await authService.logout();
          set({ user: null, isAuthenticated: false, error: null });
        },
        updateProfile: async (updatedUser: User) => {
          if (!updatedUser.id) {
            throw new Error('User ID is required');
          }
          await authService.updateProfile(updatedUser.id, updatedUser);
          set({ user: updatedUser });
        },
        setError: (error: string | null) => {
          set({ error });
        },
      }),
      {
        name: 'auth-storage',
      }
    )
  )
);
