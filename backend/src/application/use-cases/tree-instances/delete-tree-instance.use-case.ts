import { ITreeInstanceRepository } from '../../../core/interfaces/tree-instance.repository.interface';
import { NotFoundError } from '../../../core/errors/app-error';

export class DeleteTreeInstanceUseCase {
  constructor(private readonly treeInstanceRepository: ITreeInstanceRepository) {}

  public async execute(id: string): Promise<boolean> {
    const existing = await this.treeInstanceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Tree instance with ID '${id}' not found`);
    }

    return this.treeInstanceRepository.delete(id);
  }
}
