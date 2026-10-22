import { Experience, ExperienceCategory } from '../entities/experience.entity';
import { Nullable } from '../../shared/types';

export interface ExperienceFilter {
  category?: ExperienceCategory | string;
  location?: string;
  isActive?: boolean;
  search?: string;
}

export interface IExperienceRepository {
  findById(id: string): Promise<Nullable<Experience>>;
  findBySlug(slug: string): Promise<Nullable<Experience>>;
  find(filter?: ExperienceFilter, skip?: number, limit?: number): Promise<Experience[]>;
  count(filter?: ExperienceFilter): Promise<number>;
  save(experience: Experience): Promise<Experience>;
  delete(id: string): Promise<boolean>;
}
