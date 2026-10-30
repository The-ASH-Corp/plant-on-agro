import { ITreeVarietyRepository } from '../../../core/interfaces/tree-variety.repository.interface';
import { ConflictError, NotFoundError } from '../../../core/errors/app-error';
import { UpdateTreeVarietyDto } from '../../dto/update-tree-variety.dto';
import {
  TreeVarietyResponseDto,
  TreeVarietyResponseMapper,
} from '../../dto/tree-variety-response.dto';

export class UpdateTreeVarietyUseCase {
  constructor(private readonly treeVarietyRepository: ITreeVarietyRepository) {}

  public async execute(
    id: string,
    input: UpdateTreeVarietyDto
  ): Promise<TreeVarietyResponseDto> {
    const existingTree = await this.treeVarietyRepository.findById(id);
    if (!existingTree) {
      throw new NotFoundError(`Tree variety with ID '${id}' not found`);
    }

    if (input.commonName) {
      const duplicate = await this.treeVarietyRepository.findByCommonName(input.commonName);
      if (duplicate && duplicate.id !== id) {
        throw new ConflictError(`Tree name "${input.commonName}" already exists`);
      }
    }

    existingTree.update(input);

    const updatedTree = await this.treeVarietyRepository.update(existingTree);
    return TreeVarietyResponseMapper.toDto(updatedTree);
  }
}
