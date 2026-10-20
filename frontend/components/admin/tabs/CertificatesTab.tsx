"use client";

import { useState, useMemo, useEffect } from "react";
import { Certificate, certificateService } from "@/services/certificates/certificate.service";
import {
  CertificateViewMode,
  CertificateStatsCards,
  CertificateFiltersBar,
  CertificateTable,
  CertificateGrid,
  CertificateEmptyState,
  CertificatePagination,
} from "./certificates";

export interface CertificatesTabProps {
  certificates: Certificate[];
  searchQuery: string;
  onOpenIssueCertificate: () => void;
  onInspectCertificate: (cert: Certificate) => void;
  onEditCertificate: (cert: Certificate) => void;
  onRevokeCertificate: (id: string, certNumber?: string) => void;
  onRegenerateCertificate: (id: string, certNumber?: string) => void;
  onDeleteCertificate: (id: string, certNumber?: string) => void;
  onRefresh?: () => void;
}

export function CertificatesTab({
  certificates,
  searchQuery,
  onOpenIssueCertificate,
  onInspectCertificate,
  onEditCertificate,
  onRevokeCertificate,
  onRegenerateCertificate,
  onDeleteCertificate,
  onRefresh,
}: CertificatesTabProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [viewMode, setViewMode] = useState<CertificateViewMode>("table");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchQuery);
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);

  // Server-side paginated state
  const [serverCertificates, setServerCertificates] = useState<Certificate[] | null>(null);
  const [serverTotal, setServerTotal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page when search or status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedStatus, pageSize]);

  // KPI Calculations
  const stats = useMemo(() => {
    const total = serverTotal !== null ? serverTotal : certificates.length;
    const issuedCount = certificates.filter((c) => c.status === "Issued").length;
    const pendingCount = certificates.filter((c) => c.status === "Pending Generation").length;
    const revokedCount = certificates.filter((c) => c.status === "Revoked").length;
    return { total, issuedCount, pendingCount, revokedCount };
  }, [certificates, serverTotal]);

  // Client-side fallback filtered list
  const filteredCertificates = useMemo(() => {
    return certificates.filter((c) => {
      const q = debouncedSearch.toLowerCase();
      const matchesSearch =
        c.certificateNumber.toLowerCase().includes(q) ||
        (c.certificateHash && c.certificateHash.toLowerCase().includes(q)) ||
        c.orderRef.toLowerCase().includes(q) ||
        c.recipientName.toLowerCase().includes(q) ||
        (c.adopterName && c.adopterName.toLowerCase().includes(q)) ||
        (c.treeSpecies && c.treeSpecies.toLowerCase().includes(q)) ||
        (c.treeTag && c.treeTag.toLowerCase().includes(q)) ||
        (c.reserveName && c.reserveName.toLowerCase().includes(q));

      const matchesStatus =
        selectedStatus === "All" || c.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [certificates, debouncedSearch, selectedStatus]);

  // Fetch paginated data from backend API
  useEffect(() => {
    let isMounted = true;
    async function fetchFromBackend() {
      setIsLoading(true);
      try {
        const skip = (currentPage - 1) * pageSize;
        const res = await certificateService.getCertificates({
          limit: pageSize,
          skip,
          search: debouncedSearch.trim() || undefined,
          status: selectedStatus !== "All" ? selectedStatus : undefined,
        });

        if (isMounted && res.data) {
          setServerCertificates(res.data.items);
          setServerTotal(res.data.total);
        }
      } catch (err) {
        console.warn("Backend certificate fetch notice, using fallback:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchFromBackend();
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, debouncedSearch, selectedStatus, certificates]);

  const totalCount = serverTotal !== null ? serverTotal : filteredCertificates.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);

  const displayList = useMemo(() => {
    if (serverCertificates !== null) {
      return serverCertificates;
    }
    return filteredCertificates.slice(startIndex, endIndex);
  }, [serverCertificates, filteredCertificates, startIndex, endIndex]);

  const handleCopyHash = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHashId(id);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  const handleExportCSV = () => {
    if (certificates.length === 0) return;
    const headers = [
      "Certificate Serial",
      "Cryptographic Hash (SHA-256)",
      "Order Reference",
      "Recipient Name",
      "Adopter Name",
      "Tree Species",
      "Sanctuary Reserve",
      "Sapling Tag",
      "Deed Status",
      "Issue Date",
      "Verification URL",
      "Dedication Citation",
    ];

    const rows = certificates.map((c) => [
      `"${c.certificateNumber}"`,
      `"${c.certificateHash || ""}"`,
      `"${c.orderRef}"`,
      `"${(c.recipientName || "").replace(/"/g, '""')}"`,
      `"${(c.adopterName || "").replace(/"/g, '""')}"`,
      `"${(c.treeSpecies || "").replace(/"/g, '""')}"`,
      `"${(c.reserveName || "").replace(/"/g, '""')}"`,
      `"${c.treeTag || ""}"`,
      `"${c.status}"`,
      `"${c.issueDate ? new Date(c.issueDate).toISOString() : ""}"`,
      `"${c.qrCodeVerificationUrl || ""}"`,
      `"${(c.dedicatedMessage || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `PlantOnAgro_Certificate_Deeds_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFiltered = debouncedSearch.trim().length > 0 || selectedStatus !== "All";

  const handleClearFilters = () => {
    setSelectedStatus("All");
    setDebouncedSearch("");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header Hero Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-emerald-900 via-[#173826] to-[#0f2419] p-6 sm:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <span>🛡️</span>
            <span>Cryptographic Proof of Living Title</span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Digital Certificate & Deed Registry
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 max-w-2xl leading-relaxed">
            Manage authenticated cryptographic deeds, audit SHA-256 integrity proofs,
            reissue hashes, or revoke void titles across all agroforestry adoption reservations.
          </p>
        </div>

        <div className="relative z-10 flex sm:flex-col items-end justify-between gap-3">
          <button
            onClick={onOpenIssueCertificate}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-xs tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <span className="text-sm">📜</span>
            <span>+ Issue Certificate Deed</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Metric Cards */}
      <CertificateStatsCards
        stats={stats}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
      />

      {/* 3. Filters & Command Toolbar */}
      <CertificateFiltersBar
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        searchQuery={debouncedSearch}
        onSearchChange={setDebouncedSearch}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        onOpenIssueModal={onOpenIssueCertificate}
        onRefresh={onRefresh}
        onExportCSV={handleExportCSV}
        totalResults={totalCount}
        isFiltered={isFiltered}
        onClearFilters={handleClearFilters}
      />

      {/* 4. Main Listing (Table or Card Grid) */}
      {displayList.length === 0 ? (
        <CertificateEmptyState
          isSearchActive={isFiltered}
          searchQuery={debouncedSearch}
          selectedStatus={selectedStatus}
          onClearFilters={handleClearFilters}
          onOpenIssueModal={onOpenIssueCertificate}
        />
      ) : viewMode === "table" ? (
        <CertificateTable
          certificates={displayList}
          copiedHashId={copiedHashId}
          onCopyHash={handleCopyHash}
          onInspect={onInspectCertificate}
          onEdit={onEditCertificate}
          onRevoke={onRevokeCertificate}
          onRegenerate={onRegenerateCertificate}
          onDelete={onDeleteCertificate}
          isLoading={isLoading}
        />
      ) : (
        <CertificateGrid
          certificates={displayList}
          copiedHashId={copiedHashId}
          onCopyHash={handleCopyHash}
          onInspect={onInspectCertificate}
          onEdit={onEditCertificate}
          onRevoke={onRevokeCertificate}
          onRegenerate={onRegenerateCertificate}
          onDelete={onDeleteCertificate}
          isLoading={isLoading}
        />
      )}

      {/* 5. Pagination Bar */}
      <CertificatePagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalCount={totalCount}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
