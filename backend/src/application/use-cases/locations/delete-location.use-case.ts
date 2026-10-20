import { ILocationRepository } from '../../../core/interfaces/location.repository.interface';

export class DeleteLocationUseCase {
  constructor(private readonly locationRepository: ILocationRepository) {}

  public async execute(id: string): Promise<boolean> {
    const existing = await this.locationRepository.findById(id);
    if (!existing) {
      throw new Error(`Plantation reserve location with ID ${id} not found`);
    }

    return this.locationRepository.delete(id);
  }
}
