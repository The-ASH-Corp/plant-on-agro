import { TreeVariety, TreeCategory } from '../../core/entities/tree-variety.entity';

export interface TreeVarietyResponseDto {
  id: string;
  commonName: string;
  scientificName: string;
  category: TreeCategory;
  price: number;
  co2AbsorptionRateKgYear: number;
  growthTimeline: string;
  careRequirements: string;
  coverImages: string[];
  location: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class TreeVarietyResponseMapper {
  public static toDto(entity: TreeVariety): TreeVarietyResponseDto {
    return {
      id: entity.id || '',
      commonName: entity.commonName,
      scientificName: entity.scientificName,
      category: entity.category,
      price: entity.price,
      co2AbsorptionRateKgYear: entity.co2AbsorptionRateKgYear,
      growthTimeline: entity.growthTimeline,
      careRequirements: entity.careRequirements,
      coverImages: entity.coverImages,
      location: entity.location,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
