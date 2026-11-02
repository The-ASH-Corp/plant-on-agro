"use client";

import { CertificatePaginationProps } from "./types";

import { Select } from "@/components/ui";
export function CertificatePagination({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  startIndex,
  endIndex,
  onPageChange,
  onPageSizeChange,
}: CertificatePaginationProps) {
  if (totalCount === 0) return null;

  // Generate page numbers array with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-[#e2eae5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
      {/* Left: Summary and Page Size Selector */}
      <div className="flex items-center gap-3 text-[#55695d]">
        <span>
          Showing <strong className="text-[#173324]">{startIndex + 1}</strong> to{" "}
          <strong className="text-[#173324]">{Math.min(endIndex, totalCount)}</strong> of{" "}
          <strong className="text-[#173324]">{totalCount}</strong> deeds
        </span>

        <div className="flex items-center gap-1.5 pl-2 border-l border-[#e2eae5]">
          <span className="text-[11px] text-[#7a8c80]">Per page:</span>
          <Select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="py-1 px-2 rounded-lg border border-[#d8e3dc] bg-[#f8faf8] text-[#173324] font-semibold text-xs outline-none cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </Select>
        </div>
      </div>

      {/* Right: Page Navigation Buttons */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1.5 rounded-xl border border-[#d8e3dc] text-xs font-semibold text-[#173324] hover:bg-[#f4f7f5] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
        >
          ← Prev
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-[#7a8c80]">
                  …
                </span>
              );
            }
            const pageNum = p as number;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${
                  isActive
                    ? "bg-emerald-800 text-white shadow-xs"
                    : "text-[#3d4f45] hover:bg-[#f0f4f1] border border-transparent hover:border-[#d8e3dc]"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1.5 rounded-xl border border-[#d8e3dc] text-xs font-semibold text-[#173324] hover:bg-[#f4f7f5] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
