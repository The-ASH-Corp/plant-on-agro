import { IVisitBookingRepository } from '../../../core/interfaces/visit-booking.repository.interface';
import { VisitBooking } from '../../../core/entities/visit-booking.entity';
import { NotFoundError } from '../../../core/errors/app-error';

export class GetVisitBookingByIdUseCase {
  constructor(private readonly visitBookingRepository: IVisitBookingRepository) {}

  public async execute(idOrRef: string): Promise<VisitBooking> {
    let booking = await this.visitBookingRepository.findById(idOrRef);
    if (!booking) {
      booking = await this.visitBookingRepository.findByReference(idOrRef);
    }

    if (!booking) {
      throw new NotFoundError(`Visit booking '${idOrRef}' not found.`);
    }

    return booking;
  }
}
