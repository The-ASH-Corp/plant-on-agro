import { IVisitBookingRepository } from '../../../core/interfaces/visit-booking.repository.interface';
import { VisitBooking, VisitBookingStatus } from '../../../core/entities/visit-booking.entity';
import { NotFoundError } from '../../../core/errors/app-error';

export interface UpdateVisitStatusDto {
  status: VisitBookingStatus;
  guideName?: string;
  notes?: string;
}

export class UpdateVisitStatusUseCase {
  constructor(private readonly visitBookingRepository: IVisitBookingRepository) {}

  public async execute(id: string, dto: UpdateVisitStatusDto): Promise<VisitBooking> {
    const booking = await this.visitBookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundError(`Visit booking with ID ${id} not found.`);
    }

    if (dto.status) {
      booking.updateStatus(dto.status);
    }
    if (dto.guideName !== undefined) {
      booking.updateGuide(dto.guideName);
    }

    return this.visitBookingRepository.save(booking);
  }
}
