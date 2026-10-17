import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, RegisterPayload, LoginPayload, User } from '@/types/auth';
import { authService } from '@/services/auth/auth.service';
import { setAuthHeaderToken } from '@/services/api/api-client';
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
          const authData = response.data;
          const userData = (authData?.user || authData) as User;
          const token = authData?.token || null;

          set({
            user: userData,
            token: token,
            isAuthenticated: true,
            isLoading: false,
            successMessage: response.message || 'Account created successfully!',
            error: null,
            fieldErrors: {},
          });

          setAuthHeaderToken(token);

          return { success: true, data: userData, token: token || undefined };
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
          const authData = response.data;
          const userData = (authData?.user || authData) as User;
          const token = authData?.token || null;

          set({
            user: userData,
            token: token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            fieldErrors: {},
            successMessage: 'Logged in successfully',
          });

          setAuthHeaderToken(token);

          return { success: true, data: userData, token: token || undefined };
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

      setToken: (token: string | null) => {
        set({
          token,
          isAuthenticated: !!token,
        });
        setAuthHeaderToken(token);
      },

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
        setAuthHeaderToken(null);
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
        if (state?.token) {
          setAuthHeaderToken(state.token);
        }
      },
    }
  )
);


if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    useAuthStore.getState().logout();
  });
}
