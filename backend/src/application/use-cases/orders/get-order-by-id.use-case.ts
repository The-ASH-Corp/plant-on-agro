import { IOrderRepository } from '../../../core/interfaces/order.repository.interface';
import { OrderDto, OrderResponseMapper } from '../../dto/order.dto';

export class GetOrderByIdUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  public async execute(id: string): Promise<OrderDto> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error(`Order with ID "${id}" not found`);
    }
    return OrderResponseMapper.toDto(order);
  }
}
