import { IAdoptionPlanRepository } from '../../../core/interfaces/adoption-plan.repository.interface';
import { AdoptionPlan } from '../../../core/entities/adoption-plan.entity';
import { CreateAdoptionPlanDto } from '../../dto/create-adoption-plan.dto';
import {
  AdoptionPlanResponseDto,
  AdoptionPlanResponseMapper,
} from '../../dto/adoption-plan-response.dto';

export class CreateAdoptionPlanUseCase {
  constructor(private readonly adoptionPlanRepository: IAdoptionPlanRepository) {}

  public async execute(input: CreateAdoptionPlanDto): Promise<AdoptionPlanResponseDto> {
    const existing = await this.adoptionPlanRepository.findByLabel(input.planLabel);
    if (existing) {
      throw new Error(`An adoption plan with label "${input.planLabel}" already exists`);
    }

    const plan = new AdoptionPlan({
      planLabel: input.planLabel,
      icon: input.icon ?? '🌱',
      priceModifier: input.priceModifier ?? 0,
      description: input.description,
      features: input.features ?? [],
      occasionDedications: input.occasionDedications ?? ['general'],
      badge: input.badge ?? 'Standard',
      activeCount: input.activeCount ?? 0,
      isActive: true,
    });

    const savedPlan = await this.adoptionPlanRepository.save(plan);
    return AdoptionPlanResponseMapper.toDto(savedPlan);
  }
}
