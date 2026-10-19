import { Order, AdoptionOrderStatus, PaymentStatus } from '../entities/order.entity';
import { Nullable } from '../../shared/types';

export interface OrderFilter {
  status?: AdoptionOrderStatus | string;
  paymentStatus?: PaymentStatus | string;
  search?: string;
  adopterEmail?: string;
  reserveName?: string;
  isRead?: boolean;
}

export interface IOrderRepository {
  findById(id: string): Promise<Nullable<Order>>;
  findByOrderNumber(orderNumber: string): Promise<Nullable<Order>>;
  findAll(filter?: OrderFilter, limit?: number, skip?: number): Promise<Order[]>;
  count(filter?: OrderFilter): Promise<number>;
  save(order: Order): Promise<Order>;
  update(order: Order): Promise<Order>;
  delete(id: string): Promise<boolean>;
  markAllAsRead(): Promise<number>;
}
