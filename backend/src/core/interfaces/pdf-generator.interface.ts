import { Certificate } from '../entities/certificate.entity';
import { TreeInstance } from '../entities/tree-instance.entity';
import { Nullable } from '../../shared/types';

export interface CertificatePdfData {
  certificate: Certificate;
  treeInstance?: Nullable<TreeInstance>;
  verificationFullUrl: string;
}

export interface IPdfGeneratorService {
  /**
   * Generates a streaming PDF document for an official adoption deed.
   */
  generateCertificatePdf(data: CertificatePdfData): Promise<NodeJS.ReadableStream>;
}
