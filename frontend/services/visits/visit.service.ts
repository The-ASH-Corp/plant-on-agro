import { apiClient } from '../api/api-client';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '@/types/api';

export interface VisitMemoryItem {
  imageUrl: string;
  caption?: string;
  recordedAt?: string;
}

export interface VisitBookingRecord {
  id: string;
  bookingReference: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone?: string;
  experienceId?: string;
  experienceTitle: string;
  reserveName: string;
  visitDate: string;
  timeSlot: string;
  numberOfGuests: number;
  associatedTrees: string[];
  specialRequests?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  guestPassCode: string;
  guideName?: string;
  notes?: string;
  memories: VisitMemoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateVisitBookingPayload {
  adopterName: string;
  adopterEmail: string;
  adopterPhone?: string;
  experienceId?: string;
  experienceTitle?: string;
  reserveName: string;
  visitDate: string;
  timeSlot: string;
  numberOfGuests?: number;
  associatedTrees?: string[];
  specialRequests?: string;
}

export interface UpdateVisitStatusPayload {
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  guideName?: string;
  notes?: string;
}

function normalizeBooking(raw: any): VisitBookingRecord {
  return {
    id: raw.id || raw._id || '',
    bookingReference: raw.bookingReference || raw._bookingReference || '',
    adopterName: raw.adopterName || raw._adopterName || '',
    adopterEmail: raw.adopterEmail || raw._adopterEmail || '',
    adopterPhone: raw.adopterPhone || raw._adopterPhone || '',
    experienceId: raw.experienceId || raw._experienceId || '',
    experienceTitle: raw.experienceTitle || raw._experienceTitle || 'General Plantation Visit',
    reserveName: raw.reserveName || raw._reserveName || 'Kerala Flagship Reserve',
    visitDate: raw.visitDate || raw._visitDate || '',
    timeSlot: raw.timeSlot || raw._timeSlot || 'Morning Slot',
    numberOfGuests: Number(raw.numberOfGuests ?? raw._numberOfGuests ?? 1),
    associatedTrees: Array.isArray(raw.associatedTrees || raw._associatedTrees)
      ? (raw.associatedTrees || raw._associatedTrees)
      : [],
    specialRequests: raw.specialRequests || raw._specialRequests || '',
    status: raw.status || raw._status || 'Confirmed',
    guestPassCode: raw.guestPassCode || raw._guestPassCode || '',
    guideName: raw.guideName || raw._guideName || '',
    notes: raw.notes || raw._notes || '',
    memories: Array.isArray(raw.memories || raw._memories)
      ? (raw.memories || raw._memories).map((m: any) => ({
          imageUrl: m.imageUrl || '',
          caption: m.caption || '',
          recordedAt: m.recordedAt || '',
        }))
      : [],
    createdAt: raw.createdAt || raw._createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || raw._updatedAt || new Date().toISOString(),
  };
}

export const visitService = {
  async book(payload: CreateVisitBookingPayload): Promise<ApiResponse<VisitBookingRecord>> {
    const res = await apiClient.post<any>(API_ENDPOINTS.VISITS.BASE, payload);
    return {
      ...res,
      data: normalizeBooking(res.data),
    };
  },

  async getMyVisits(email?: string): Promise<ApiResponse<VisitBookingRecord[]>> {
    const res = await apiClient.get<any>(API_ENDPOINTS.VISITS.MY_VISITS, {
      params: email ? { email } : undefined,
    });
    const items = Array.isArray(res.data) ? res.data.map(normalizeBooking) : [];
    return {
      ...res,
      data: items,
    };
  },

  async getAll(params?: { status?: string; reserveName?: string; search?: string }): Promise<ApiResponse<{ items: VisitBookingRecord[]; total: number }>> {
    const res = await apiClient.get<any>(API_ENDPOINTS.VISITS.BASE, { params });
    const items = Array.isArray(res.data?.items) ? res.data.items.map(normalizeBooking) : [];
    return {
      ...res,
      data: {
        items,
        total: res.data?.total || items.length,
      },
    };
  },

  async getById(id: string): Promise<ApiResponse<VisitBookingRecord>> {
    const res = await apiClient.get<any>(API_ENDPOINTS.VISITS.BY_ID(id));
    return {
      ...res,
      data: normalizeBooking(res.data),
    };
  },

  async updateStatus(id: string, payload: UpdateVisitStatusPayload): Promise<ApiResponse<VisitBookingRecord>> {
    const res = await apiClient.patch<any>(API_ENDPOINTS.VISITS.STATUS(id), payload);
    return {
      ...res,
      data: normalizeBooking(res.data),
    };
  },

  async addMemories(id: string, memories: { imageUrl: string; caption?: string }[]): Promise<ApiResponse<VisitBookingRecord>> {
    const res = await apiClient.post<any>(API_ENDPOINTS.VISITS.MEMORIES(id), { memories });
    return {
      ...res,
      data: normalizeBooking(res.data),
    };
  },

  async delete(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return apiClient.delete<{ deleted: boolean }>(API_ENDPOINTS.VISITS.BY_ID(id));
  },
};
