import { IVisitBookingRepository } from '../../../core/interfaces/visit-booking.repository.interface';
import { VisitBooking, VisitMemory } from '../../../core/entities/visit-booking.entity';
import { NotFoundError } from '../../../core/errors/app-error';

export interface AddVisitMemoriesDto {
  memories: VisitMemory[];
}

export class AddVisitMemoryUseCase {
  constructor(private readonly visitBookingRepository: IVisitBookingRepository) {}

  public async execute(id: string, dto: AddVisitMemoriesDto): Promise<VisitBooking> {
    const booking = await this.visitBookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundError(`Visit booking with ID ${id} not found.`);
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
