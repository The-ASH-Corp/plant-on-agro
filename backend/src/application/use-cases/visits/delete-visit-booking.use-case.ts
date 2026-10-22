import { IVisitBookingRepository } from '../../../core/interfaces/visit-booking.repository.interface';
import { NotFoundError } from '../../../core/errors/app-error';

export class DeleteVisitBookingUseCase {
  constructor(private readonly visitBookingRepository: IVisitBookingRepository) {}

  public async execute(id: string): Promise<boolean> {
    const existing = await this.visitBookingRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Visit booking with ID ${id} not found.`);
    }

    return this.visitBookingRepository.delete(id);
  }
}
