import { ILocationRepository } from '../../../core/interfaces/location.repository.interface';
import { Location } from '../../../core/entities/location.entity';
import { CreateLocationDto } from '../../dto/create-location.dto';
import {
  LocationResponseDto,
  LocationResponseMapper,
} from '../../dto/location-response.dto';

export class CreateLocationUseCase {
  constructor(private readonly locationRepository: ILocationRepository) {}

  public async execute(input: CreateLocationDto): Promise<LocationResponseDto> {
    const existing = await this.locationRepository.findByName(input.name);
    if (existing) {
      throw new Error(`A plantation reserve with the name "${input.name}" already exists`);
    }

    const location = new Location({
      name: input.name,
      region: input.region,
      gps: input.gps,
      areaHectares: input.areaHectares,
      capacity: input.capacity,
      treesPlanted: input.treesPlanted ?? 0,
      survivalRate: input.survivalRate,
      ndviScore: input.ndviScore,
      soilHealth: input.soilHealth,
      image: input.image,
      status: input.status ?? 'Active',
      isActive: true,
    });

    const savedLocation = await this.locationRepository.save(location);
    return LocationResponseMapper.toDto(savedLocation);
  }
}
