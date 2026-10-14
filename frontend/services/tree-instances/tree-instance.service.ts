import { apiClient } from '../api/api-client';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '@/types/api';
import { TreeInstanceItem, TreeHealthStatus, GpsCoordinates } from '@/components/admin/types';

export interface BackendTreeInstance {
  id: string;
  treeTag: string;
  orderRef: string;
  assignedReserve: string;
  gpsCoordinates: GpsCoordinates;
  formattedGps: string;
  datePlanted: string;
  healthStatus: TreeHealthStatus;
  treeVarietyName: string;
  adopterName: string;
  adopterEmail: string;
  notes: string;
  imageUrl: string;
  lastInspectedAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TreeInstancesListResponse {
  items: BackendTreeInstance[];
  total: number;
  limit: number;
  skip: number;
}

export interface CreateTreeInstancePayload {
  treeTag: string;
  orderRef?: string;
  assignedReserve: string;
  gpsCoordinates: GpsCoordinates;
  datePlanted?: string;
  healthStatus?: TreeHealthStatus;
  treeVarietyName?: string;
  adopterName?: string;
  adopterEmail?: string;
  notes?: string;
  imageUrl?: string;
}

export interface UpdateTreeInstancePayload {
  treeTag?: string;
  orderRef?: string;
  assignedReserve?: string;
  gpsCoordinates?: GpsCoordinates;
  datePlanted?: string;
  healthStatus?: TreeHealthStatus;
  treeVarietyName?: string;
  adopterName?: string;
  adopterEmail?: string;
  notes?: string;
  imageUrl?: string;
  lastInspectedAt?: string;
  isActive?: boolean;
}

export const treeInstanceService = {
  // GET all tree instances with optional filter query
  async getAll(params?: {
    reserve?: string;
    healthStatus?: string;
    orderRef?: string;
    search?: string;
    limit?: number;
    skip?: number;
  }): Promise<ApiResponse<TreeInstancesListResponse>> {
    const query = new URLSearchParams();
    if (params?.reserve && params.reserve !== 'All') query.set('reserve', params.reserve);
    if (params?.healthStatus && params.healthStatus !== 'All') query.set('healthStatus', params.healthStatus);
    if (params?.orderRef) query.set('orderRef', params.orderRef);
    if (params?.search) query.set('search', params.search);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.skip) query.set('skip', String(params.skip));

    const url = `${API_ENDPOINTS.TREE_INSTANCES.BASE}${query.toString() ? `?${query.toString()}` : ''}`;
    return apiClient.get<TreeInstancesListResponse>(url);
  },

  // GET single tree instance by ID
  async getById(id: string): Promise<ApiResponse<BackendTreeInstance>> {
    return apiClient.get<BackendTreeInstance>(API_ENDPOINTS.TREE_INSTANCES.BY_ID(id));
  },

  // GET single tree instance by unique Tag / Serial
  async getByTag(tag: string): Promise<ApiResponse<BackendTreeInstance>> {
    return apiClient.get<BackendTreeInstance>(API_ENDPOINTS.TREE_INSTANCES.BY_TAG(tag));
  },

  // POST create / tag a tree instance
  async create(payload: CreateTreeInstancePayload): Promise<ApiResponse<BackendTreeInstance>> {
    return apiClient.post<BackendTreeInstance>(API_ENDPOINTS.TREE_INSTANCES.BASE, payload);
  },

  // PUT update a tree instance (health, GPS, notes, inspection)
  async update(
    id: string,
    payload: UpdateTreeInstancePayload
  ): Promise<ApiResponse<BackendTreeInstance>> {
    return apiClient.put<BackendTreeInstance>(API_ENDPOINTS.TREE_INSTANCES.BY_ID(id), payload);
  },

  // DELETE tree instance
  async delete(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return apiClient.delete<{ deleted: boolean }>(API_ENDPOINTS.TREE_INSTANCES.BY_ID(id));
  },

  // Helper mapper to UI model
  mapToUiItem(item: BackendTreeInstance): TreeInstanceItem {
    return {
      id: item.id,
      treeTag: item.treeTag,
      orderRef: item.orderRef,
      assignedReserve: item.assignedReserve,
      gpsCoordinates: item.gpsCoordinates,
      formattedGps: item.formattedGps,
      datePlanted: item.datePlanted,
      healthStatus: item.healthStatus,
      treeVarietyName: item.treeVarietyName,
      adopterName: item.adopterName,
      adopterEmail: item.adopterEmail,
      notes: item.notes,
      imageUrl: item.imageUrl,
      lastInspectedAt: item.lastInspectedAt,
      isActive: item.isActive,
    };
  },
};
