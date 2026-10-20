import { IOrderRepository } from '../../../core/interfaces/order.repository.interface';

export class MarkOrdersReadUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  public async execute(): Promise<{ updatedCount: number }> {
    const updatedCount = await this.orderRepository.markAllAsRead();
    return { updatedCount };
  }
}
