import { apiClient } from "../api/api-client";
import { ApiResponse } from "@/types/api";

export interface WaitlistEntry {
  id: string;
  email: string;
  phoneNumber: string;
  name?: string;
  source: string;
  status: "pending" | "contacted" | "admitted";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WaitlistResponse {
  items: WaitlistEntry[];
  total: number;
  pendingCount: number;
  contactedCount: number;
}

export interface JoinWaitlistPayload {
  email: string;
  phoneNumber: string;
  name?: string;
  source?: string;
}

class WaitlistService {
  async joinWaitlist(
    payload: JoinWaitlistPayload
  ): Promise<ApiResponse<{ id: string; email: string; phoneNumber: string; createdAt: string }>> {
    return apiClient.post("/waitlist", payload);
  }

  async getAll(params?: {
    search?: string;
    status?: string;
    limit?: number;
  }): Promise<ApiResponse<WaitlistResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const qs = searchParams.toString();
    const endpoint = `/waitlist${qs ? `?${qs}` : ""}`;
    return apiClient.get<WaitlistResponse>(endpoint);
  }

  async updateStatus(
    id: string,
    status: "pending" | "contacted" | "admitted",
    notes?: string
  ): Promise<ApiResponse<WaitlistEntry>> {
    return apiClient.patch<WaitlistEntry>(`/waitlist/${id}/status`, { status, notes });
  }

  async delete(id: string): Promise<ApiResponse<{ id: string }>> {
    return apiClient.delete<{ id: string }>(`/waitlist/${id}`);
  }
}

export const waitlistService = new WaitlistService();
