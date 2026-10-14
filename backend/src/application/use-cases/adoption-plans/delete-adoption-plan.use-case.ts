import { IAdoptionPlanRepository } from '../../../core/interfaces/adoption-plan.repository.interface';
import { NotFoundError } from '../../../core/errors/app-error';

export class DeleteAdoptionPlanUseCase {
  constructor(private readonly adoptionPlanRepository: IAdoptionPlanRepository) {}

  public async execute(id: string): Promise<boolean> {
    const existingPlan = await this.adoptionPlanRepository.findById(id);
    if (!existingPlan) {
      throw new NotFoundError(`Adoption plan with ID '${id}' not found`);
    }

    return this.adoptionPlanRepository.delete(id);
  }
}
