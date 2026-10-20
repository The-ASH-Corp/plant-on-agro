import { apiClient } from '../api/api-client';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '@/types/api';
import { User, UserRole } from '@/types/auth';


export interface UsersListResult {
  items: User[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export const userService = {
  async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(API_ENDPOINTS.USERS.BY_ID(id));
  },

  async createUser(payload: { name: string; email: string; role?: UserRole }): Promise<ApiResponse<User>> {
    return apiClient.post<User>(API_ENDPOINTS.USERS.BASE, payload);
  },

  async listUsers(limit = 100, skip = 0): Promise<ApiResponse<UsersListResult>> {
    return apiClient.get<UsersListResult>(API_ENDPOINTS.USERS.BASE, {
      params: { limit, skip },
    });
  },

  async updateUser(
    id: string,
    payload: { name?: string; email?: string; role?: UserRole; isActive?: boolean }
  ): Promise<ApiResponse<User>> {
    return apiClient.put<User>(API_ENDPOINTS.USERS.BY_ID(id), payload);
  },

  async toggleBlockStatus(id: string, currentIsActive: boolean): Promise<ApiResponse<User>> {
    return apiClient.put<User>(API_ENDPOINTS.USERS.BY_ID(id), {
      isActive: !currentIsActive,
    });
  },
};

