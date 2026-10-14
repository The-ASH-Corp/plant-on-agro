import { AdoptionPlan, OccasionDedication } from '../entities/adoption-plan.entity';
import { Nullable } from '../../shared/types';

export interface AdoptionPlanFilter {
  occasion?: OccasionDedication | string;
  search?: string;
  isActive?: boolean;
}

export interface IAdoptionPlanRepository {
  findById(id: string): Promise<Nullable<AdoptionPlan>>;
  findByLabel(label: string): Promise<Nullable<AdoptionPlan>>;
  findAll(filter?: AdoptionPlanFilter, limit?: number, skip?: number): Promise<AdoptionPlan[]>;
  count(filter?: AdoptionPlanFilter): Promise<number>;
  save(plan: AdoptionPlan): Promise<AdoptionPlan>;
  update(plan: AdoptionPlan): Promise<AdoptionPlan>;
  delete(id: string): Promise<boolean>;
}
