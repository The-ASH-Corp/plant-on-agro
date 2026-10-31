import { Types } from 'mongoose';
import {
  IOrderRepository,
  OrderFilter,
} from '../../core/interfaces/order.repository.interface';
import { Order } from '../../core/entities/order.entity';
import { OrderModel } from '../database/models/order.model';
import { OrderMapper } from '../database/mappers/order.mapper';
import { Nullable } from '../../shared/types';

export class MongoOrderRepository implements IOrderRepository {
  private buildQuery(filter?: OrderFilter): Record<string, any> {
    const query: Record<string, any> = {};

    if (!filter) return query;

    if (filter.status && filter.status !== 'all' && filter.status !== 'All') {
      query.status = filter.status;
    }

    if (filter.paymentStatus && filter.paymentStatus !== 'all' && filter.paymentStatus !== 'All') {
      query.paymentStatus = filter.paymentStatus;
    }

    if (filter.adopterEmail && filter.adopterEmail.trim().length > 0) {
      query.adopterEmail = filter.adopterEmail.trim().toLowerCase();
    }

    if (filter.reserveName && filter.reserveName.trim().length > 0) {
      query.reserveName = filter.reserveName.trim();
    }

    if (filter.isRead !== undefined) {
      query.isRead = filter.isRead;
    }

    if (filter.search && filter.search.trim().length > 0) {
      const searchRegex = new RegExp(filter.search.trim(), 'i');
      query.$or = [
        { orderNumber: searchRegex },
        { invoiceNumber: searchRegex },
        { adopterName: searchRegex },
        { adopterEmail: searchRegex },
        { adopterPhone: searchRegex },
        { treeSpecies: searchRegex },
        { reserveName: searchRegex },
        { planType: searchRegex },
        { certificateId: searchRegex },
        { transactionRef: searchRegex },
      ];
    }

    return query;
  }

  public async findById(id: string): Promise<Nullable<Order>> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await OrderModel.findById(id).exec();
    if (!doc) return null;
    return OrderMapper.toDomain(doc);
  }

  public async findByOrderNumber(orderNumber: string): Promise<Nullable<Order>> {
    const doc = await OrderModel.findOne({
      orderNumber: orderNumber.trim().toUpperCase(),
    }).exec();
    if (!doc) return null;
    return OrderMapper.toDomain(doc);
  }

  public async findByTransactionRef(transactionRef: string): Promise<Nullable<Order>> {
    const trimmed = transactionRef.trim();
    const doc = await OrderModel.findOne({
      $or: [
        { transactionRef: trimmed },
        { transactionRef: { $regex: trimmed, $options: 'i' } },
      ],
    }).exec();
    if (!doc) return null;
    return OrderMapper.toDomain(doc);
  }

  public async findAll(
    filter?: OrderFilter,
    limit = 50,
    skip = 0
  ): Promise<Order[]> {
    const query = this.buildQuery(filter);
    const docs = await OrderModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    return docs.map(OrderMapper.toDomain);
  }

  public async count(filter?: OrderFilter): Promise<number> {
    const query = this.buildQuery(filter);
    return OrderModel.countDocuments(query).exec();
  }

  public async save(order: Order): Promise<Order> {
    const persistenceData = OrderMapper.toPersistence(order);
    const doc = await OrderModel.create(persistenceData);
    return OrderMapper.toDomain(doc);
  }

  public async update(order: Order): Promise<Order> {
    if (!order.id) {
      throw new Error('Cannot update order without an ID');
    }
    const persistenceData = OrderMapper.toPersistence(order);
    const doc = await OrderModel.findByIdAndUpdate(order.id, persistenceData, {
      returnDocument: 'after',
    }).exec();

    if (!doc) {
      throw new Error(`Order with ID ${order.id} not found`);
    }

    return OrderMapper.toDomain(doc);
  }

  public async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await OrderModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  public async markAllAsRead(): Promise<number> {
    const result = await OrderModel.updateMany(
      { isRead: false },
      { $set: { isRead: true } }
    ).exec();
    return result.modifiedCount || 0;
  }
}
