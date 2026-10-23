import { IVisitBookingRepository } from '../../../core/interfaces/visit-booking.repository.interface';
import { VisitBooking, VisitMemory } from '../../../core/entities/visit-booking.entity';
import { NotFoundError, ForbiddenError } from '../../../core/errors/app-error';
import { UserPayload } from '../../../core/interfaces/jwt-service.interface';

export interface AddVisitMemoriesDto {
  memories: VisitMemory[];
}

export class AddVisitMemoryUseCase {
  constructor(private readonly visitBookingRepository: IVisitBookingRepository) {}

  public async execute(
    id: string,
    dto: AddVisitMemoriesDto,
    user?: UserPayload
  ): Promise<VisitBooking> {
    const booking = await this.visitBookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundError(`Visit booking with ID ${id} not found.`);
    }

    // Only allow admin or the booking's registered buyer
    if (user && user.role !== 'admin') {
      const userEmail = user.email.trim().toLowerCase();
      const bookingEmail = booking.adopterEmail.trim().toLowerCase();
      if (userEmail !== bookingEmail) {
        throw new ForbiddenError(
          'You do not have permission to add memories to this visit booking.'
        );
      }
    }

    if (Array.isArray(dto.memories)) {
      for (const mem of dto.memories) {
        if (mem.imageUrl) {
          booking.addMemory(mem);
        }
      }
    }

    return this.visitBookingRepository.save(booking);
  }
}
