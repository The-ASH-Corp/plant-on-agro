export type UserRole = 'admin' | 'buyer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'buyer';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  successMessage: string | null;
  hasHydrated: boolean;

  // Actions
  register: (payload: RegisterPayload) => Promise<{ success: boolean; data?: User; error?: string }>;
  login: (payload: LoginPayload) => Promise<{ success: boolean; data?: User; error?: string }>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearError: () => void;
  clearSuccess: () => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}
