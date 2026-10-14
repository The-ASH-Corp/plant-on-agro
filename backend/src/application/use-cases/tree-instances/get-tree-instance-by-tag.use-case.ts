import { ITreeInstanceRepository } from '../../../core/interfaces/tree-instance.repository.interface';
import { NotFoundError } from '../../../core/errors/app-error';
import {
  TreeInstanceResponseDto,
  TreeInstanceResponseMapper,
} from '../../dto/tree-instance-response.dto';

export class GetTreeInstanceByTagUseCase {
  constructor(private readonly treeInstanceRepository: ITreeInstanceRepository) {}

  public async execute(treeTag: string): Promise<TreeInstanceResponseDto> {
    const instance = await this.treeInstanceRepository.findByTag(treeTag);
    if (!instance) {
      throw new NotFoundError(`Tree instance with tag '${treeTag.toUpperCase()}' not found`);
    }

    return TreeInstanceResponseMapper.toDto(instance);
  }
}
