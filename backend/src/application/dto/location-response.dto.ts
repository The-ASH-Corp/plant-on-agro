import { Location, LocationStatus } from '../../core/entities/location.entity';

export interface LocationResponseDto {
  id: string;
  name: string;
  region: string;
  gps: string;
  areaHectares: number;
  capacity: number;
  treesPlanted: number;
  survivalRate: string;
  ndviScore: number;
  soilHealth: string;
  image: string;
  status: LocationStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class LocationResponseMapper {
  public static toDto(entity: Location): LocationResponseDto {
    return {
      id: entity.id || '',
      name: entity.name,
      region: entity.region,
      gps: entity.gps,
      areaHectares: entity.areaHectares,
      capacity: entity.capacity,
      treesPlanted: entity.treesPlanted,
      survivalRate: entity.survivalRate,
      ndviScore: entity.ndviScore,
      soilHealth: entity.soilHealth,
      image: entity.image,
      status: entity.status,
      isActive: entity.isActive,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
