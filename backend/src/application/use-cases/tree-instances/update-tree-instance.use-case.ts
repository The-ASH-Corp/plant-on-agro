import { ITreeInstanceRepository } from '../../../core/interfaces/tree-instance.repository.interface';
import { NotFoundError } from '../../../core/errors/app-error';
import { UpdateTreeInstanceDto } from '../../dto/update-tree-instance.dto';
import {
  TreeInstanceResponseDto,
  TreeInstanceResponseMapper,
} from '../../dto/tree-instance-response.dto';

export class UpdateTreeInstanceUseCase {
  constructor(private readonly treeInstanceRepository: ITreeInstanceRepository) {}

  public async execute(
    id: string,
    input: UpdateTreeInstanceDto
  ): Promise<TreeInstanceResponseDto> {
    const existing = await this.treeInstanceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Tree instance with ID '${id}' not found`);
    }

    if (input.treeTag && input.treeTag.trim().toUpperCase() !== existing.treeTag) {
      const duplicate = await this.treeInstanceRepository.findByTag(input.treeTag);
      if (duplicate && duplicate.id !== id) {
        throw new Error(`A tree instance with tag/serial "${input.treeTag.toUpperCase()}" already exists`);
      }
    }

    existing.update({
      ...input,
      datePlanted: input.datePlanted ? new Date(input.datePlanted) : undefined,
      lastInspectedAt: input.lastInspectedAt ? new Date(input.lastInspectedAt) : undefined,
    });

    const updated = await this.treeInstanceRepository.update(existing);
    return TreeInstanceResponseMapper.toDto(updated);
  }
}
