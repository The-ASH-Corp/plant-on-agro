import { apiClient } from '../api/api-client';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '@/types/api';

export interface PaymentConfig {
  keyId: string;
  isLiveConfigured: boolean;
  currency: string;
}

export interface CreatePaymentOrderPayload {
  amount: number; // in INR
  receipt?: string;
  treeSpecies?: string;
  quantity?: number;
  adopterName?: string;
  adopterEmail?: string;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number; // in paise
  currency: string;
  receipt: string;
  keyId: string;
  isMock: boolean;
}

export interface VerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  verified: boolean;
  paymentId: string;
  orderId: string;
}

/**
 * Dynamically loads the official Razorpay Checkout SDK script
 */
export function loadRazorpayCheckoutScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    // Already loaded
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('⚠️ Could not load Razorpay Checkout script from CDN.');
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

export const paymentService = {
  // Get public gateway configuration
  async getConfig(): Promise<ApiResponse<PaymentConfig>> {
    return apiClient.get<PaymentConfig>(API_ENDPOINTS.PAYMENT.CONFIG);
  },

  // Create a Razorpay Order on the backend
  async createOrder(payload: CreatePaymentOrderPayload): Promise<ApiResponse<RazorpayOrderResponse>> {
    return apiClient.post<RazorpayOrderResponse>(API_ENDPOINTS.PAYMENT.CREATE_ORDER, payload);
  },

  // Cryptographically verify Razorpay payment signature
  async verifyPayment(payload: VerifyPaymentPayload): Promise<ApiResponse<VerifyPaymentResponse>> {
    return apiClient.post<VerifyPaymentResponse>(API_ENDPOINTS.PAYMENT.VERIFY, payload);
  },
};
