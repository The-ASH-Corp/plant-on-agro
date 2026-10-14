import { ICertificateRepository } from '../../../core/interfaces/certificate.repository.interface';
import { NotFoundError } from '../../../core/errors/app-error';
import {
  CertificateResponseDto,
  CertificateResponseMapper,
} from '../../dto/certificate-response.dto';

export class GetCertificateByIdUseCase {
  constructor(private readonly certificateRepository: ICertificateRepository) {}

  public async execute(id: string): Promise<CertificateResponseDto> {
    const cert = await this.certificateRepository.findById(id);
    if (!cert) {
      throw new NotFoundError(`Certificate with ID '${id}' not found`);
    }

    return CertificateResponseMapper.toDto(cert);
  }
}
