import { Certificate } from "@/services/certificates/certificate.service";

export type CertificateViewMode = "table" | "grid";

export interface CertificateStats {
  total: number;
  issuedCount: number;
  pendingCount: number;
  revokedCount: number;
}

export interface CertificateFiltersBarProps {
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: CertificateViewMode;
  onToggleViewMode: (mode: CertificateViewMode) => void;
  onOpenIssueModal: () => void;
  onRefresh?: () => void;
  onExportCSV: () => void;
  totalResults: number;
  isFiltered: boolean;
  onClearFilters: () => void;
}

export interface CertificateStatsCardsProps {
  stats: CertificateStats;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export interface CertificateActionHandlers {
  onInspect: (cert: Certificate) => void;
  onEdit: (cert: Certificate) => void;
  onRevoke: (id: string, certNumber?: string) => void;
  onRegenerate: (id: string, certNumber?: string) => void;
  onDelete: (id: string, certNumber?: string) => void;
}

export interface CertificateTableProps extends CertificateActionHandlers {
  certificates: Certificate[];
  copiedHashId: string | null;
  onCopyHash: (id: string, hash: string) => void;
  isLoading?: boolean;
}

export interface CertificateTableRowProps extends CertificateActionHandlers {
  cert: Certificate;
  index: number;
  isCopied: boolean;
  onCopyHash: (id: string, hash: string) => void;
}

export interface CertificateGridProps extends CertificateActionHandlers {
  certificates: Certificate[];
  copiedHashId: string | null;
  onCopyHash: (id: string, hash: string) => void;
  isLoading?: boolean;
}

export interface CertificateCardProps extends CertificateActionHandlers {
  cert: Certificate;
  isCopied: boolean;
  onCopyHash: (id: string, hash: string) => void;
}

export interface CertificatePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export interface CertificateEmptyStateProps {
  isSearchActive: boolean;
  searchQuery: string;
  selectedStatus: string;
  onClearFilters: () => void;
  onOpenIssueModal: () => void;
}
