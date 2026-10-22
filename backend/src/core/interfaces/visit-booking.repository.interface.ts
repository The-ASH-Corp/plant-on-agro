import { VisitBooking, VisitBookingStatus } from '../entities/visit-booking.entity';
import { Nullable } from '../../shared/types';

export interface VisitBookingFilter {
  status?: VisitBookingStatus | string;
  adopterEmail?: string;
  reserveName?: string;
  experienceId?: string;
  visitDate?: string;
  search?: string;
}

export interface IVisitBookingRepository {
  findById(id: string): Promise<Nullable<VisitBooking>>;
  findByReference(ref: string): Promise<Nullable<VisitBooking>>;
  findByEmail(email: string): Promise<VisitBooking[]>;
  find(filter?: VisitBookingFilter, skip?: number, limit?: number): Promise<VisitBooking[]>;
  count(filter?: VisitBookingFilter): Promise<number>;
  save(booking: VisitBooking): Promise<VisitBooking>;
  delete(id: string): Promise<boolean>;
}
