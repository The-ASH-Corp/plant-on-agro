import { ITreeVarietyRepository } from '../../../core/interfaces/tree-variety.repository.interface';
import { TreeVariety } from '../../../core/entities/tree-variety.entity';
import { ConflictError } from '../../../core/errors/app-error';
import { CreateTreeVarietyDto } from '../../dto/create-tree-variety.dto';
import {
  TreeVarietyResponseDto,
  TreeVarietyResponseMapper,
} from '../../dto/tree-variety-response.dto';

export class CreateTreeVarietyUseCase {
  constructor(private readonly treeVarietyRepository: ITreeVarietyRepository) {}

  public async execute(input: CreateTreeVarietyDto): Promise<TreeVarietyResponseDto> {
    const existing = await this.treeVarietyRepository.findByCommonName(input.commonName);
    if (existing) {
      throw new ConflictError(`Tree name "${input.commonName}" already exists`);
    }

    const treeVariety = new TreeVariety({
      commonName: input.commonName,
      scientificName: input.scientificName,
      category: input.category,
      price: input.price,
      co2AbsorptionRateKgYear: input.co2AbsorptionRateKgYear,
      growthTimeline: input.growthTimeline,
      careRequirements: input.careRequirements,
      coverImages: input.coverImages ?? [],
      location: input.location,
      description: input.description,
      isActive: true,
    });

    const savedTree = await this.treeVarietyRepository.save(treeVariety);
    return TreeVarietyResponseMapper.toDto(savedTree);
  }
}
