import { apiClient } from '../api/api-client';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiResponse, PaginatedResult } from '@/types/api';

export type CertificateStatus = 'Issued' | 'Pending Generation' | 'Revoked';

export interface Certificate {
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

export interface VerifyCertificateResult {
  valid: boolean;
  certificate: Certificate;
  verificationTimestamp: string;
}

export interface CertificateQueryParams {
  orderRef?: string;
  status?: string;
  search?: string;
  isActive?: boolean;
  limit?: number;
  skip?: number;
}

export const certificateService = {
  /**
   * Fetches paginated certificates with optional status/order/search filtering.
   */
  async getCertificates(params?: CertificateQueryParams): Promise<ApiResponse<PaginatedResult<Certificate>>> {
    const query = new URLSearchParams();
    if (params?.orderRef) query.set('orderRef', params.orderRef);
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.isActive !== undefined) query.set('isActive', String(params.isActive));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.skip) query.set('skip', String(params.skip));

    const url = `${API_ENDPOINTS.CERTIFICATES.BASE}${query.toString() ? `?${query.toString()}` : ''}`;
    return apiClient.get<PaginatedResult<Certificate>>(url);
  },

  /**
   * Retrieves single certificate record by internal MongoDB identifier.
   */
  async getCertificateById(id: string): Promise<ApiResponse<Certificate>> {
    return apiClient.get<Certificate>(API_ENDPOINTS.CERTIFICATES.BY_ID(id));
  },

  /**
   * Retrieves certificate record by human-readable serial/certificate number.
   */
  async getCertificateByNumber(number: string): Promise<ApiResponse<Certificate>> {
    return apiClient.get<Certificate>(API_ENDPOINTS.CERTIFICATES.BY_NUMBER(number));
  },

  /**
   * Performs public verification of cryptographic authenticity and deed validity.
   */
  async verifyCertificate(tokenOrNumber: string): Promise<ApiResponse<VerifyCertificateResult>> {
    return apiClient.get<VerifyCertificateResult>(API_ENDPOINTS.CERTIFICATES.VERIFY(tokenOrNumber));
  },
};
