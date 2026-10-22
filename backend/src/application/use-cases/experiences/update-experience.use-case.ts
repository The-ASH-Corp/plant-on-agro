import { IExperienceRepository } from '../../../core/interfaces/experience.repository.interface';
import { Experience, ExperienceProps } from '../../../core/entities/experience.entity';
import { NotFoundError } from '../../../core/errors/app-error';

export interface UpdateExperienceDto extends Partial<ExperienceProps> {}

export class UpdateExperienceUseCase {
  constructor(private readonly experienceRepository: IExperienceRepository) {}

  public async execute(id: string, dto: UpdateExperienceDto): Promise<Experience> {
    const experience = await this.experienceRepository.findById(id);
    if (!experience) {
      throw new NotFoundError(`Experience with ID ${id} not found.`);
    }

    experience.update(dto);
    return this.experienceRepository.save(experience);
  }
}
