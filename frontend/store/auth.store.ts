import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, RegisterPayload, LoginPayload, User } from '@/types/auth';
import { authService } from '@/services/auth/auth.service';
import { ApiError } from '@/types/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      fieldErrors: {},
      successMessage: null,
      hasHydrated: false,

      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),

   
      register: async (payload: RegisterPayload) => {
        set({
          isLoading: true,
          error: null,
          fieldErrors: {},
          successMessage: null,
        });

        try {
          const response = await authService.register(payload);
          const userData = response.data as User;

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            successMessage: response.message || 'Account created successfully!',
            error: null,
            fieldErrors: {},
          });

          return { success: true, data: userData };
        } catch (err: unknown) {
          const apiError = err as ApiError;
          const errorMessage = apiError.message || 'Registration failed. Please check your information.';
          const fieldErrors = apiError.fieldErrors || {};

          set({
            isLoading: false,
            error: errorMessage,
            fieldErrors,
            successMessage: null,
          });

          return { success: false, error: errorMessage };
        }
      },

     
      login: async (payload: LoginPayload) => {
        set({
          isLoading: true,
          error: null,
          fieldErrors: {},
          successMessage: null,
        });

        try {
          const response = await authService.login(payload);
          const userData = response.data as User;

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            fieldErrors: {},
            successMessage: 'Logged in successfully',
          });

          return { success: true, data: userData };
        } catch (err: unknown) {
          const apiError = err as ApiError;
          const errorMessage = apiError.message || 'Login failed. Invalid credentials.';

          set({
            isLoading: false,
            error: errorMessage,
            fieldErrors: apiError.fieldErrors || {},
            successMessage: null,
          });

          return { success: false, error: errorMessage };
        }
      },

      setUser: (user: User | null) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setToken: (token: string | null) =>
        set({
          token,
          isAuthenticated: !!token,
        }),

      clearError: () =>
        set({
          error: null,
          fieldErrors: {},
        }),

      clearSuccess: () =>
        set({
          successMessage: null,
        }),

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          fieldErrors: {},
          successMessage: null,
        });
      },
    }),
    {
      name: 'plant_on_agro_auth',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      // Only persist essential session data across sessions
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);


if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    useAuthStore.getState().logout();
  });
}
