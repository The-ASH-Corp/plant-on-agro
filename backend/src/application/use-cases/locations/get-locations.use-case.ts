import {
  ILocationRepository,
  LocationFilter,
} from '../../../core/interfaces/location.repository.interface';
import {
  LocationResponseDto,
  LocationResponseMapper,
} from '../../dto/location-response.dto';

export interface GetLocationsQuery {
  status?: string;
  search?: string;
  isActive?: boolean;
  limit?: number;
  skip?: number;
}

export interface GetLocationsResult {
  items: LocationResponseDto[];
  total: number;
  limit: number;
  skip: number;
}

export class GetLocationsUseCase {
  constructor(private readonly locationRepository: ILocationRepository) {}

  public async execute(query: GetLocationsQuery = {}): Promise<GetLocationsResult> {
    const limit = query.limit ?? 100;
    const skip = query.skip ?? 0;

    const filter: LocationFilter = {
      status: query.status,
      search: query.search,
      isActive: query.isActive,
    };

    const [locations, total] = await Promise.all([
      this.locationRepository.findAll(filter, limit, skip),
      this.locationRepository.count(filter),
    ]);

    return {
      items: locations.map(LocationResponseMapper.toDto),
      total,
      limit,
      skip,
    };
  }
}
