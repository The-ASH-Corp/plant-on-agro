import { apiClient } from '../api/api-client';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '@/types/api';
import { User, RegisterPayload, LoginPayload } from '@/types/auth';


export const authService = {

  async register(payload: RegisterPayload): Promise<ApiResponse<User>> {
    return apiClient.post<User>(API_ENDPOINTS.AUTH.REGISTER, payload);
  },


  async login(payload: LoginPayload): Promise<ApiResponse<User>> {
    return apiClient.post<User>(API_ENDPOINTS.AUTH.LOGIN, payload);
  },

  
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  },
};
