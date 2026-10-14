import {
  ICertificateRepository,
  CertificateFilter,
} from '../../../core/interfaces/certificate.repository.interface';
import {
  CertificateResponseDto,
  CertificateResponseMapper,
} from '../../dto/certificate-response.dto';

export interface GetCertificatesQuery {
  orderRef?: string;
  status?: string;
  search?: string;
  isActive?: boolean;
  limit?: number;
  skip?: number;
}

export interface GetCertificatesResult {
  items: CertificateResponseDto[];
  total: number;
  limit: number;
  skip: number;
}

export class GetCertificatesUseCase {
  constructor(private readonly certificateRepository: ICertificateRepository) {}

  public async execute(query: GetCertificatesQuery = {}): Promise<GetCertificatesResult> {
    const limit = query.limit ?? 50;
    const skip = query.skip ?? 0;

    const filter: CertificateFilter = {
      orderRef: query.orderRef,
      status: query.status,
      search: query.search,
      isActive: query.isActive,
    };

    const [certificates, total] = await Promise.all([
      this.certificateRepository.findAll(filter, limit, skip),
      this.certificateRepository.count(filter),
    ]);

    return {
      items: certificates.map(CertificateResponseMapper.toDto),
      total,
      limit,
      skip,
    };
  }
}
