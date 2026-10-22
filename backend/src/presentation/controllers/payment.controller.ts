import { Request, Response, NextFunction } from 'express';
import { CreateRazorpayOrderUseCase } from '../../application/use-cases/payment/create-razorpay-order.use-case';
import { VerifyRazorpayPaymentUseCase } from '../../application/use-cases/payment/verify-razorpay-payment.use-case';
import { IPaymentGatewayService } from '../../core/interfaces/payment-gateway.interface';
import { ApiResponse } from '../../shared/utils/api-response';

export class PaymentController {
  constructor(
    private readonly paymentGatewayService: IPaymentGatewayService,
    private readonly createRazorpayOrderUseCase: CreateRazorpayOrderUseCase,
    private readonly verifyRazorpayPaymentUseCase: VerifyRazorpayPaymentUseCase
  ) {}

  public getConfig = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      ApiResponse.success(
        res,
        {
          keyId: this.paymentGatewayService.getKeyId(),
          isLiveConfigured: this.paymentGatewayService.isLiveConfigured(),
          currency: 'INR',
        },
        'Payment gateway configuration retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  };

  public createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createRazorpayOrderUseCase.execute(req.body);
      ApiResponse.created(res, result, 'Razorpay order created successfully');
    } catch (error) {
      next(error);
    }
  };

  public verifyPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = this.verifyRazorpayPaymentUseCase.execute(req.body);
      ApiResponse.success(res, result, 'Payment signature verified successfully');
    } catch (error) {
      next(error);
    }
  };
}
