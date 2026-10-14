import { ICertificateRepository } from '../../../core/interfaces/certificate.repository.interface';
import { Certificate } from '../../../core/entities/certificate.entity';
import { CreateCertificateDto } from '../../dto/create-certificate.dto';
import {
  CertificateResponseDto,
  CertificateResponseMapper,
} from '../../dto/certificate-response.dto';

export class CreateCertificateUseCase {
  constructor(private readonly certificateRepository: ICertificateRepository) {}

  public async execute(input: CreateCertificateDto): Promise<CertificateResponseDto> {
    const year = new Date().getFullYear();
    const certNumber =
      input.certificateNumber?.trim().toUpperCase() ||
      `POA-CERT-${year}-${Math.floor(10000 + Math.random() * 90000)}`;

    const existing = await this.certificateRepository.findByCertificateNumber(certNumber);
    if (existing) {
      throw new Error(`A certificate with ID/number "${certNumber}" already exists`);
    }

    const certificate = new Certificate({
      certificateNumber: certNumber,
      orderRef: input.orderRef,
      recipientName: input.recipientName,
      dedicatedMessage: input.dedicatedMessage,
      issueDate: input.issueDate ? new Date(input.issueDate) : new Date(),
      pdfUrl: input.pdfUrl,
      qrCodeVerificationUrl: input.qrCodeVerificationUrl,
      treeTag: input.treeTag,
      treeSpecies: input.treeSpecies,
      reserveName: input.reserveName,
      adopterName: input.adopterName,
      status: input.status || 'Issued',
      isActive: true,
    });

    const saved = await this.certificateRepository.save(certificate);
    return CertificateResponseMapper.toDto(saved);
  }
}
