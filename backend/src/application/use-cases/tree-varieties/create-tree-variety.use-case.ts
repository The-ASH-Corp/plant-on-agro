import { ITreeVarietyRepository } from '../../../core/interfaces/tree-variety.repository.interface';
import { TreeVariety } from '../../../core/entities/tree-variety.entity';
import { CreateTreeVarietyDto } from '../../dto/create-tree-variety.dto';
import {
  TreeVarietyResponseDto,
  TreeVarietyResponseMapper,
} from '../../dto/tree-variety-response.dto';

export class CreateTreeVarietyUseCase {
  constructor(private readonly treeVarietyRepository: ITreeVarietyRepository) {}
  public async execute(input: CreateTreeVarietyDto): Promise<TreeVarietyResponseDto> {
    let effectivePrice = input.price;
    const existing = await this.treeVarietyRepository.findAll({}, 1, 0);
    if (existing.length > 0 && typeof existing[0].price === 'number') {
      if (input.price && input.price !== existing[0].price) {
        effectivePrice = input.price;
        await this.treeVarietyRepository.updateAllPrices(effectivePrice);
      } else {
        effectivePrice = existing[0].price;
      }
    }

    const treeVariety = new TreeVariety({
      commonName: input.commonName,
      scientificName: input.scientificName,
      category: input.category,
      price: effectivePrice,
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
