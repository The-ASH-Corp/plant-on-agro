import { IOrderRepository } from '../../../core/interfaces/order.repository.interface';
import { AdoptionOrderStatus } from '../../../core/entities/order.entity';
import { OrderDto, OrderResponseMapper } from '../../dto/order.dto';

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  public async execute(
    idOrNumber: string,
    status: AdoptionOrderStatus,
    notes?: string,
    gpsCoords?: string
  ): Promise<OrderDto> {
    let order = await this.orderRepository.findById(idOrNumber);
    if (!order) {
      const cleanNumber = idOrNumber.replace(/^ord-/i, '');
      order = await this.orderRepository.findByOrderNumber(cleanNumber);
    }

    if (!order) {
      throw new Error(`Order with identifier "${idOrNumber}" not found`);
    }

    order.updateStatus(status);
    if (notes) {
      order.updateNotes(notes);
    }
    if (gpsCoords) {
      order.updateGpsCoords(gpsCoords);
    }

    const updated = await this.orderRepository.update(order);
    return OrderResponseMapper.toDto(updated);
  }
}
