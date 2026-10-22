import {
  IExperienceRepository,
  ExperienceFilter,
} from '../../../core/interfaces/experience.repository.interface';
import { Experience } from '../../../core/entities/experience.entity';

export interface GetExperiencesQuery extends ExperienceFilter {
  skip?: number;
  limit?: number;
}

export class GetExperiencesUseCase {
  constructor(private readonly experienceRepository: IExperienceRepository) {}

  public async execute(
    query?: GetExperiencesQuery
  ): Promise<{ items: Experience[]; total: number }> {
    const skip = query?.skip ?? 0;
    const limit = query?.limit ?? 50;

    const filter: ExperienceFilter = {};
    if (query?.category && query.category.toLowerCase() !== 'all') {
      filter.category = query.category;
    }
    if (query?.location && query.location.trim()) {
      filter.location = query.location.trim();
    }
    if (query?.isActive !== undefined) {
      filter.isActive = query.isActive;
    }
    if (query?.search && query.search.trim()) {
      filter.search = query.search.trim();
    }

    const [items, total] = await Promise.all([
      this.experienceRepository.find(filter, skip, limit),
      this.experienceRepository.count(filter),
    ]);

    return { items, total };
  }
}

