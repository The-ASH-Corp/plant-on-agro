import { IPaymentGatewayService } from '../../../core/interfaces/payment-gateway.interface';
import { IOrderRepository } from '../../../core/interfaces/order.repository.interface';
import { OrderFulfillmentService } from '../../services/order-fulfillment.service';
import { BadRequestError } from '../../../core/errors/app-error';

export interface ProcessRazorpayWebhookDto {
  rawBody: Buffer | string;
  signature: string;
  payload: any;
}

export interface WebhookProcessingResult {
  received: boolean;
  status: string;
  orderNumber?: string;
  paymentId?: string;
  event?: string;
}

export class ProcessRazorpayWebhookUseCase {
  constructor(
    private readonly paymentGatewayService: IPaymentGatewayService,
    private readonly orderRepository: IOrderRepository,
    private readonly orderFulfillmentService: OrderFulfillmentService
  ) {}

  public async execute(dto: ProcessRazorpayWebhookDto): Promise<WebhookProcessingResult> {
    if (!dto.signature) {
      throw new BadRequestError('Missing X-Razorpay-Signature header in webhook request');
    }

    if (!dto.rawBody) {
      throw new BadRequestError('Missing raw request body required for webhook HMAC verification');
    }

    // 1. Cryptographically Verify Webhook Signature using HMAC SHA-256
    const isSignatureValid = this.paymentGatewayService.verifyWebhookSignature
      ? this.paymentGatewayService.verifyWebhookSignature(dto.rawBody, dto.signature)
      : false;

    if (!isSignatureValid) {
      throw new BadRequestError('Invalid Razorpay webhook signature. Request rejected.');
    }

    const event = dto.payload?.event;

    // 2. Filter for supported payment completion events
    if (event !== 'payment.captured' && event !== 'order.paid') {
      return {
        received: true,
        status: 'ignored_event',
        event,
      };
    }

    // 3. Extract Razorpay Order ID & Payment ID
    let rzpOrderId: string | undefined;
    let paymentId: string | undefined;
    let amountInPaise: number | undefined;

    if (event === 'payment.captured') {
      const paymentEntity = dto.payload?.payload?.payment?.entity;
      rzpOrderId = paymentEntity?.order_id;
      paymentId = paymentEntity?.id;
      amountInPaise = Number(paymentEntity?.amount);
    } else if (event === 'order.paid') {
      const orderEntity = dto.payload?.payload?.order?.entity;
      const paymentEntity = dto.payload?.payload?.payment?.entity;
      rzpOrderId = orderEntity?.id;
      paymentId = paymentEntity?.id || `pay_wh_${Date.now()}`;
      amountInPaise = Number(orderEntity?.amount_paid || orderEntity?.amount);
    }

    if (!rzpOrderId) {
      return {
        received: true,
        status: 'missing_order_id',
        event,
      };
    }

    // 4. Locate matching internal Order in database (multi-strategy fallback)
    let order = await this.orderRepository.findByTransactionRef(rzpOrderId);

    if (!order && paymentId) {
      order = await this.orderRepository.findByTransactionRef(paymentId);
    }

    if (!order) {
      const paymentEntity = dto.payload?.payload?.payment?.entity;
      const orderEntity = dto.payload?.payload?.order?.entity;
      const orderNumberHint =
        paymentEntity?.notes?.orderNumber ||
        orderEntity?.notes?.orderNumber ||
        orderEntity?.receipt;
      if (orderNumberHint) {
        order = await this.orderRepository.findByOrderNumber(orderNumberHint);
      }
    }

    if (!order) {
      const matches = await this.orderRepository.findAll({ search: rzpOrderId });
      if (matches.length > 0) {
        order = matches[0];
      }
    }

    if (!order && paymentId) {
      const matches = await this.orderRepository.findAll({ search: paymentId });
      if (matches.length > 0) {
        order = matches[0];
      }
    }

    if (!order) {
      console.warn(`[Webhook] No internal order found for Razorpay Order ID: ${rzpOrderId}`);
      return {
        received: true,
        status: 'order_not_found',
        event,
      };
    }

    // 5. Idempotent check: if already paid and fulfilled, exit cleanly
    if (order.paymentStatus === 'Paid') {
      return {
        received: true,
        status: 'already_fulfilled',
        orderNumber: order.orderNumber,
        paymentId: order.transactionRef,
      };
    }

    // 6. Anti-Tampering: Verify captured amount covers order total
    if (amountInPaise !== undefined) {
      const expectedPaise = Math.round(order.totalAmount * 100);
      if (amountInPaise < expectedPaise) {
        console.error(
          `[Webhook Alert] Captured amount ₹${amountInPaise / 100} is less than order total ₹${order.totalAmount} for ${order.orderNumber}`
        );
        return {
          received: true,
          status: 'amount_mismatch',
          orderNumber: order.orderNumber,
        };
      }
    }

    // 7. Atomic Server-Side Fulfillment (Paid status, Tree Instances, Digital Deed)
    const fulfillment = await this.orderFulfillmentService.fulfillOrder(
      order,
      paymentId || `pay_wh_${Date.now()}`
    );

    console.log(
      `✅ [Webhook Fulfill] Order ${fulfillment.order.orderNumber} successfully fulfilled asynchronously via Razorpay Webhook (${event})`
    );

    return {
      received: true,
      status: 'order_fulfilled',
      orderNumber: fulfillment.order.orderNumber,
      paymentId: paymentId || fulfillment.order.transactionRef,
      event,
    };
  }
}
