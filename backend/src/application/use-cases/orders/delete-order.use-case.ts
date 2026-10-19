import { IOrderRepository } from '../../../core/interfaces/order.repository.interface';

export class DeleteOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  public async execute(id: string): Promise<boolean> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error(`Order with ID "${id}" not found`);
    }
    return this.orderRepository.delete(id);
  }
}
