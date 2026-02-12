import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User } from '@/types/user.type';
import type { AuthContextType} from '@/types/auth.type';
import { authService } from '@/services/auth.service';

export const useAuthStore = create<AuthContextType>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: async (email: string, password: string) => {
          set({ isLoading: true });
          try {
            const response = await authService.login({email, password});
            if (response.data) {
              set({ user: response.data.user, isAuthenticated: true, isLoading: false });
            }
          } catch (error) {
            set({ isLoading: false });
          }
        },
        logout: () => {
          set({ user: null, isAuthenticated: false });
        },
        updateProfile: async (updatedUser: User) => {
          set({ user: updatedUser });
        },
      }),
      {
        name: 'auth-storage',
      }
    )
  )
);
