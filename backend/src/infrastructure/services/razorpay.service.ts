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
  private readonly webhookSecret: string;
  private readonly isConfigured: boolean;

  constructor(keyId: string, keySecret: string, webhookSecret: string = '') {
    this.keyId = keyId.trim();
    this.keySecret = keySecret.trim();
    this.webhookSecret = webhookSecret.trim();

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

    // Only allow simulator verification if live keys are NOT configured
    if (!this.isLiveConfigured()) {
      return (
        params.razorpaySignature === 'mock_signature_valid' ||
        params.razorpayOrderId.startsWith('order_sim_')
      );
    }

    // When Live/Test keys are configured, HMAC SHA-256 calculation is MANDATORY
    try {
      const generatedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
        .digest('hex');

      const expectedBuffer = Buffer.from(generatedSignature, 'utf-8');
      const actualBuffer = Buffer.from(params.razorpaySignature, 'utf-8');
      if (expectedBuffer.length !== actualBuffer.length) {
        return false;
      }
      return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
    } catch (err) {
      console.error('Error verifying Razorpay HMAC signature:', err);
      return false;
    }
  }

  public verifyWebhookSignature(rawBody: Buffer | string, signature: string): boolean {
    if (!signature) {
      return false;
    }

    const secret = this.webhookSecret || this.keySecret;
    if (secret) {
      try {
        const generatedSignature = crypto
          .createHmac('sha256', secret)
          .update(rawBody)
          .digest('hex');

        const expectedBuffer = Buffer.from(generatedSignature, 'utf-8');
        const actualBuffer = Buffer.from(signature, 'utf-8');

        if (
          expectedBuffer.length === actualBuffer.length &&
          crypto.timingSafeEqual(expectedBuffer, actualBuffer)
        ) {
          return true;
        }
      } catch (err) {
        console.error('Error verifying Razorpay Webhook HMAC signature:', err);
      }
    }

    // In simulator mode when live credentials are not present, also accept mock test tokens
    if (!this.isLiveConfigured()) {
      return (
        signature === 'mock_webhook_signature_valid' ||
        signature === 'valid_test_webhook_signature'
      );
    }

    return false;
  }

  public async fetchPayment(paymentId: string): Promise<any> {
    if (this.isLiveConfigured() && this.client) {
      try {
        return await this.client.payments.fetch(paymentId);
      } catch (err) {
        console.error('Failed to fetch payment from Razorpay API:', err);
        return null;
      }
    }
    return null;
  }
}
