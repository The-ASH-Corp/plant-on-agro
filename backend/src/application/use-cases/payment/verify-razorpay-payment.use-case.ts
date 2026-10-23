import { IPaymentGatewayService } from '../../../core/interfaces/payment-gateway.interface';
import { IOrderRepository } from '../../../core/interfaces/order.repository.interface';
import { ITreeInstanceRepository } from '../../../core/interfaces/tree-instance.repository.interface';
import { ICertificateRepository } from '../../../core/interfaces/certificate.repository.interface';
import { OrderFulfillmentService } from '../../services/order-fulfillment.service';
import { BadRequestError, NotFoundError } from '../../../core/errors/app-error';
import { OrderResponseMapper } from '../../dto/order.dto';

export interface VerifyRazorpayPaymentDto {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export class VerifyRazorpayPaymentUseCase {
  constructor(
    private readonly paymentGatewayService: IPaymentGatewayService,
    private readonly orderRepository: IOrderRepository,
    private readonly treeInstanceRepository: ITreeInstanceRepository,
    private readonly certificateRepository: ICertificateRepository,
    private readonly orderFulfillmentService?: OrderFulfillmentService
  ) {}

  public async execute(dto: VerifyRazorpayPaymentDto): Promise<any> {
    if (!dto.razorpayOrderId || !dto.razorpayPaymentId || !dto.razorpaySignature) {
      throw new BadRequestError('Missing required Razorpay payment verification parameters');
    }

    // 1. Strict Cryptographic Signature Verification
    const isValid = this.paymentGatewayService.verifyPayment({
      razorpayOrderId: dto.razorpayOrderId,
      razorpayPaymentId: dto.razorpayPaymentId,
      razorpaySignature: dto.razorpaySignature,
    });

    if (!isValid) {
      throw new BadRequestError('Razorpay payment signature verification failed. Possible tampering or forged payload detected.');
    }

    // 2. Locate Pending Order in Server Database
    let order = await this.orderRepository.findByTransactionRef(dto.razorpayOrderId);
    if (!order) {
      const matching = await this.orderRepository.findAll({ search: dto.razorpayOrderId });
      if (matching.length > 0) {
        order = matching[0];
      }
    }

    if (!order) {
      throw new NotFoundError(`No internal order found matching Razorpay Order ID: ${dto.razorpayOrderId}`);
    }

    // If order was already paid, return idempotently
    if (order.paymentStatus === 'Paid') {
      const existingInstances = await this.treeInstanceRepository.findAll({ search: order.orderNumber });
      const existingCert = await this.certificateRepository.findByOrderRef(order.orderNumber);
      return {
        verified: true,
        paymentId: dto.razorpayPaymentId,
        orderId: dto.razorpayOrderId,
        order: OrderResponseMapper.toDto(order),
        treeInstances: existingInstances,
        certificate: existingCert,
      };
    }

    // 3. Verify Payment Amount Directly with Razorpay API (Anti-Tampering)
    if (this.paymentGatewayService.fetchPayment && this.paymentGatewayService.isLiveConfigured()) {
      const livePayment = await this.paymentGatewayService.fetchPayment(dto.razorpayPaymentId);
      if (!livePayment) {
        throw new BadRequestError(
          'Could not retrieve payment verification from Razorpay gateway. Payment ID may be invalid or uncaptured.'
        );
      }

      if (livePayment.status === 'failed') {
        throw new BadRequestError('Payment transaction was marked as failed by Razorpay gateway.');
      }

      const expectedPaise = Math.round(order.totalAmount * 100);
      const capturedPaise = Number(livePayment.amount);

      if (capturedPaise < expectedPaise) {
        throw new BadRequestError(
          `Payment amount mismatch: Captured ₹${capturedPaise / 100} is less than required order total ₹${order.totalAmount}. Fraudulent transaction prevented.`
        );
      }

      if (livePayment.order_id && livePayment.order_id !== dto.razorpayOrderId) {
        throw new BadRequestError('Payment does not belong to the claimed Razorpay Order ID.');
      }
    }

    // 4. Fulfill Order via OrderFulfillmentService
    const fulfillmentService =
      this.orderFulfillmentService ??
      new OrderFulfillmentService(
        this.orderRepository,
        this.treeInstanceRepository,
        this.certificateRepository
      );

    const fulfillment = await fulfillmentService.fulfillOrder(order, dto.razorpayPaymentId);

    return {
      verified: true,
      paymentId: dto.razorpayPaymentId,
      orderId: dto.razorpayOrderId,
      order: OrderResponseMapper.toDto(fulfillment.order),
      treeInstances: fulfillment.treeInstances,
      certificate: fulfillment.certificate,
    };
  }
}
