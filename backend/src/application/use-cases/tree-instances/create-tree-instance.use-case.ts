import { ITreeInstanceRepository } from '../../../core/interfaces/tree-instance.repository.interface';
import { TreeInstance } from '../../../core/entities/tree-instance.entity';
import { CreateTreeInstanceDto } from '../../dto/create-tree-instance.dto';
import {
  TreeInstanceResponseDto,
  TreeInstanceResponseMapper,
} from '../../dto/tree-instance-response.dto';

export class CreateTreeInstanceUseCase {
  constructor(private readonly treeInstanceRepository: ITreeInstanceRepository) {}

  public async execute(input: CreateTreeInstanceDto): Promise<TreeInstanceResponseDto> {
    const existing = await this.treeInstanceRepository.findByTag(input.treeTag);
    if (existing) {
      throw new Error(`A tree instance with tag/serial "${input.treeTag.toUpperCase()}" already exists`);
    }

    const treeInstance = new TreeInstance({
      treeTag: input.treeTag,
      orderRef: input.orderRef,
      assignedReserve: input.assignedReserve,
      gpsCoordinates: input.gpsCoordinates,
      datePlanted: input.datePlanted ? new Date(input.datePlanted) : new Date(),
      healthStatus: input.healthStatus || 'Sapling Growing',
      treeVarietyName: input.treeVarietyName,
      adopterName: input.adopterName,
      adopterEmail: input.adopterEmail,
      notes: input.notes,
      imageUrl: input.imageUrl,
      isActive: true,
    });

    const saved = await this.treeInstanceRepository.save(treeInstance);
    return TreeInstanceResponseMapper.toDto(saved);
  }
}
