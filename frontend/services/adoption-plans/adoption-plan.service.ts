import { apiClient } from '../api/api-client';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '@/types/api';
import { AdoptionPlanItem, OccasionDedicationType } from '@/components/admin/types';

export interface BackendAdoptionPlan {
  id: string;
  planLabel: string;
  icon: string;
  priceModifier: number;
  description: string;
  features: string[];
  occasionDedications: OccasionDedicationType[];
  badge: string;
  activeCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdoptionPlansListResponse {
  items: BackendAdoptionPlan[];
  total: number;
  limit: number;
  skip: number;
}

export interface CreateAdoptionPlanPayload {
  planLabel: string;
  icon?: string;
  priceModifier?: number;
  description: string;
  features?: string[];
  occasionDedications?: OccasionDedicationType[];
  badge?: string;
  activeCount?: number;
}

export interface UpdateAdoptionPlanPayload {
  planLabel?: string;
  icon?: string;
  priceModifier?: number;
  description?: string;
  features?: string[];
  occasionDedications?: OccasionDedicationType[];
  badge?: string;
  activeCount?: number;
  isActive?: boolean;
}

export const adoptionPlanService = {
  // GET all adoption plans
  async getAll(params?: {
    occasion?: string;
    search?: string;
    limit?: number;
    skip?: number;
  }): Promise<ApiResponse<AdoptionPlansListResponse>> {
    const query = new URLSearchParams();
    if (params?.occasion && params.occasion !== 'all') query.set('occasion', params.occasion);
    if (params?.search) query.set('search', params.search);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.skip) query.set('skip', String(params.skip));

    const url = `${API_ENDPOINTS.ADOPTION_PLANS.BASE}${query.toString() ? `?${query.toString()}` : ''}`;
    return apiClient.get<AdoptionPlansListResponse>(url);
  },

  // GET single adoption plan by ID
  async getById(id: string): Promise<ApiResponse<BackendAdoptionPlan>> {
    return apiClient.get<BackendAdoptionPlan>(API_ENDPOINTS.ADOPTION_PLANS.BY_ID(id));
  },

  // POST create adoption plan
  async create(payload: CreateAdoptionPlanPayload): Promise<ApiResponse<BackendAdoptionPlan>> {
    return apiClient.post<BackendAdoptionPlan>(API_ENDPOINTS.ADOPTION_PLANS.BASE, payload);
  },

  // PUT update adoption plan
  async update(
    id: string,
    payload: UpdateAdoptionPlanPayload
  ): Promise<ApiResponse<BackendAdoptionPlan>> {
    return apiClient.put<BackendAdoptionPlan>(API_ENDPOINTS.ADOPTION_PLANS.BY_ID(id), payload);
  },

  // DELETE adoption plan
  async delete(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return apiClient.delete<{ deleted: boolean }>(API_ENDPOINTS.ADOPTION_PLANS.BY_ID(id));
  },

  // Helper mapper to UI model
  mapToUiItem(item: BackendAdoptionPlan): AdoptionPlanItem {
    return {
      id: item.id,
      label: item.planLabel,
      planLabel: item.planLabel,
      icon: item.icon || '🌱',
      desc: item.description,
      description: item.description,
      price: item.priceModifier,
      priceModifier: item.priceModifier,
      features: item.features || [],
      occasionDedications: item.occasionDedications || ['general'],
      badge: item.badge || 'Standard',
      activeCount: item.activeCount || 0,
      isActive: item.isActive,
    };
  },
};
