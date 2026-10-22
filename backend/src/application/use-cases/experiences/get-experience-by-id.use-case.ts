import { IExperienceRepository } from '../../../core/interfaces/experience.repository.interface';
import { Experience } from '../../../core/entities/experience.entity';
import { NotFoundError } from '../../../core/errors/app-error';

export class GetExperienceByIdUseCase {
  constructor(private readonly experienceRepository: IExperienceRepository) {}

  public async execute(idOrSlug: string): Promise<Experience> {
    let experience = await this.experienceRepository.findById(idOrSlug);
    if (!experience) {
      experience = await this.experienceRepository.findBySlug(idOrSlug);
    }

    if (!experience) {
      throw new NotFoundError(`Experience with identifier '${idOrSlug}' not found.`);
    }

    return experience;
  }
}
