import {
  Order,
  AdoptionOrderStatus,
  PaymentStatus,
  OrderItem,
  BillingAddress,
} from '../../core/entities/order.entity';

export interface OrderDto {
  id: string;
  orderNumber: string;
  invoiceNumber: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone: string;
  billingAddress: BillingAddress;
  items: OrderItem[];
  treeSpecies: string;
  scientificName: string;
  category: string;
  reserveName: string;
  gpsCoords: string;
  planType: string;
  dedicationMessage: string;
  quantity: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  transactionRef: string;
  status: AdoptionOrderStatus;
  certificateId: string;
  ndviScore: number;
  isRead: boolean;
  notes: string;
  datePlanted: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  orderNumber?: string;
  invoiceNumber?: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone?: string;
  billingAddress?: BillingAddress;
  items?: OrderItem[];
  treeSpecies: string;
  scientificName?: string;
  category?: string;
  reserveName: string;
  gpsCoords?: string;
  planType: string;
  dedicationMessage?: string;
  quantity: number;
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus?: PaymentStatus;
  transactionRef?: string;
  status?: AdoptionOrderStatus;
  certificateId?: string;
  ndviScore?: number;
  isRead?: boolean;
  notes?: string;
  datePlanted?: string;
}

export interface UpdateOrderStatusDto {
  status: AdoptionOrderStatus;
  notes?: string;
  gpsCoords?: string;
}

export class OrderResponseMapper {
  public static toDto(entity: Order): OrderDto {
    return {
      id: entity.id || '',
      orderNumber: entity.orderNumber,
      invoiceNumber: entity.invoiceNumber,
      adopterName: entity.adopterName,
      adopterEmail: entity.adopterEmail,
      adopterPhone: entity.adopterPhone,
      billingAddress: {
        street: entity.billingAddress?.street || '',
        city: entity.billingAddress?.city || '',
        state: entity.billingAddress?.state || '',
        country: entity.billingAddress?.country || 'India',
        postalCode: entity.billingAddress?.postalCode || '',
      },
      items: entity.items || [],
      treeSpecies: entity.treeSpecies,
      scientificName: entity.scientificName,
      category: entity.category,
      reserveName: entity.reserveName,
      gpsCoords: entity.gpsCoords,
      planType: entity.planType,
      dedicationMessage: entity.dedicationMessage,
      quantity: entity.quantity,
      totalAmount: entity.totalAmount,
      paymentMethod: entity.paymentMethod,
      paymentStatus: entity.paymentStatus,
      transactionRef: entity.transactionRef,
      status: entity.status,
      certificateId: entity.certificateId,
      ndviScore: entity.ndviScore,
      isRead: entity.isRead,
      notes: entity.notes,
      datePlanted: entity.datePlanted.toISOString(),
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
