import { Location } from '../../../core/entities/location.entity';
import { ILocationDocument } from '../models/location.model';

export class LocationMapper {
  public static toDomain(doc: ILocationDocument): Location {
    return new Location({
      id: doc._id ? String(doc._id) : undefined,
      name: doc.name,
      region: doc.region,
      gps: doc.gps,
      areaHectares: doc.areaHectares,
      capacity: doc.capacity,
      treesPlanted: doc.treesPlanted,
      survivalRate: doc.survivalRate,
      ndviScore: doc.ndviScore,
      soilHealth: doc.soilHealth,
      image: doc.image,
      status: doc.status,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public static toPersistence(location: Location): Partial<ILocationDocument> {
    return {
      name: location.name,
      region: location.region,
      gps: location.gps,
      areaHectares: location.areaHectares,
      capacity: location.capacity,
      treesPlanted: location.treesPlanted,
      survivalRate: location.survivalRate,
      ndviScore: location.ndviScore,
      soilHealth: location.soilHealth,
      image: location.image,
      status: location.status,
      isActive: location.isActive,
    };
  }
}
