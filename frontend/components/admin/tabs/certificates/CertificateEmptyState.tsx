"use client";

import { CertificateEmptyStateProps } from "./types";

export function CertificateEmptyState({
  isSearchActive,
  searchQuery,
  selectedStatus,
  onClearFilters,
  onOpenIssueModal,
}: CertificateEmptyStateProps) {
  return (
    <div className="bg-white rounded-3xl p-12 border border-[#e2eae5] text-center shadow-xs space-y-4">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl">
        📜
      </div>
      <div>
        <h3
          className="text-lg font-bold text-[#173324]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {isSearchActive
            ? "No Certificates Match Your Filters"
            : "No Certificate Deeds Issued Yet"}
        </h3>
        <p className="text-xs text-[#55695d] max-w-md mx-auto mt-1">
          {isSearchActive
            ? `No records found matching "${searchQuery}"${
                selectedStatus !== "All" ? ` in status "${selectedStatus}"` : ""
              }. Try resetting your search or adjusting the filters.`
            : "Cryptographic deed certificates are generated when tree adoptions are confirmed or issued manually by administrators."}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        {isSearchActive ? (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 rounded-2xl border border-[#d8e3dc] text-xs font-semibold text-[#173324] hover:bg-[#f4f7f5] transition-all cursor-pointer"
          >
            Clear Search & Filters
          </button>
        ) : (
          <button
            onClick={onOpenIssueModal}
            className="px-5 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            + Issue First Certificate Deed
          </button>
        )}
      </div>
    </div>
  );
}
