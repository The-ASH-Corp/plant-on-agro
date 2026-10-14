import {
  IAdoptionPlanRepository,
  AdoptionPlanFilter,
} from '../../../core/interfaces/adoption-plan.repository.interface';
import {
  AdoptionPlanResponseDto,
  AdoptionPlanResponseMapper,
} from '../../dto/adoption-plan-response.dto';

export interface GetAdoptionPlansQuery {
  occasion?: string;
  search?: string;
  isActive?: boolean;
  limit?: number;
  skip?: number;
}

export interface GetAdoptionPlansResult {
  items: AdoptionPlanResponseDto[];
  total: number;
  limit: number;
  skip: number;
}

export class GetAdoptionPlansUseCase {
  constructor(private readonly adoptionPlanRepository: IAdoptionPlanRepository) {}

  public async execute(query: GetAdoptionPlansQuery = {}): Promise<GetAdoptionPlansResult> {
    const limit = query.limit ?? 50;
    const skip = query.skip ?? 0;

    const filter: AdoptionPlanFilter = {
      occasion: query.occasion,
      search: query.search,
      isActive: query.isActive,
    };

    const [plans, total] = await Promise.all([
      this.adoptionPlanRepository.findAll(filter, limit, skip),
      this.adoptionPlanRepository.count(filter),
    ]);

    return {
      items: plans.map(AdoptionPlanResponseMapper.toDto),
      total,
      limit,
      skip,
    };
  }
}
