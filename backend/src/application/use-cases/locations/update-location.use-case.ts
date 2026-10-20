import { ILocationRepository } from '../../../core/interfaces/location.repository.interface';
import { UpdateLocationDto } from '../../dto/update-location.dto';
import {
  LocationResponseDto,
  LocationResponseMapper,
} from '../../dto/location-response.dto';

export class UpdateLocationUseCase {
  constructor(private readonly locationRepository: ILocationRepository) {}

  public async execute(id: string, input: UpdateLocationDto): Promise<LocationResponseDto> {
    const location = await this.locationRepository.findById(id);
    if (!location) {
      throw new Error(`Plantation reserve location with ID ${id} not found`);
    }

    if (input.name && input.name.trim() !== location.name) {
      const existing = await this.locationRepository.findByName(input.name);
      if (existing && existing.id !== id) {
        throw new Error(`Another plantation reserve with name "${input.name}" already exists`);
      }
    }

    location.update({
      name: input.name,
      region: input.region,
      gps: input.gps,
      areaHectares: input.areaHectares,
      capacity: input.capacity,
      treesPlanted: input.treesPlanted,
      survivalRate: input.survivalRate,
      ndviScore: input.ndviScore,
      soilHealth: input.soilHealth,
      image: input.image,
      status: input.status,
      isActive: input.isActive,
    });

    const updated = await this.locationRepository.update(location);
    return LocationResponseMapper.toDto(updated);
  }
}
