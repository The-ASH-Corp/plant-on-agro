import {
  IVisitBookingRepository,
  VisitBookingFilter,
} from '../../../core/interfaces/visit-booking.repository.interface';
import { VisitBooking } from '../../../core/entities/visit-booking.entity';

export interface GetVisitBookingsQuery extends VisitBookingFilter {
  skip?: number;
  limit?: number;
}

export class GetVisitBookingsUseCase {
  constructor(private readonly visitBookingRepository: IVisitBookingRepository) {}

  public async execute(
    query?: GetVisitBookingsQuery
  ): Promise<{ items: VisitBooking[]; total: number }> {
    const skip = query?.skip ?? 0;
    const limit = query?.limit ?? 50;

    const filter: VisitBookingFilter = {};
    if (query?.status && query.status.toLowerCase() !== 'all') {
      filter.status = query.status;
    }
    if (query?.adopterEmail && query.adopterEmail.trim()) {
      filter.adopterEmail = query.adopterEmail.trim().toLowerCase();
    }
    if (query?.reserveName && query.reserveName.trim()) {
      filter.reserveName = query.reserveName.trim();
    }
    if (query?.experienceId && query.experienceId.trim()) {
      filter.experienceId = query.experienceId.trim();
    }
    if (query?.visitDate && query.visitDate.trim()) {
      filter.visitDate = query.visitDate.trim();
    }
    if (query?.search && query.search.trim()) {
      filter.search = query.search.trim();
    }

    const [items, total] = await Promise.all([
      this.visitBookingRepository.find(filter, skip, limit),
      this.visitBookingRepository.count(filter),
    ]);

    return { items, total };
  }
}

