import { ICertificateRepository } from '../../../core/interfaces/certificate.repository.interface';
import { ITreeInstanceRepository } from '../../../core/interfaces/tree-instance.repository.interface';
import { IPdfGeneratorService } from '../../../core/interfaces/pdf-generator.interface';
import { NotFoundError } from '../../../core/errors/app-error';
import { env } from '../../../config/env';

import { isValidObjectId } from 'mongoose';

export interface DownloadCertificatePdfResult {
  stream: NodeJS.ReadableStream;
  filename: string;
  certificateNumber: string;
  recipientName: string;
}

export class DownloadCertificatePdfUseCase {
  constructor(
    private readonly certificateRepository: ICertificateRepository,
    private readonly treeInstanceRepository: ITreeInstanceRepository,
    private readonly pdfGeneratorService: IPdfGeneratorService
  ) {}

  public async execute(certificateIdentifier: string): Promise<DownloadCertificatePdfResult> {
    const cleanId = (certificateIdentifier || '').trim();
    if (!cleanId) {
      throw new NotFoundError('Certificate identifier is required');
    }

    // 1. Locate certificate by number, database ID, order reference, or cryptographic hash
    let certificate = await this.certificateRepository.findByCertificateNumber(cleanId);

    if (!certificate && isValidObjectId(cleanId)) {
      certificate = await this.certificateRepository.findById(cleanId);
    }

    if (!certificate) {
      const byOrder = await this.certificateRepository.findByOrderRef(cleanId);
      if (byOrder.length > 0) {
        certificate = byOrder[0];
      }
    }

    if (!certificate) {
      certificate = await this.certificateRepository.findByCertificateHash(cleanId);
    }

    if (!certificate) {
      throw new NotFoundError(`Certificate deed '${cleanId}'`);
    }

    // 2. Fetch associated tree instance telemetry (GPS coordinates, health, arborist logs)
    let treeInstance = null;
    if (certificate.treeTag) {
      treeInstance = await this.treeInstanceRepository.findByTag(certificate.treeTag);
    }
    if (!treeInstance && certificate.orderRef) {
      const instances = await this.treeInstanceRepository.findByOrderRef(certificate.orderRef);
      if (instances.length > 0) {
        treeInstance = instances[0];
      }
    }

    // 3. Construct absolute verification URL for QR code
    const baseUrl = (env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '');
    const verificationFullUrl = `${baseUrl}/verify/${certificate.certificateHash}`;

    // 4. Generate streaming PDF deed
    const stream = await this.pdfGeneratorService.generateCertificatePdf({
      certificate,
      treeInstance,
      verificationFullUrl,
    });

    const safeNumber = certificate.certificateNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `PlantOnAgro-Deed-${safeNumber}.pdf`;

    return {
      stream,
      filename,
      certificateNumber: certificate.certificateNumber,
      recipientName: certificate.recipientName,
    };
  }
}
