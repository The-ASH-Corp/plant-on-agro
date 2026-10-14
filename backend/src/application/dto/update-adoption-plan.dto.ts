import { OccasionDedication } from '../../core/entities/adoption-plan.entity';

export interface UpdateAdoptionPlanDto {
  planLabel?: string;
  icon?: string;
  priceModifier?: number;
  description?: string;
  features?: string[];
  occasionDedications?: OccasionDedication[];
  badge?: string;
  activeCount?: number;
  isActive?: boolean;
}
