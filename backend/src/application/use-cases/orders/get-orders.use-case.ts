import {
  IOrderRepository,
  OrderFilter,
} from '../../../core/interfaces/order.repository.interface';
import { PaginatedResult } from '../../../shared/types';
import { OrderDto, OrderResponseMapper } from '../../dto/order.dto';

export class GetOrdersUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  public async execute(
    filter?: OrderFilter,
    limit = 50,
    skip = 0
  ): Promise<PaginatedResult<OrderDto>> {
    const safeLimit = Math.max(1, limit);
    const safeSkip = Math.max(0, skip);

    const [orders, total] = await Promise.all([
      this.orderRepository.findAll(filter, safeLimit, safeSkip),
      this.orderRepository.count(filter),
    ]);

    const page = Math.floor(safeSkip / safeLimit) + 1;
    const totalPages = Math.ceil(total / safeLimit) || 1;

    return {
      items: orders.map(OrderResponseMapper.toDto),
      total,
      page,
      limit: safeLimit,
      totalPages,
    };
  }
}
