import { apiClient } from '../api/api-client';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '@/types/api';
import { TreeVarietyItem } from '@/components/admin/types';

export interface BackendTreeVariety {
  id: string;
  commonName: string;
  scientificName: string;
  category: TreeVarietyItem['category'];
  price: number;
  co2AbsorptionRateKgYear: number;
  growthTimeline: string;
  careRequirements: string;
  coverImages: string[];
  location: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TreeVarietiesListResponse {
  items: BackendTreeVariety[];
  total: number;
  limit: number;
  skip: number;
}

export interface CreateTreeVarietyPayload {
  commonName: string;
  scientificName: string;
  category: TreeVarietyItem['category'];
  price: number;
  co2AbsorptionRateKgYear: number;
  growthTimeline: string;
  careRequirements: string;
  coverImages?: string[];
  location?: string;
  description?: string;
}

export interface UpdateTreeVarietyPayload {
  commonName?: string;
  scientificName?: string;
  category?: TreeVarietyItem['category'];
  price?: number;
  co2AbsorptionRateKgYear?: number;
  growthTimeline?: string;
  careRequirements?: string;
  coverImages?: string[];
  location?: string;
  description?: string;
  isActive?: boolean;
}

export const treeVarietyService = {
  // GET all tree varieties
  async getAll(params?: {
    category?: string;
    search?: string;
    limit?: number;
    skip?: number;
  }): Promise<ApiResponse<TreeVarietiesListResponse>> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.skip) query.set('skip', String(params.skip));

    const url = `${API_ENDPOINTS.TREE_VARIETIES.BASE}${query.toString() ? `?${query.toString()}` : ''}`;
    return apiClient.get<TreeVarietiesListResponse>(url);
  },

  // GET single tree variety by ID
  async getById(id: string): Promise<ApiResponse<BackendTreeVariety>> {
    return apiClient.get<BackendTreeVariety>(API_ENDPOINTS.TREE_VARIETIES.BY_ID(id));
  },

  // POST create tree variety
  async create(payload: CreateTreeVarietyPayload): Promise<ApiResponse<BackendTreeVariety>> {
    return apiClient.post<BackendTreeVariety>(API_ENDPOINTS.TREE_VARIETIES.BASE, payload);
  },

  // PUT update tree variety
  async update(id: string, payload: UpdateTreeVarietyPayload): Promise<ApiResponse<BackendTreeVariety>> {
    return apiClient.put<BackendTreeVariety>(API_ENDPOINTS.TREE_VARIETIES.BY_ID(id), payload);
  },

  // DELETE tree variety
  async delete(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return apiClient.delete<{ deleted: boolean }>(API_ENDPOINTS.TREE_VARIETIES.BY_ID(id));
  },

  // Helper mapper to UI model
  mapToUiItem(item: BackendTreeVariety): TreeVarietyItem {
    return {
      id: item.id,
      name: item.commonName,
      sci: item.scientificName,
      commonName: item.commonName,
      scientificName: item.scientificName,
      category: item.category,
      price: item.price,
      location: item.location || 'Western Ghats, Maharashtra',
      growth: item.growthTimeline || '10–15 m in 5 years',
      growthTimeline: item.growthTimeline,
      img: item.coverImages?.[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format',
      coverImages: item.coverImages,
      desc: item.description || '',
      description: item.description,
      co2PerYearKg: item.co2AbsorptionRateKgYear || 25,
      co2AbsorptionRateKgYear: item.co2AbsorptionRateKgYear,
      careRequirements: item.careRequirements || '',
      isActive: item.isActive,
    };
  },
};
