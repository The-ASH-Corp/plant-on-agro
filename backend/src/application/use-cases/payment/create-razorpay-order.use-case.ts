import {
  IPaymentGatewayService,
  PaymentOrderResult,
} from '../../../core/interfaces/payment-gateway.interface';
import { ITreeVarietyRepository } from '../../../core/interfaces/tree-variety.repository.interface';
import { IAdoptionPlanRepository } from '../../../core/interfaces/adoption-plan.repository.interface';
import { IOrderRepository } from '../../../core/interfaces/order.repository.interface';
import { Order } from '../../../core/entities/order.entity';
import { BadRequestError } from '../../../core/errors/app-error';

export interface CreateRazorpayOrderDto {
  treeVarietyId?: string;
  treeSpecies?: string;
  planId?: string;
  planLabel?: string;
  quantity?: number;
  reserveLocation?: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone?: string;
  dedicationMessage?: string;
  receipt?: string;
  amount?: number; // Optional client-reported amount, strictly overridden by authoritative server calculation
}

export interface SecurePaymentOrderResult extends PaymentOrderResult {
  authoritativeTotal: number;
  orderNumber: string;
}

export class CreateRazorpayOrderUseCase {
  constructor(
    private readonly paymentGatewayService: IPaymentGatewayService,
    private readonly treeVarietyRepository: ITreeVarietyRepository,
    private readonly adoptionPlanRepository: IAdoptionPlanRepository,
    private readonly orderRepository: IOrderRepository
  ) {}

  public async execute(dto: CreateRazorpayOrderDto): Promise<SecurePaymentOrderResult> {
    const qty = Math.max(1, Math.floor(Number(dto.quantity) || 1));

    if (!dto.adopterEmail || !dto.adopterEmail.trim()) {
      throw new BadRequestError('Adopter email is required to initiate an adoption payment order.');
    }

    // 1. Resolve Authoritative Universal Tree Price and Randomly Allocate Tree from Server Database (All trees are same price)
    let unitTreePrice = 349;
    let selectedVarietyName = 'Native Agroforestry Tree';
    let scientificName = 'Indigenous Botanical Specimen';
    let category = 'Native Trees';

    const allVarieties = await this.treeVarietyRepository.findAll({}, 50, 0);
    if (allVarieties.length > 0) {
      const activeVarieties = allVarieties.filter((v) => v.isActive !== false);
      const pool = activeVarieties.length > 0 ? activeVarieties : allVarieties;

      const firstWithPrice = pool.find((v) => typeof v.price === 'number' && v.price > 0);
      if (firstWithPrice) {
        unitTreePrice = firstWithPrice.price;
      }

      // Resolve requested variety if specified by the user, otherwise default cleanly (no random allocation)
      if (dto.treeVarietyId && dto.treeVarietyId.trim().length > 0) {
        const found = await this.treeVarietyRepository.findById(dto.treeVarietyId.trim());
        if (found) {
          selectedVarietyName = found.commonName;
          scientificName = found.scientificName;
          category = found.category;
          if (found.price) unitTreePrice = found.price;
        }
      } else if (dto.treeSpecies && dto.treeSpecies.trim().length > 0) {
        selectedVarietyName = dto.treeSpecies.trim();
        const matched = pool.find(
          (v) => v.commonName.toLowerCase() === dto.treeSpecies!.trim().toLowerCase()
        );
        if (matched) {
          scientificName = matched.scientificName;
          category = matched.category;
          if (matched.price) unitTreePrice = matched.price;
        }
      } else {
        selectedVarietyName = pool[0].commonName;
        scientificName = pool[0].scientificName;
        category = pool[0].category;
      }
    }

    // 2. Resolve Plan Price Modifier from Server Database
    let planModifier = 0;
    let selectedPlanLabel = dto.planLabel?.trim() || 'Individual Lifetime';

    if (dto.planId && dto.planId.trim().length > 0) {
      const plan = await this.adoptionPlanRepository.findById(dto.planId.trim());
      if (plan) {
        planModifier = plan.priceModifier;
        selectedPlanLabel = plan.planLabel;
      }
    } else if (dto.planLabel && dto.planLabel.trim().length > 0) {
      const plan = await this.adoptionPlanRepository.findByLabel(dto.planLabel.trim());
      if (plan) {
        planModifier = plan.priceModifier;
        selectedPlanLabel = plan.planLabel;
      }
    }

    // 3. Authoritative Total Price Calculation (Immune to client tampering)
    const unitPrice = Math.max(1, unitTreePrice + planModifier);
    const authoritativeTotal = unitPrice * qty;

    if (authoritativeTotal <= 0) {
      throw new BadRequestError('Calculated adoption price must be greater than zero.');
    }

    const orderNumber =
      dto.receipt?.trim().toUpperCase() ||
      `POA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // 4. Pre-Create Order in MongoDB with 'Pending' Status
    let existingOrder = await this.orderRepository.findByOrderNumber(orderNumber);
    if (!existingOrder) {
      const pendingOrder = new Order({
        orderNumber,
        adopterName: dto.adopterName?.trim() || 'Verified Adopter',
        adopterEmail: dto.adopterEmail.trim().toLowerCase(),
        adopterPhone: dto.adopterPhone?.trim() || '',
        treeSpecies: selectedVarietyName,
        scientificName,
        category,
        reserveName: dto.reserveLocation?.trim() || 'Flagship Living Forest — Wayanad, Kerala',
        planType: selectedPlanLabel,
        dedicationMessage: dto.dedicationMessage?.trim() || '',
        quantity: qty,
        totalAmount: authoritativeTotal,
        paymentMethod: 'razorpay',
        paymentStatus: 'Pending',
        status: 'New Request',
        transactionRef: '',
      });
      existingOrder = await this.orderRepository.save(pendingOrder);
    }

    // 5. Create Order on Razorpay Gateway using Authoritative Server Total
    const rzpOrder = await this.paymentGatewayService.createOrder({
      amount: authoritativeTotal,
      receipt: orderNumber,
      currency: 'INR',
      notes: {
        orderNumber,
        treeSpecies: selectedVarietyName,
        quantity: String(qty),
        adopterEmail: dto.adopterEmail.trim().toLowerCase(),
      },
    });

    // Link Razorpay Order ID to our internal Order
    existingOrder.updatePaymentStatus('Pending', rzpOrder.orderId);
    await this.orderRepository.update(existingOrder);

    return {
      orderId: rzpOrder.orderId,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      receipt: rzpOrder.receipt,
      keyId: rzpOrder.keyId,
      isMock: rzpOrder.isMock,
      authoritativeTotal,
      orderNumber,
    };
  }
}
