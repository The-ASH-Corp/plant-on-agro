import { ITreeVarietyRepository } from '../../../core/interfaces/tree-variety.repository.interface';
import { NotFoundError } from '../../../core/errors/app-error';
import {
  TreeVarietyResponseDto,
  TreeVarietyResponseMapper,
} from '../../dto/tree-variety-response.dto';

export class GetTreeVarietyByIdUseCase {
  constructor(private readonly treeVarietyRepository: ITreeVarietyRepository) {}

  public async execute(id: string): Promise<TreeVarietyResponseDto> {
    const tree = await this.treeVarietyRepository.findById(id);
    if (!tree) {
      throw new NotFoundError(`Tree variety with ID '${id}' not found`);
    }

    return TreeVarietyResponseMapper.toDto(tree);
  }
}
