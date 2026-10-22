export interface CreatePaymentOrderParams {
  amount: number; // in INR (Rupees)
  receipt: string;
  notes?: Record<string, string>;
  currency?: string;
}

export interface PaymentOrderResult {
  orderId: string;
  amount: number; // in paise (e.g. 2500000 for ₹25,000)
  currency: string;
  receipt: string;
  keyId: string;
  isMock: boolean;
}

export interface VerifyPaymentParams {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface IPaymentGatewayService {
  createOrder(params: CreatePaymentOrderParams): Promise<PaymentOrderResult>;
  verifyPayment(params: VerifyPaymentParams): boolean;
  fetchPayment?(paymentId: string): Promise<any>;
  getKeyId(): string;
  isLiveConfigured(): boolean;
}
