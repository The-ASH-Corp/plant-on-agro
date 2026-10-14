import { ITreeInstanceRepository } from '../../../core/interfaces/tree-instance.repository.interface';
import { NotFoundError } from '../../../core/errors/app-error';
import {
  TreeInstanceResponseDto,
  TreeInstanceResponseMapper,
} from '../../dto/tree-instance-response.dto';

export class GetTreeInstanceByIdUseCase {
  constructor(private readonly treeInstanceRepository: ITreeInstanceRepository) {}

  public async execute(id: string): Promise<TreeInstanceResponseDto> {
    const instance = await this.treeInstanceRepository.findById(id);
    if (!instance) {
      throw new NotFoundError(`Tree instance with ID '${id}' not found`);
    }

    return TreeInstanceResponseMapper.toDto(instance);
  }
}
