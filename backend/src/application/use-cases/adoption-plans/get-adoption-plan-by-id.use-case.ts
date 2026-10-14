import { IAdoptionPlanRepository } from '../../../core/interfaces/adoption-plan.repository.interface';
import { NotFoundError } from '../../../core/errors/app-error';
import {
  AdoptionPlanResponseDto,
  AdoptionPlanResponseMapper,
} from '../../dto/adoption-plan-response.dto';

export class GetAdoptionPlanByIdUseCase {
  constructor(private readonly adoptionPlanRepository: IAdoptionPlanRepository) {}

  public async execute(id: string): Promise<AdoptionPlanResponseDto> {
    const plan = await this.adoptionPlanRepository.findById(id);
    if (!plan) {
      throw new NotFoundError(`Adoption plan with ID '${id}' not found`);
    }

    return AdoptionPlanResponseMapper.toDto(plan);
  }
}
