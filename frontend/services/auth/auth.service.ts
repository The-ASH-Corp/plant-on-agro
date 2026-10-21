import { apiClient } from '../api/api-client';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '@/types/api';
import { User, RegisterPayload, LoginPayload, AuthResponse } from '@/types/auth';

export const authService = {
  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, payload);
  },

  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);
  },

  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  },

  async checkEmail(email: string): Promise<ApiResponse<{ exists: boolean; email: string }>> {
    return apiClient.post<{ exists: boolean; email: string }>(API_ENDPOINTS.AUTH.CHECK_EMAIL, { email });
  },
};

