import { ITreeInstanceRepository } from '../../../core/interfaces/tree-instance.repository.interface';
import { NotFoundError, BadRequestError } from '../../../core/errors/app-error';

export class DeleteTreeInstanceUseCase {
  constructor(private readonly treeInstanceRepository: ITreeInstanceRepository) {}

  public async execute(id: string): Promise<boolean> {
    const existing = await this.treeInstanceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Tree instance with ID '${id}' not found`);
    }

    if (existing.orderRef || existing.adopterName) {
      throw new BadRequestError(
        `Cannot delete tree instance "${existing.treeTag}". This tree is permanently assigned to adopter "${existing.adopterName || existing.orderRef}" and cannot be altered or removed.`
      );
    }

    return this.treeInstanceRepository.delete(id);
  }
}
