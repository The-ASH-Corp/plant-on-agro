import { Request, Response, NextFunction } from 'express';
import { CreateRazorpayOrderUseCase } from '../../application/use-cases/payment/create-razorpay-order.use-case';
import { VerifyRazorpayPaymentUseCase } from '../../application/use-cases/payment/verify-razorpay-payment.use-case';
import { ProcessRazorpayWebhookUseCase } from '../../application/use-cases/payment/process-razorpay-webhook.use-case';
import { IPaymentGatewayService } from '../../core/interfaces/payment-gateway.interface';
import { ApiResponse } from '../../shared/utils/api-response';

export class PaymentController {
  constructor(
    private readonly paymentGatewayService: IPaymentGatewayService,
    private readonly createRazorpayOrderUseCase: CreateRazorpayOrderUseCase,
    private readonly verifyRazorpayPaymentUseCase: VerifyRazorpayPaymentUseCase,
    private readonly processRazorpayWebhookUseCase: ProcessRazorpayWebhookUseCase
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
      const result = await this.verifyRazorpayPaymentUseCase.execute(req.body);
      ApiResponse.success(res, result, 'Payment signature verified successfully');
    } catch (error) {
      next(error);
    }
  };

  public handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signature = (req.headers['x-razorpay-signature'] as string) || '';
      const rawBody = (req as any).rawBody || Buffer.from(JSON.stringify(req.body));

      const result = await this.processRazorpayWebhookUseCase.execute({
        rawBody,
        signature,
        payload: req.body,
      });

      res.status(200).json({ ok: true, ...result });
    } catch (error) {
      next(error);
    }
  };
}
