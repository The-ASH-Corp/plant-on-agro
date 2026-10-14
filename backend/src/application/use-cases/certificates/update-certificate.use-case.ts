import { ICertificateRepository } from '../../../core/interfaces/certificate.repository.interface';
import { NotFoundError } from '../../../core/errors/app-error';
import { UpdateCertificateDto } from '../../dto/update-certificate.dto';
import {
  CertificateResponseDto,
  CertificateResponseMapper,
} from '../../dto/certificate-response.dto';

export class UpdateCertificateUseCase {
  constructor(private readonly certificateRepository: ICertificateRepository) {}

  public async execute(
    id: string,
    input: UpdateCertificateDto
  ): Promise<CertificateResponseDto> {
    const existing = await this.certificateRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Certificate with ID '${id}' not found`);
    }

    if (input.certificateNumber && input.certificateNumber.trim().toUpperCase() !== existing.certificateNumber) {
      const duplicate = await this.certificateRepository.findByCertificateNumber(input.certificateNumber);
      if (duplicate && duplicate.id !== id) {
        throw new Error(`A certificate with ID/number "${input.certificateNumber.toUpperCase()}" already exists`);
      }
    }

    existing.update({
      ...input,
      issueDate: input.issueDate ? new Date(input.issueDate) : undefined,
    });

    const updated = await this.certificateRepository.update(existing);
    return CertificateResponseMapper.toDto(updated);
  }
}
