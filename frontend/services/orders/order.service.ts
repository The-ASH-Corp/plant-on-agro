import { apiClient } from '../api/api-client';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '@/types/api';
import { AdoptionOrderStatus, AdoptionOrder } from '@/components/admin/types';

export interface BackendOrderItem {
  treeVarietyId?: string;
  treeSpecies: string;
  scientificName?: string;
  category?: string;
  planType: string;
  reserveName: string;
  gpsCoords?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface BackendBillingAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface BackendOrder {
  id: string;
  orderNumber: string;
  invoiceNumber: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone: string;
  billingAddress: BackendBillingAddress;
  items: BackendOrderItem[];
  treeSpecies: string;
  scientificName: string;
  category: string;
  reserveName: string;
  gpsCoords: string;
  planType: string;
  dedicationMessage: string;
  quantity: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  transactionRef: string;
  status: AdoptionOrderStatus;
  certificateId: string;
  ndviScore: number;
  isRead: boolean;
  notes: string;
  datePlanted: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersListResponse {
  items: BackendOrder[];
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface CreateOrderPayload {
  orderNumber?: string;
  invoiceNumber?: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone?: string;
  billingAddress?: BackendBillingAddress;
  items?: BackendOrderItem[];
  treeSpecies: string;
  scientificName?: string;
  category?: string;
  reserveName: string;
  gpsCoords?: string;
  planType: string;
  dedicationMessage?: string;
  quantity: number;
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus?: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  transactionRef?: string;
  status?: AdoptionOrderStatus;
  certificateId?: string;
  ndviScore?: number;
  isRead?: boolean;
  notes?: string;
  datePlanted?: string;
}

export interface QueryOrdersParams {
  status?: string;
  paymentStatus?: string;
  search?: string;
  adopterEmail?: string;
  reserveName?: string;
  isRead?: boolean;
  limit?: number;
  skip?: number;
}

export const orderService = {
  async getAll(params?: QueryOrdersParams): Promise<ApiResponse<OrdersListResponse>> {
    return apiClient.get<OrdersListResponse>(API_ENDPOINTS.ORDERS.BASE, {
      params,
    });
  },

  async getById(id: string): Promise<ApiResponse<BackendOrder>> {
    return apiClient.get<BackendOrder>(API_ENDPOINTS.ORDERS.BY_ID(id));
  },

  async getByNumber(orderNumber: string): Promise<ApiResponse<BackendOrder>> {
    return apiClient.get<BackendOrder>(API_ENDPOINTS.ORDERS.BY_NUMBER(orderNumber));
  },

  async create(payload: CreateOrderPayload): Promise<ApiResponse<BackendOrder>> {
    return apiClient.post<BackendOrder>(API_ENDPOINTS.ORDERS.BASE, payload);
  },

  async updateStatus(
    id: string,
    status: AdoptionOrderStatus,
    notes?: string,
    gpsCoords?: string
  ): Promise<ApiResponse<BackendOrder>> {
    return apiClient.patch<BackendOrder>(API_ENDPOINTS.ORDERS.STATUS(id), {
      status,
      notes,
      gpsCoords,
    });
  },

  async markAllAsRead(): Promise<ApiResponse<{ updatedCount: number }>> {
    return apiClient.post<{ updatedCount: number }>(API_ENDPOINTS.ORDERS.MARK_ALL_READ, {});
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(API_ENDPOINTS.ORDERS.BY_ID(id));
  },

  mapToUiItem(order: BackendOrder): AdoptionOrder {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      invoiceNumber: order.invoiceNumber,
      adopterName: order.adopterName,
      adopterEmail: order.adopterEmail,
      adopterPhone: order.adopterPhone,
      treeSpecies: order.treeSpecies,
      scientificName: order.scientificName || 'Botanical Specimen',
      category: order.category || 'Native Trees',
      reserveName: order.reserveName,
      gpsCoords: order.gpsCoords,
      planType: order.planType,
      dedicationMessage: order.dedicationMessage,
      quantity: order.quantity,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      transactionRef: order.transactionRef,
      datePlanted: order.datePlanted
        ? typeof order.datePlanted === 'string'
          ? order.datePlanted.split('T')[0]
          : order.datePlanted
        : new Date().toISOString().split('T')[0],
      status: order.status,
      certificateId: order.certificateId,
      ndviScore: order.ndviScore,
      isRead: order.isRead !== undefined ? order.isRead : true,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  },
};
