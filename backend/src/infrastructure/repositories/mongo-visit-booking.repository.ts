import {
  IVisitBookingRepository,
  VisitBookingFilter,
} from '../../core/interfaces/visit-booking.repository.interface';
import { VisitBooking } from '../../core/entities/visit-booking.entity';
import { VisitBookingModel } from '../database/models/visit-booking.model';
import { VisitBookingMapper } from '../database/mappers/visit-booking.mapper';
import { Nullable } from '../../shared/types';

/**
 * MongoVisitBookingRepository
 * Pure data access layer - handles database interactions only without business logic.
 */
export class MongoVisitBookingRepository implements IVisitBookingRepository {
  public async findById(id: string): Promise<Nullable<VisitBooking>> {
    const doc = await VisitBookingModel.findById(id).exec();
    return doc ? VisitBookingMapper.toDomain(doc) : null;
  }

  public async findByReference(ref: string): Promise<Nullable<VisitBooking>> {
    const doc = await VisitBookingModel.findOne({ bookingReference: ref }).exec();
    return doc ? VisitBookingMapper.toDomain(doc) : null;
  }

  public async findByEmail(email: string): Promise<VisitBooking[]> {
    const docs = await VisitBookingModel.find({ adopterEmail: email })
      .sort({ visitDate: -1, createdAt: -1 })
      .exec();
    return docs.map(VisitBookingMapper.toDomain);
  }

  public async find(
    filter?: VisitBookingFilter,
    skip: number = 0,
    limit: number = 50
  ): Promise<VisitBooking[]> {
    const query = this.toQuery(filter);
    const docs = await VisitBookingModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    return docs.map(VisitBookingMapper.toDomain);
  }

  public async count(filter?: VisitBookingFilter): Promise<number> {
    const query = this.toQuery(filter);
    return VisitBookingModel.countDocuments(query).exec();
  }

  public async save(booking: VisitBooking): Promise<VisitBooking> {
    const persistenceData = VisitBookingMapper.toPersistence(booking);

    if (booking.id) {
      const updated = await VisitBookingModel.findByIdAndUpdate(
        booking.id,
        { $set: persistenceData },
        { returnDocument: 'after' }
      ).exec();

      return updated ? VisitBookingMapper.toDomain(updated) : booking;
    }

    const created = await VisitBookingModel.create(persistenceData);
    return VisitBookingMapper.toDomain(created);
  }

  public async delete(id: string): Promise<boolean> {
    const result = await VisitBookingModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  private toQuery(filter?: VisitBookingFilter): Record<string, any> {
    if (!filter) return {};
    const query: Record<string, any> = {};

    if (filter.status) query.status = filter.status;
    if (filter.adopterEmail) query.adopterEmail = filter.adopterEmail;
    if (filter.reserveName) query.reserveName = filter.reserveName;
    if (filter.experienceId) query.experienceId = filter.experienceId;
    if (filter.visitDate) query.visitDate = filter.visitDate;

    if (filter.search) {
      const regex = new RegExp(filter.search, 'i');
      query.$or = [
        { bookingReference: regex },
        { adopterName: regex },
        { adopterEmail: regex },
        { reserveName: regex },
        { experienceTitle: regex },
      ];
    }

    return query;
  }
}
