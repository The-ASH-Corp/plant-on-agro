import { LocationStatus } from '../../core/entities/location.entity';

export interface CreateLocationDto {
  name: string;
  region: string;
  gps: string;
  areaHectares: number;
  capacity: number;
  treesPlanted?: number;
  survivalRate?: string;
  ndviScore?: number;
  soilHealth?: string;
  image?: string;
  status?: LocationStatus;
}
