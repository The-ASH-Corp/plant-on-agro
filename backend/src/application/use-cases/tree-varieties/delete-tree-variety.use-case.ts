import { ITreeVarietyRepository } from '../../../core/interfaces/tree-variety.repository.interface';
import { NotFoundError } from '../../../core/errors/app-error';

export class DeleteTreeVarietyUseCase {
  constructor(private readonly treeVarietyRepository: ITreeVarietyRepository) {}

  public async execute(id: string): Promise<boolean> {
    const existingTree = await this.treeVarietyRepository.findById(id);
    if (!existingTree) {
      throw new NotFoundError(`Tree variety with ID '${id}' not found`);
    }

    return this.treeVarietyRepository.delete(id);
  }
}
