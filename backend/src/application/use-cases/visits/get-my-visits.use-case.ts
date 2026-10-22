import { IVisitBookingRepository } from '../../../core/interfaces/visit-booking.repository.interface';
import { VisitBooking } from '../../../core/entities/visit-booking.entity';

export class GetMyVisitsUseCase {
  constructor(private readonly visitBookingRepository: IVisitBookingRepository) {}

  public async execute(email: string): Promise<VisitBooking[]> {
    if (!email || email.trim().length === 0) {
      return [];
    }
    return this.visitBookingRepository.findByEmail(email.trim().toLowerCase());
  }
}
