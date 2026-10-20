import { ILocationRepository } from '../../../core/interfaces/location.repository.interface';
import {
  LocationResponseDto,
  LocationResponseMapper,
} from '../../dto/location-response.dto';

export class GetLocationByIdUseCase {
  constructor(private readonly locationRepository: ILocationRepository) {}

  public async execute(id: string): Promise<LocationResponseDto> {
    const location = await this.locationRepository.findById(id);
    if (!location) {
      throw new Error(`Plantation reserve location with ID ${id} not found`);
    }
    return LocationResponseMapper.toDto(location);
  }
}
