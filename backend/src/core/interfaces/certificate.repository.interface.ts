import { Certificate, CertificateStatus } from '../entities/certificate.entity';
import { Nullable } from '../../shared/types';

export interface CertificateFilter {
  orderRef?: string;
  status?: CertificateStatus | string;
  search?: string;
  isActive?: boolean;
}

export interface ICertificateRepository {
  findById(id: string): Promise<Nullable<Certificate>>;
  findByCertificateNumber(certificateNumber: string): Promise<Nullable<Certificate>>;
  findByCertificateHash(certificateHash: string): Promise<Nullable<Certificate>>;
  findByOrderRef(orderRef: string): Promise<Certificate[]>;
  findAll(filter?: CertificateFilter, limit?: number, skip?: number): Promise<Certificate[]>;
  count(filter?: CertificateFilter): Promise<number>;
  save(certificate: Certificate): Promise<Certificate>;
  update(certificate: Certificate): Promise<Certificate>;
  delete(id: string): Promise<boolean>;
}
