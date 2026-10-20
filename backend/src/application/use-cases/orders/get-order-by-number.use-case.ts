import { IOrderRepository } from '../../../core/interfaces/order.repository.interface';
import { OrderDto, OrderResponseMapper } from '../../dto/order.dto';

export class GetOrderByNumberUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  public async execute(orderNumber: string): Promise<OrderDto> {
    const order = await this.orderRepository.findByOrderNumber(orderNumber);
    if (!order) {
      throw new Error(`Order with number "${orderNumber}" not found`);
    }
    return OrderResponseMapper.toDto(order);
  }
}
