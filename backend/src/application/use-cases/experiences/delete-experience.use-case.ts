import { IExperienceRepository } from '../../../core/interfaces/experience.repository.interface';
import { NotFoundError } from '../../../core/errors/app-error';

export class DeleteExperienceUseCase {
  constructor(private readonly experienceRepository: IExperienceRepository) {}

  public async execute(id: string): Promise<boolean> {
    const existing = await this.experienceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Experience with ID ${id} not found.`);
    }

    return this.experienceRepository.delete(id);
  }
}
