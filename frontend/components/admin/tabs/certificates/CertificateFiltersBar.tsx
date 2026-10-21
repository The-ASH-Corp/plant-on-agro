"use client";

import { CertificateFiltersBarProps } from "./types";

const STATUS_FILTERS = [
  { value: "All", label: "All Deeds", icon: "📜" },
  { value: "Issued", label: "Issued & Valid", icon: "✓" },
  { value: "Pending Generation", label: "Pending Gen", icon: "⏳" },
  { value: "Revoked", label: "Revoked", icon: "🚫" },
];

export function CertificateFiltersBar({
  selectedStatus,
  onSelectStatus,
  searchQuery,
  onSearchChange,
  viewMode,
  onToggleViewMode,
  onOpenIssueModal,
  onRefresh,
  onExportCSV,
  totalResults,
  isFiltered,
  onClearFilters,
}: CertificateFiltersBarProps) {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e2eae5] shadow-xs space-y-4">
      {/* Top Row: Search and Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by serial, SHA-256 hash, honoree, order ref, species..."
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#f8faf8] border border-[#d8e3dc] text-xs text-[#173324] placeholder-[#7a8c80] focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#7a8c80]">
            🔍
          </span>
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7a8c80] hover:text-[#173324] cursor-pointer"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Refresh Ledger */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Refresh certificate ledger"
              className="px-3 py-2 rounded-2xl border border-[#d8e3dc] bg-white hover:bg-[#f4f7f5] text-xs font-semibold text-[#173324] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}

          {/* Export CSV */}
          <button
            onClick={onExportCSV}
            title="Export certificate directory to CSV"
            className="px-3 py-2 rounded-2xl border border-[#d8e3dc] bg-white hover:bg-[#f4f7f5] text-xs font-semibold text-[#173324] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <span>📥</span>
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* View Toggle (Table / Grid) */}
          <div className="flex items-center rounded-2xl border border-[#d8e3dc] p-0.5 bg-[#f4f7f5]">
            <button
              onClick={() => onToggleViewMode("table")}
              title="Ledger Table View"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "table"
                  ? "bg-white text-emerald-950 shadow-xs"
                  : "text-[#55695d] hover:text-[#173324]"
              }`}
            >
              <span>📋</span>
              <span className="hidden md:inline">Table</span>
            </button>
            <button
              onClick={() => onToggleViewMode("grid")}
              title="Deed Cards View"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-white text-emerald-950 shadow-xs"
                  : "text-[#55695d] hover:text-[#173324]"
              }`}
            >
              <span>🖼️</span>
              <span className="hidden md:inline">Deed Cards</span>
            </button>
          </div>

          {/* + Issue Deed CTA */}
          <button
            onClick={onOpenIssueModal}
            className="px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Issue New Deed</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Status Filter Tabs and Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#f0f4f1]">
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_FILTERS.map((tab) => {
            const active = selectedStatus === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onSelectStatus(tab.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? "bg-emerald-900 text-white shadow-xs"
                    : "bg-[#f8faf8] text-[#3d4f45] hover:bg-[#eef4f0] border border-[#e2eae5]"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#55695d]">
          <span>
            Found <strong className="text-[#173324]">{totalResults}</strong>{" "}
            {totalResults === 1 ? "certificate" : "certificates"}
          </span>
          {isFiltered && (
            <button
              onClick={onClearFilters}
              className="text-xs text-emerald-700 hover:text-emerald-900 underline font-semibold cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
