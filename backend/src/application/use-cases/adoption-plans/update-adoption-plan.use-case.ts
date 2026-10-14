import { IAdoptionPlanRepository } from '../../../core/interfaces/adoption-plan.repository.interface';
import { NotFoundError } from '../../../core/errors/app-error';
import { UpdateAdoptionPlanDto } from '../../dto/update-adoption-plan.dto';
import {
  AdoptionPlanResponseDto,
  AdoptionPlanResponseMapper,
} from '../../dto/adoption-plan-response.dto';

export class UpdateAdoptionPlanUseCase {
  constructor(private readonly adoptionPlanRepository: IAdoptionPlanRepository) {}

  public async execute(
    id: string,
    input: UpdateAdoptionPlanDto
  ): Promise<AdoptionPlanResponseDto> {
    const existingPlan = await this.adoptionPlanRepository.findById(id);
    if (!existingPlan) {
      throw new NotFoundError(`Adoption plan with ID '${id}' not found`);
    }

    if (input.planLabel && input.planLabel.trim() !== existingPlan.planLabel) {
      const duplicate = await this.adoptionPlanRepository.findByLabel(input.planLabel);
      if (duplicate && duplicate.id !== id) {
        throw new Error(`An adoption plan with label "${input.planLabel}" already exists`);
      }
    }

    existingPlan.update(input);

    const updatedPlan = await this.adoptionPlanRepository.update(existingPlan);
    return AdoptionPlanResponseMapper.toDto(updatedPlan);
  }
}
