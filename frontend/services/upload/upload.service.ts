import { axiosInstance } from '../api/api-client';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '@/types/api';

export interface UploadedFileItem {
  imageUrl: string;
  filename: string;
  size: number;
  mimetype: string;
}

export interface MultiUploadResponse {
  files: UploadedFileItem[];
  urls: string[];
  count: number;
}

export interface SingleUploadResponse {
  imageUrl: string;
  filename: string;
  size: number;
  mimetype: string;
}

export const uploadService = {
  // Upload multiple images at once (up to 10 files)
  async uploadMultiple(files: File[], isExperience: boolean = false): Promise<string[]> {
    if (!files || files.length === 0) return [];

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const endpoint = isExperience
      ? API_ENDPOINTS.UPLOAD.EXPERIENCE_IMAGES
      : API_ENDPOINTS.UPLOAD.MULTIPLE;

    const response = await axiosInstance.post<ApiResponse<MultiUploadResponse>>(
      endpoint,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data?.data?.urls || [];
  },

  // Upload a single image
  async uploadSingle(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axiosInstance.post<ApiResponse<SingleUploadResponse>>(
      API_ENDPOINTS.UPLOAD.TREE_IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data?.data?.imageUrl || '';
  },
};
