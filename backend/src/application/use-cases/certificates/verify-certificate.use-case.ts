import { ICertificateRepository } from '../../../core/interfaces/certificate.repository.interface';
import { NotFoundError } from '../../../core/errors/app-error';
import {
  CertificateResponseDto,
  CertificateResponseMapper,
} from '../../dto/certificate-response.dto';

export interface VerifyCertificateResult {
  valid: boolean;
  certificate: CertificateResponseDto;
  verificationTimestamp: string;
}

export class VerifyCertificateUseCase {
  constructor(private readonly certificateRepository: ICertificateRepository) {}

  public async execute(tokenOrHashOrNumber: string): Promise<VerifyCertificateResult> {
    const cleanToken = tokenOrHashOrNumber.trim();
    // Try finding by hash first, then by certificate number
    let cert = await this.certificateRepository.findByCertificateHash(cleanToken);
    if (!cert) {
      cert = await this.certificateRepository.findByCertificateNumber(cleanToken.toUpperCase());
    }

    if (!cert) {
      throw new NotFoundError(`Certificate with identifier '${cleanToken}' not found or verification token invalid`);
    }

    return {
      valid: cert.status === 'Issued' && cert.isActive,
      certificate: CertificateResponseMapper.toDto(cert),
      verificationTimestamp: new Date().toISOString(),
    };
  }
}
