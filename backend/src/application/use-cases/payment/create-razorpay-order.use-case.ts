import {
  IPaymentGatewayService,
  PaymentOrderResult,
} from '../../../core/interfaces/payment-gateway.interface';
import { BadRequestError } from '../../../core/errors/app-error';

export interface CreateRazorpayOrderDto {
  amount: number; // in INR
  receipt?: string;
  treeSpecies?: string;
  quantity?: number;
  adopterName?: string;
  adopterEmail?: string;
}

export class CreateRazorpayOrderUseCase {
  constructor(private readonly paymentGatewayService: IPaymentGatewayService) {}

  public async execute(dto: CreateRazorpayOrderDto): Promise<PaymentOrderResult> {
    if (dto.amount === undefined || dto.amount === null || dto.amount < 0) {
      throw new BadRequestError('Payment amount must be zero or greater');
    }

    const receipt = dto.receipt || `RCPT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Support zero-payment testing / complimentary tree adoption
    if (dto.amount === 0) {
      const zeroOrderId = `order_zero_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      return {
        orderId: zeroOrderId,
        amount: 0,
        currency: 'INR',
        receipt,
        keyId: this.paymentGatewayService.getKeyId() || 'rzp_test_placeholder',
        isMock: true,
      };
    }

    const notes: Record<string, string> = {
      platform: 'PlantOn Agro',
      purpose: 'Tree Adoption & Living Forest Stewardship',
    };

    if (dto.treeSpecies) notes.treeSpecies = dto.treeSpecies;
    if (dto.quantity) notes.quantity = String(dto.quantity);
    if (dto.adopterEmail) notes.adopterEmail = dto.adopterEmail;

    return this.paymentGatewayService.createOrder({
      amount: dto.amount,
      receipt,
      currency: 'INR',
      notes,
    });
  }
}
