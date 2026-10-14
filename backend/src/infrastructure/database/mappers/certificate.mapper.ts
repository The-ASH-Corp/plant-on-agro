import { Certificate } from '../../../core/entities/certificate.entity';
import { ICertificateDocument } from '../models/certificate.model';

export class CertificateMapper {
  public static toDomain(doc: ICertificateDocument): Certificate {
    return new Certificate({
      id: doc._id ? String(doc._id) : undefined,
      certificateNumber: doc.certificateNumber,
      certificateHash: doc.certificateHash,
      orderRef: doc.orderRef,
      recipientName: doc.recipientName,
      dedicatedMessage: doc.dedicatedMessage,
      issueDate: doc.issueDate,
      pdfUrl: doc.pdfUrl,
      qrCodeVerificationUrl: doc.qrCodeVerificationUrl,
      treeTag: doc.treeTag,
      treeSpecies: doc.treeSpecies,
      reserveName: doc.reserveName,
      adopterName: doc.adopterName,
      status: doc.status,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public static toPersistence(entity: Certificate): Partial<ICertificateDocument> {
    return {
      certificateNumber: entity.certificateNumber,
      certificateHash: entity.certificateHash,
      orderRef: entity.orderRef,
      recipientName: entity.recipientName,
      dedicatedMessage: entity.dedicatedMessage,
      issueDate: entity.issueDate,
      pdfUrl: entity.pdfUrl,
      qrCodeVerificationUrl: entity.qrCodeVerificationUrl,
      treeTag: entity.treeTag,
      treeSpecies: entity.treeSpecies,
      reserveName: entity.reserveName,
      adopterName: entity.adopterName,
      status: entity.status,
      isActive: entity.isActive,
    };
  }
}
