import {
  AdoptionPlan,
  OccasionDedication,
} from '../../core/entities/adoption-plan.entity';

export interface AdoptionPlanResponseDto {
  id: string;
  planLabel: string;
  icon: string;
  priceModifier: number;
  description: string;
  features: string[];
  occasionDedications: OccasionDedication[];
  badge: string;
  activeCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class AdoptionPlanResponseMapper {
  public static toDto(entity: AdoptionPlan): AdoptionPlanResponseDto {
    return {
      id: entity.id || '',
      planLabel: entity.planLabel,
      icon: entity.icon,
      priceModifier: entity.priceModifier,
      description: entity.description,
      features: entity.features,
      occasionDedications: entity.occasionDedications,
      badge: entity.badge,
      activeCount: entity.activeCount,
      isActive: entity.isActive,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
