import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiError, ApiResponse } from '@/types/api';
import { extractApiError } from './error-handler';

/**
 * Checks whether the application is running in a production environment.
 */
export function isProductionEnvironment(): boolean {
  if (process.env.NODE_ENV === 'production') return true;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    return (
      host !== 'localhost' &&
      host !== '127.0.0.1' &&
      host !== '0.0.0.0' &&
      !host.endsWith('.local')
    );
  }
  return false;
}

/**
 * Returns true if the application is running in production and NEXT_PUBLIC_API_URL is missing.
 */
export function isMissingProductionApiUrl(): boolean {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  return isProductionEnvironment() && (!envUrl || envUrl.trim() === '');
}

/**
 * Resolves the API base URL directly from the environment variable NEXT_PUBLIC_API_URL.
 * If in production and NEXT_PUBLIC_API_URL is not set, logs a critical error.
 */
export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  if (isProductionEnvironment()) {
    console.error(
      '[CRITICAL CONFIG ERROR] NEXT_PUBLIC_API_URL is not configured in this production environment. ' +
        'Please set NEXT_PUBLIC_API_URL in your hosting provider (e.g. Vercel Project Settings -> Environment Variables).'
    );
    return '';
  }

  // Development fallback for local machine only
  return 'http://localhost:5000/api/v1';
}

export function getBackendOrigin(): string {
  const base = getApiBaseUrl();
  return base ? base.replace(/\/api\/v1\/?$/, '') : '';
}

const BASE_URL = getApiBaseUrl();


export function getStoredAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const rawStorage = localStorage.getItem('plant_on_agro_auth');
    if (!rawStorage) return null;
    const parsed = JSON.parse(rawStorage);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
}


function handleUnauthorized(requestUrl?: string): void {
  if (typeof window === 'undefined') return;

  // Do not redirect on active login or registration endpoint attempts
  const isAuthAttempt =
    requestUrl &&
    (requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/check-email'));

  if (isAuthAttempt) {
    return;
  }

  try {
    localStorage.removeItem('plant_on_agro_auth');
    delete axiosInstance.defaults.headers.common['Authorization'];
    window.dispatchEvent(new Event('auth:unauthorized'));
  } catch {
    // Ignore storage errors
  }

  // Cleanly redirect to login with sessionExpired query parameter if not already on an auth page
  if (
    !window.location.pathname.startsWith('/login') &&
    !window.location.pathname.startsWith('/register') &&
    !window.location.pathname.startsWith('/forgot-password')
  ) {
    const currentPath = window.location.pathname;
    const redirectParam =
      currentPath && currentPath !== '/'
        ? `&redirect=${encodeURIComponent(currentPath)}`
        : '';
    window.location.href = `/login?sessionExpired=true${redirectParam}`;
  }
}


export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});


export function setAuthHeaderToken(token: string | null): void {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
}

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isMissingProductionApiUrl()) {
      const configError = new ApiError(
        'Configuration Error: Backend API URL (NEXT_PUBLIC_API_URL) is not configured in this production environment. Please configure NEXT_PUBLIC_API_URL in your hosting provider settings.',
        500,
        {},
        undefined,
        true
      );
      return Promise.reject(configError);
    }

    config.baseURL = getApiBaseUrl();
    const token = getStoredAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach request timestamp for debugging & performance tracking
    (config as unknown as Record<string, unknown>)._startTime = Date.now();

    return config;
  },
  (error) => {
    return Promise.reject(extractApiError(error));
  }
);


axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Log duration in development
    if (process.env.NODE_ENV === 'development') {
      const startTime = (response.config as unknown as Record<string, unknown>)._startTime as number;
      if (startTime) {
        const duration = Date.now() - startTime;
        console.debug(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
      }
    }

    return response;
  },
  (error) => {
    const apiError = extractApiError(error);

    if (apiError.statusCode === 401) {
      handleUnauthorized(error?.config?.url);
    }

    return Promise.reject(apiError);
  }
);


export const apiClient = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await axiosInstance.get<ApiResponse<T>>(url, config);
    return response.data;
  },

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await axiosInstance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await axiosInstance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await axiosInstance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await axiosInstance.delete<ApiResponse<T>>(url, config);
    return response.data;
  },
};
