import { ICertificateRepository } from '../../../core/interfaces/certificate.repository.interface';
import { NotFoundError } from '../../../core/errors/app-error';
import {
  CertificateResponseDto,
  CertificateResponseMapper,
} from '../../dto/certificate-response.dto';

export class GetCertificateByNumberUseCase {
  constructor(private readonly certificateRepository: ICertificateRepository) {}

  public async execute(certificateNumber: string): Promise<CertificateResponseDto> {
    const cert = await this.certificateRepository.findByCertificateNumber(certificateNumber);
    if (!cert) {
      throw new NotFoundError(`Certificate '${certificateNumber.toUpperCase()}' not found`);
    }

    return CertificateResponseMapper.toDto(cert);
  }
}
