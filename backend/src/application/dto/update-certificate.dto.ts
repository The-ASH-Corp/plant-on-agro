import { CertificateStatus } from '../../core/entities/certificate.entity';

export interface UpdateCertificateDto {
  certificateNumber?: string;
  recipientName?: string;
  dedicatedMessage?: string;
  issueDate?: string | Date;
  pdfUrl?: string;
  qrCodeVerificationUrl?: string;
  treeTag?: string;
  treeSpecies?: string;
  reserveName?: string;
  adopterName?: string;
  status?: CertificateStatus;
  isActive?: boolean;
  regenerate?: boolean;
  reissue?: boolean;
}
