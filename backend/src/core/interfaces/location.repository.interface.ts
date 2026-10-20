import { Location, LocationStatus } from '../entities/location.entity';
import { Nullable } from '../../shared/types';

export interface LocationFilter {
  search?: string;
  status?: LocationStatus | string;
  isActive?: boolean;
}

export interface ILocationRepository {
  findById(id: string): Promise<Nullable<Location>>;
  findByName(name: string): Promise<Nullable<Location>>;
  findAll(filter?: LocationFilter, limit?: number, skip?: number): Promise<Location[]>;
  count(filter?: LocationFilter): Promise<number>;
  save(location: Location): Promise<Location>;
  update(location: Location): Promise<Location>;
  delete(id: string): Promise<boolean>;
}
