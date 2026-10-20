import { IOrderRepository } from '../../../core/interfaces/order.repository.interface';
import { Order } from '../../../core/entities/order.entity';
import { CreateOrderDto, OrderDto, OrderResponseMapper } from '../../dto/order.dto';

export class CreateOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  public async execute(input: CreateOrderDto): Promise<OrderDto> {
    const orderNumber =
      input.orderNumber?.trim().toUpperCase() ||
      `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const existing = await this.orderRepository.findByOrderNumber(orderNumber);
    if (existing) {
      throw new Error(`An order with number "${orderNumber}" already exists`);
    }

    const invoiceNumber =
      input.invoiceNumber?.trim().toUpperCase() ||
      `INV-${new Date().getFullYear()}-${orderNumber.replace(/^ORD-?/, '')}`;

    const order = new Order({
      orderNumber,
      invoiceNumber,
      adopterName: input.adopterName,
      adopterEmail: input.adopterEmail,
      adopterPhone: input.adopterPhone,
      billingAddress: input.billingAddress,
      items: input.items,
      treeSpecies: input.treeSpecies,
      scientificName: input.scientificName,
      category: input.category,
      reserveName: input.reserveName,
      gpsCoords: input.gpsCoords,
      planType: input.planType,
      dedicationMessage: input.dedicationMessage,
      quantity: input.quantity,
      totalAmount: input.totalAmount,
      paymentMethod: input.paymentMethod || 'sandbox',
      paymentStatus: input.paymentStatus || 'Paid',
      transactionRef: input.transactionRef,
      status: input.status || 'New Request',
      certificateId: input.certificateId || `CERT-${orderNumber}`,
      ndviScore: input.ndviScore !== undefined ? input.ndviScore : 0.91,
      isRead: input.isRead !== undefined ? input.isRead : false,
      notes: input.notes,
      datePlanted: input.datePlanted ? new Date(input.datePlanted) : new Date(),
    });

    const saved = await this.orderRepository.save(order);
    return OrderResponseMapper.toDto(saved);
  }
}
