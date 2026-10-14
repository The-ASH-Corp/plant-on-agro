import { ICertificateRepository } from '../../../core/interfaces/certificate.repository.interface';
import { NotFoundError } from '../../../core/errors/app-error';

export class DeleteCertificateUseCase {
  constructor(private readonly certificateRepository: ICertificateRepository) {}

  public async execute(id: string): Promise<boolean> {
    const existing = await this.certificateRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Certificate with ID '${id}' not found`);
    }

    return this.certificateRepository.delete(id);
  }
}
