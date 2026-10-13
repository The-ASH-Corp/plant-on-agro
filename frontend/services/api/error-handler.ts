import axios, { AxiosError } from 'axios';
import { ApiError, ApiResponse } from '@/types/api';

/**
 * Normalizes any caught Axios error or generic error into a strongly-typed ApiError.
 */
export function extractApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;

    // Network level error (server down, CORS blocked, timeout)
    if (!axiosError.response) {
      if (axiosError.code === 'ECONNABORTED') {
        return new ApiError(
          'Request timeout. Please check your connection and try again.',
          408,
          {},
          undefined,
          true
        );
      }
      return new ApiError(
        'Unable to connect to the server. Please check your internet connection.',
        0,
        {},
        undefined,
        true
      );
    }

    const { status, data } = axiosError.response;
    const fallbackMessage = axiosError.message || 'An unexpected error occurred';
    const message = data?.message || fallbackMessage;

    // Parse field-level validation errors
    const fieldErrors: Record<string, string> = {};
    if (Array.isArray(data?.errors)) {
      data.errors.forEach((item: unknown) => {
        if (typeof item === 'object' && item !== null && 'field' in item && 'message' in item) {
          const errObj = item as { field: string; message: string };
          // If field is empty string, default to general or first field
          const fieldKey = errObj.field || 'general';
          if (!fieldErrors[fieldKey]) {
            fieldErrors[fieldKey] = errObj.message;
          }
        }
      });
    }

    return new ApiError(message, status, fieldErrors, data?.errors, false);
  }

  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500);
  }

  return new ApiError('An unexpected error occurred', 500);
}
