import { Certificate, CertificateStatus } from '../../core/entities/certificate.entity';

export interface CertificateResponseDto {
  id: string;
  certificateNumber: string;
  certificateHash: string;
  orderRef: string;
  recipientName: string;
  dedicatedMessage: string;
  issueDate: string;
  pdfUrl: string;
  qrCodeVerificationUrl: string;
  treeTag: string;
  treeSpecies: string;
  reserveName: string;
  adopterName: string;
  status: CertificateStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class CertificateResponseMapper {
  public static toDto(entity: Certificate): CertificateResponseDto {
    return {
      id: entity.id || '',
      certificateNumber: entity.certificateNumber,
      certificateHash: entity.certificateHash,
      orderRef: entity.orderRef,
      recipientName: entity.recipientName,
      dedicatedMessage: entity.dedicatedMessage,
      issueDate: entity.issueDate.toISOString(),
      pdfUrl: entity.pdfUrl,
      qrCodeVerificationUrl: entity.qrCodeVerificationUrl,
      treeTag: entity.treeTag,
      treeSpecies: entity.treeSpecies,
      reserveName: entity.reserveName,
      adopterName: entity.adopterName,
      status: entity.status,
      isActive: entity.isActive,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
