import {
  IPaymentGatewayService,
  PaymentOrderResult,
} from "../../../core/interfaces/payment-gateway.interface";
import { ITreeVarietyRepository } from "../../../core/interfaces/tree-variety.repository.interface";
import { IAdoptionPlanRepository } from "../../../core/interfaces/adoption-plan.repository.interface";
import { IOrderRepository } from "../../../core/interfaces/order.repository.interface";
import { Order } from "../../../core/entities/order.entity";
import { BadRequestError } from "../../../core/errors/app-error";

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
  amount?: number; // Custom donation amount or client-reported amount
  isDonation?: boolean;
}

export interface SecurePaymentOrderResult extends PaymentOrderResult {
  authoritativeTotal: number;
  orderNumber: string;
}

const MIN_VISION_DONATION_INR = 100;
const DONATION_PER_TREE_INR = 500;
const MAX_ORDER_QUANTITY = 10000;

export class CreateRazorpayOrderUseCase {
  constructor(
    private readonly paymentGatewayService: IPaymentGatewayService,
    private readonly treeVarietyRepository: ITreeVarietyRepository,
    private readonly adoptionPlanRepository: IAdoptionPlanRepository,
    private readonly orderRepository: IOrderRepository,
  ) {}

  public async execute(
    dto: CreateRazorpayOrderDto,
  ): Promise<SecurePaymentOrderResult> {
    const rawQty = Number(dto.quantity);
    if (dto.quantity !== undefined && (!Number.isFinite(rawQty) || rawQty < 1 || rawQty > MAX_ORDER_QUANTITY)) {
      throw new BadRequestError(
        `Tree quantity must be a valid number between 1 and ${MAX_ORDER_QUANTITY}.`,
      );
    }
    const requestedQty = Math.max(1, Math.floor(rawQty || 1));

    if (!dto.adopterEmail || !dto.adopterEmail.trim()) {
      throw new BadRequestError(
        "Adopter email is required to initiate an adoption payment order.",
      );
    }

    // 1. Resolve Authoritative Universal Tree Price and Randomly Allocate Tree from Server Database (All trees are same price)
    let unitTreePrice = 349;
    let selectedVarietyName = "Native Agroforestry Tree";
    let scientificName = "Indigenous Botanical Specimen";
    let category = "Native Trees";

    const allVarieties = await this.treeVarietyRepository.findAll({}, 50, 0);
    if (allVarieties.length > 0) {
      const activeVarieties = allVarieties.filter((v) => v.isActive !== false);
      const pool = activeVarieties.length > 0 ? activeVarieties : allVarieties;

      const firstWithPrice = pool.find(
        (v) => typeof v.price === "number" && v.price > 0,
      );
      if (firstWithPrice) {
        unitTreePrice = firstWithPrice.price;
      }

      // Resolve requested variety if specified by the user, otherwise default cleanly (no random allocation)
      if (dto.treeVarietyId && dto.treeVarietyId.trim().length > 0) {
        const found = await this.treeVarietyRepository.findById(
          dto.treeVarietyId.trim(),
        );
        if (found) {
          selectedVarietyName = found.commonName;
          scientificName = found.scientificName;
          category = found.category;
          if (found.price) unitTreePrice = found.price;
        }
      } else if (dto.treeSpecies && dto.treeSpecies.trim().length > 0) {
        selectedVarietyName = dto.treeSpecies.trim();
        const matched = pool.find(
          (v) =>
            v.commonName.toLowerCase() ===
            dto.treeSpecies!.trim().toLowerCase(),
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

    // 2. Resolve Plan Price from Server Database (Amount is strictly for the PLAN, NOT for the tree)
    let planPrice = 25000; // Default flagship retail plan (₹25,000 as per PDF)
    let selectedPlanLabel = dto.planLabel?.trim() || "10 Trees Retail Plan";
    let matchedDbPlan = false;

    const cleanPlanId = dto.planId?.trim() || "";
    const isDonationPlanId =
      cleanPlanId === "vision-2m-donation" || cleanPlanId === "donation";

    if (cleanPlanId.length > 0 && !isDonationPlanId) {
      const plan = await this.adoptionPlanRepository.findById(cleanPlanId);
      if (plan) {
        matchedDbPlan = true;
        planPrice =
          typeof plan.price === "number" && plan.price >= 0
            ? plan.price
            : typeof plan.priceModifier === "number" && plan.priceModifier >= 0
              ? plan.priceModifier
              : 0;
        selectedPlanLabel = plan.planLabel;
      }
    } else if (!dto.isDonation && dto.planLabel && dto.planLabel.trim().length > 0) {
      const plan = await this.adoptionPlanRepository.findByLabel(
        dto.planLabel.trim(),
      );
      if (plan) {
        matchedDbPlan = true;
        planPrice =
          typeof plan.price === "number" && plan.price >= 0
            ? plan.price
            : typeof plan.priceModifier === "number" && plan.priceModifier >= 0
              ? plan.priceModifier
              : 0;
        selectedPlanLabel = plan.planLabel;
      }
    }

    // Only allow Vision Donation mode when NOT targeting a real adoption plan
    const isVisionDonation =
      !matchedDbPlan && (Boolean(dto.isDonation) || isDonationPlanId);

    // 3. Authoritative Total Price & Quantity Calculation (Immune to client tampering)
    let effectiveQty = requestedQty;
    let authoritativeTotal: number;

    if (isVisionDonation) {
      const rawAmount = Number(dto.amount);
      if (!Number.isFinite(rawAmount) || Math.round(rawAmount) < MIN_VISION_DONATION_INR) {
        throw new BadRequestError(
          `Minimum 2M Trees Vision Campaign contribution is ₹${MIN_VISION_DONATION_INR}.`,
        );
      }

      authoritativeTotal = Math.round(rawAmount);
      const perTreeFloor = DONATION_PER_TREE_INR;
      const maxAllowedTreesForAmount = Math.max(
        1,
        Math.round(authoritativeTotal / perTreeFloor),
      );

      // Block attempts to claim arbitrary tree counts for a tiny donation amount
      if (dto.quantity !== undefined && requestedQty > maxAllowedTreesForAmount) {
        throw new BadRequestError(
          `Contribution amount ₹${authoritativeTotal} cannot sponsor ${requestedQty} trees (minimum ₹${perTreeFloor} per tree).`,
        );
      }

      effectiveQty = Math.max(1, Math.floor(authoritativeTotal / perTreeFloor));
      selectedPlanLabel = "2M Trees Vision Campaign";
    } else {
      const unitPrice = Math.max(1, planPrice);
      authoritativeTotal = unitPrice * effectiveQty;
    }

    if (authoritativeTotal <= 0) {
      throw new BadRequestError(
        "Calculated adoption price must be greater than zero.",
      );
    }

    const orderNumber =
      dto.receipt?.trim().toUpperCase() ||
      `POA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // 4. Pre-Create Order in MongoDB with 'Pending' Status
    let existingOrder =
      await this.orderRepository.findByOrderNumber(orderNumber);
    if (!existingOrder) {
      const pendingOrder = new Order({
        orderNumber,
        adopterName: dto.adopterName?.trim() || "Verified Adopter",
        adopterEmail: dto.adopterEmail.trim().toLowerCase(),
        adopterPhone: dto.adopterPhone?.trim() || "",
        treeSpecies: selectedVarietyName,
        scientificName,
        category,
        reserveName:
          dto.reserveLocation?.trim() ||
          "Flagship Living Forest — Wayanad, Kerala",
        planType: selectedPlanLabel,
        dedicationMessage: dto.dedicationMessage?.trim() || "",
        quantity: effectiveQty,
        totalAmount: authoritativeTotal,
        paymentMethod: "razorpay",
        paymentStatus: "Pending",
        status: "New Request",
        transactionRef: "",
      });
      existingOrder = await this.orderRepository.save(pendingOrder);
    }

    // 5. Create Order on Razorpay Gateway using Authoritative Server Total
    const rzpOrder = await this.paymentGatewayService.createOrder({
      amount: authoritativeTotal,
      receipt: orderNumber,
      currency: "INR",
      notes: {
        orderNumber,
        treeSpecies: selectedVarietyName,
        quantity: String(effectiveQty),
        adopterEmail: dto.adopterEmail.trim().toLowerCase(),
      },
    });

    // Link Razorpay Order ID to our internal Order
    existingOrder.updatePaymentStatus("Pending", rzpOrder.orderId);
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
