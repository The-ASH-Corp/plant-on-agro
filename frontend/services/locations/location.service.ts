import { apiClient } from '../api/api-client';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '@/types/api';
import { PlantationLocationItem } from '@/components/admin/types';

export interface BackendLocation {
  id: string;
  name: string;
  region: string;
  gps: string;
  areaHectares: number;
  capacity: number;
  treesPlanted: number;
  survivalRate: string;
  ndviScore: number;
  soilHealth: string;
  image: string;
  status: 'Active' | 'Expanding' | 'Full';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LocationsListResponse {
  items: BackendLocation[];
  total: number;
  limit: number;
  skip: number;
}

export interface CreateLocationPayload {
  name: string;
  region: string;
  gps: string;
  areaHectares: number;
  capacity: number;
  treesPlanted?: number;
  survivalRate?: string;
  ndviScore?: number;
  soilHealth?: string;
  image?: string;
  status?: 'Active' | 'Expanding' | 'Full';
}

export interface UpdateLocationPayload {
  name?: string;
  region?: string;
  gps?: string;
  areaHectares?: number;
  capacity?: number;
  treesPlanted?: number;
  survivalRate?: string;
  ndviScore?: number;
  soilHealth?: string;
  image?: string;
  status?: 'Active' | 'Expanding' | 'Full';
  isActive?: boolean;
}

export const locationService = {
  // GET all locations
  async getAll(params?: {
    status?: string;
    search?: string;
    limit?: number;
    skip?: number;
  }): Promise<ApiResponse<LocationsListResponse>> {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'All') query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.skip) query.set('skip', String(params.skip));

    const url = `${API_ENDPOINTS.LOCATIONS.BASE}${query.toString() ? `?${query.toString()}` : ''}`;
    return apiClient.get<LocationsListResponse>(url);
  },

  // GET single location by ID
  async getById(id: string): Promise<ApiResponse<BackendLocation>> {
    return apiClient.get<BackendLocation>(API_ENDPOINTS.LOCATIONS.BY_ID(id));
  },

  // POST create location
  async create(payload: CreateLocationPayload): Promise<ApiResponse<BackendLocation>> {
    return apiClient.post<BackendLocation>(API_ENDPOINTS.LOCATIONS.BASE, payload);
  },

  // PUT update location
  async update(id: string, payload: UpdateLocationPayload): Promise<ApiResponse<BackendLocation>> {
    return apiClient.put<BackendLocation>(API_ENDPOINTS.LOCATIONS.BY_ID(id), payload);
  },

  // DELETE location
  async delete(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return apiClient.delete<{ deleted: boolean }>(API_ENDPOINTS.LOCATIONS.BY_ID(id));
  },

  // Helper mapper to UI model
  mapToUiItem(item: BackendLocation): PlantationLocationItem {
    return {
      id: item.id,
      name: item.name,
      region: item.region,
      gps: item.gps,
      areaHectares: item.areaHectares,
      capacity: item.capacity,
      treesPlanted: item.treesPlanted || 0,
      survivalRate: item.survivalRate || '99.0%',
      ndviScore: item.ndviScore ?? 0.88,
      soilHealth: item.soilHealth || 'Optimal Loam',
      image: item.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format',
      status: item.status || 'Active',
    };
  },
};
