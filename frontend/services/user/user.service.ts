import { apiClient } from '../api/api-client';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/auth';


export const userService = {

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(API_ENDPOINTS.USERS.BY_ID(id));
  },

  async createUser(payload: { name: string; email: string; role?: string }): Promise<ApiResponse<User>> {
    return apiClient.post<User>(API_ENDPOINTS.USERS.BASE, payload);
  },

  async listUsers(limit = 10, skip = 0): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>(API_ENDPOINTS.USERS.BASE, {
      params: { limit, skip },
    });
  },
};
