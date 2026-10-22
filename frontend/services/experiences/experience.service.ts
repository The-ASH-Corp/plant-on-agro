import { apiClient } from '../api/api-client';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '@/types/api';

export interface ExperienceItem {
  id: string;
  title: string;
  slug: string;
  category: 'Forest Walk' | 'Harvesting' | 'Wellness' | 'Heritage Stay' | 'Farm Experience' | 'Adventure';
  tagline: string;
  description: string;
  location: string;
  duration: string;
  price: number;
  included: string[];
  galleryImages: string[];
  featuredImage: string;
  maxGroupSize: number;
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExperiencesListResponse {
  items: ExperienceItem[];
  total: number;
}

export interface CreateExperiencePayload {
  title: string;
  category: string;
  tagline: string;
  description: string;
  location: string;
  duration: string;
  price?: number;
  included?: string[];
  galleryImages?: string[];
  featuredImage?: string;
  maxGroupSize?: number;
}

export interface UpdateExperiencePayload extends Partial<CreateExperiencePayload> {
  isActive?: boolean;
}

function normalizeExperience(raw: any): ExperienceItem {
  return {
    id: raw.id || raw._id || '',
    title: raw.title || raw._title || '',
    slug: raw.slug || raw._slug || '',
    category: raw.category || raw._category || 'Forest Walk',
    tagline: raw.tagline || raw._tagline || '',
    description: raw.description || raw._description || '',
    location: raw.location || raw._location || 'Kerala Flagship Reserve',
    duration: raw.duration || raw._duration || '3 Hours',
    price: Number(raw.price ?? raw._price ?? 0),
    included: Array.isArray(raw.included || raw._included) ? (raw.included || raw._included) : [],
    galleryImages: Array.isArray(raw.galleryImages || raw._galleryImages) ? (raw.galleryImages || raw._galleryImages) : [],
    featuredImage: raw.featuredImage || raw._featuredImage || (raw.galleryImages?.[0] || raw._galleryImages?.[0] || ''),
    maxGroupSize: Number(raw.maxGroupSize ?? raw._maxGroupSize ?? 15),
    rating: Number(raw.rating ?? raw._rating ?? 4.9),
    reviewsCount: Number(raw.reviewsCount ?? raw._reviewsCount ?? 12),
    isActive: raw.isActive ?? raw._isActive ?? true,
    createdAt: raw.createdAt || raw._createdAt,
    updatedAt: raw.updatedAt || raw._updatedAt,
  };
}

export const experienceService = {
  async getAll(params?: { category?: string; location?: string; search?: string }): Promise<ApiResponse<ExperiencesListResponse>> {
    const res = await apiClient.get<any>(API_ENDPOINTS.EXPERIENCES.BASE, { params });
    const items = Array.isArray(res.data?.items) ? res.data.items.map(normalizeExperience) : [];
    return {
      ...res,
      data: {
        items,
        total: res.data?.total || items.length,
      },
    };
  },

  async getById(idOrSlug: string): Promise<ApiResponse<ExperienceItem>> {
    const res = await apiClient.get<any>(API_ENDPOINTS.EXPERIENCES.BY_ID(idOrSlug));
    return {
      ...res,
      data: normalizeExperience(res.data),
    };
  },

  async create(payload: CreateExperiencePayload): Promise<ApiResponse<ExperienceItem>> {
    const res = await apiClient.post<any>(API_ENDPOINTS.EXPERIENCES.BASE, payload);
    return {
      ...res,
      data: normalizeExperience(res.data),
    };
  },

  async update(id: string, payload: UpdateExperiencePayload): Promise<ApiResponse<ExperienceItem>> {
    const res = await apiClient.put<any>(API_ENDPOINTS.EXPERIENCES.BY_ID(id), payload);
    return {
      ...res,
      data: normalizeExperience(res.data),
    };
  },

  async delete(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return apiClient.delete<{ deleted: boolean }>(API_ENDPOINTS.EXPERIENCES.BY_ID(id));
  },
};
