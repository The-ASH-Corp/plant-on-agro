import { TreeCategory } from '../../core/entities/tree-variety.entity';

export interface CreateTreeVarietyDto {
  commonName: string;
  scientificName: string;
  category: TreeCategory;
  price: number;
  co2AbsorptionRateKgYear: number;
  growthTimeline: string;
  careRequirements: string;
  coverImages?: string[];
  location?: string;
  description?: string;
}
