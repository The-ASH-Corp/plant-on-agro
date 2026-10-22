import { IPaymentGatewayService } from '../../../core/interfaces/payment-gateway.interface';
import { BadRequestError } from '../../../core/errors/app-error';

export interface VerifyRazorpayPaymentDto {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export class VerifyRazorpayPaymentUseCase {
  constructor(private readonly paymentGatewayService: IPaymentGatewayService) {}

  public execute(dto: VerifyRazorpayPaymentDto): { verified: boolean; paymentId: string; orderId: string } {
    if (!dto.razorpayOrderId || !dto.razorpayPaymentId || !dto.razorpaySignature) {
      throw new BadRequestError('Missing required Razorpay payment verification fields');
    }

    const isValid = this.paymentGatewayService.verifyPayment({
      razorpayOrderId: dto.razorpayOrderId,
      razorpayPaymentId: dto.razorpayPaymentId,
      razorpaySignature: dto.razorpaySignature,
    });

    if (!isValid) {
      throw new BadRequestError('Razorpay payment signature verification failed. Possible tampering detected.');
    }

    return {
      verified: true,
      paymentId: dto.razorpayPaymentId,
      orderId: dto.razorpayOrderId,
    };
  }
}
