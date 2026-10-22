import Razorpay from 'razorpay';
import crypto from 'crypto';
import {
  IPaymentGatewayService,
  CreatePaymentOrderParams,
  PaymentOrderResult,
  VerifyPaymentParams,
} from '../../core/interfaces/payment-gateway.interface';

export class RazorpayPaymentService implements IPaymentGatewayService {
  private client: Razorpay | null = null;
  private readonly keyId: string;
  private readonly keySecret: string;
  private readonly isConfigured: boolean;

  constructor(keyId: string, keySecret: string) {
    this.keyId = keyId.trim();
    this.keySecret = keySecret.trim();

    // Check if real or non-placeholder credentials have been provided
    this.isConfigured =
      Boolean(this.keyId) &&
      Boolean(this.keySecret) &&
      !this.keyId.includes('placeholder') &&
      !this.keySecret.includes('placeholder');

    if (this.isConfigured) {
      try {
        this.client = new Razorpay({
          key_id: this.keyId,
          key_secret: this.keySecret,
        });
        console.log('💳 Razorpay Gateway initialized in LIVE/TEST mode with Key ID:', this.keyId);
      } catch (err) {
        console.warn('⚠️ Razorpay initialization failed, falling back to sandbox simulator mode:', err);
        this.client = null;
      }
    } else {
      console.log('🧪 Razorpay initialized in Development Sandbox Simulator mode (placeholder keys detected)');
    }
  }

  public getKeyId(): string {
    return this.keyId;
  }

  public isLiveConfigured(): boolean {
    return this.isConfigured && this.client !== null;
  }

  public async createOrder(params: CreatePaymentOrderParams): Promise<PaymentOrderResult> {
    const amountInPaise = Math.round(params.amount * 100);

    if (this.isLiveConfigured() && this.client) {
      try {
        const order = await this.client.orders.create({
          amount: amountInPaise,
          currency: params.currency || 'INR',
          receipt: params.receipt,
          notes: params.notes || {},
        });

        return {
          orderId: order.id,
          amount: Number(order.amount),
          currency: order.currency,
          receipt: (order.receipt as string) || params.receipt,
          keyId: this.keyId,
          isMock: false,
        };
      } catch (error: any) {
        console.error('❌ Razorpay Orders API error:', error?.error || error);
        throw new Error(error?.error?.description || error?.message || 'Failed to create Razorpay order');
      }
    }

    // Fallback: Sandbox Simulator Order
    const mockOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return {
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: params.currency || 'INR',
      receipt: params.receipt,
      keyId: this.keyId || 'rzp_test_simulated_key',
      isMock: true,
    };
  }

  public verifyPayment(params: VerifyPaymentParams): boolean {
    if (!params.razorpayOrderId || !params.razorpayPaymentId || !params.razorpaySignature) {
      return false;
    }

    // If sandbox simulator or zero payment order
    if (
      params.razorpayOrderId.startsWith('order_sim_') ||
      params.razorpayOrderId.startsWith('order_zero_') ||
      !this.isLiveConfigured()
    ) {
      return true;
    }

    try {
      const generatedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
        .digest('hex');

      return generatedSignature === params.razorpaySignature;
    } catch (err) {
      console.error('Error verifying Razorpay HMAC signature:', err);
      return false;
    }
  }
}
