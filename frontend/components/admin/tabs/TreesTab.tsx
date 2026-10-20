"use client";

import { useState, useMemo, useEffect } from "react";
import { TreeVarietyItem } from "../types";
import { TrashIcon, PencilIcon } from "@/components/ui";

interface TreesTabProps {
  trees: TreeVarietyItem[];
  searchQuery: string;
  onOpenAddTree: () => void;
  onEditTree: (tree: TreeVarietyItem) => void;
  onDeleteTree: (id: string, name?: string) => void;
}

const CATEGORIES = [
  "All",
  "Fruit Trees",
  "Medicinal",
  "Timber Trees",
  "Native Trees",
  "Shade Trees",
  "Occasion",
] as const;

export function TreesTab({
  trees,
  searchQuery,
  onOpenAddTree,
  onEditTree,
  onDeleteTree,
}: TreesTabProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(9);

  // Filter trees based on search and category
  const filteredTrees = useMemo(() => {
    return trees.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.sci.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategory === "All" || t.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [trees, searchQuery, selectedCategory]);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, pageSize]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredTrees.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredTrees.length);

  const paginatedTrees = useMemo(() => {
    return filteredTrees.slice(startIndex, endIndex);
  }, [filteredTrees, startIndex, endIndex]);

  // Dynamic pagination pill generator with ellipsis
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) {
        pages.push("ellipsis-1");
      }
      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (safeCurrentPage < totalPages - 2) {
        pages.push("ellipsis-2");
      }
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, safeCurrentPage]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-xl font-bold text-[#173324]"
            >
              Botanical Tree Varieties Catalog ({filteredTrees.length})
            </h2>
            {totalPages > 1 && (
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#1b7a43] border border-emerald-200">
                Page {safeCurrentPage} of {totalPages}
              </span>
            )}
          </div>
          <p className="text-xs text-[#73877b] mt-0.5">
            Manage species, pricing, CO2 absorption rate, and nursery stock
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#f2f6f3] border border-[#e2eae5]">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-[#173324] shadow-xs"
                  : "text-[#73877b]"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-[#173324] shadow-xs"
                  : "text-[#73877b]"
              }`}
            >
              Table
            </button>
          </div>

          <button
            onClick={onOpenAddTree}
            className="px-4 py-2 rounded-xl bg-[#173324] hover:bg-[#1f4230] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <span>+</span>
            <span>Add Tree Species</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#173324] text-white shadow-xs"
                : "bg-white text-[#55695d] border border-[#e2eae5] hover:bg-[#f7faf8]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content: Empty State or Grid / Table Views */}
      {filteredTrees.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#e2eae5] shadow-xs space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 text-3xl flex items-center justify-center border border-emerald-100">
            🌱
          </div>
          <div>
            <h3
              style={{ fontFamily: "var(--font-display)" }}
              className="text-xl font-bold text-[#173324]"
            >
              {trees.length === 0
                ? "No tree varieties catalogued yet"
                : "No matching tree species found"}
            </h3>
            <p className="text-xs text-[#73877b] max-w-md mx-auto mt-1 leading-relaxed">
              {trees.length === 0
                ? "All trees must be created from the admin side. Click the button below to register your first species with pricing, CO2 absorption rate, care requirements, and growth timeline."
                : `No tree species found in category "${selectedCategory}" matching "${searchQuery}".`}
            </p>
          </div>
          {trees.length === 0 ? (
            <button
              onClick={onOpenAddTree}
              className="px-5 py-2.5 rounded-xl bg-[#173324] hover:bg-[#1f4230] text-white text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>+</span>
              <span>Create First Tree Variety</span>
            </button>
          ) : (
            <button
              onClick={() => setSelectedCategory("All")}
              className="px-4 py-2 rounded-xl border border-emerald-200 text-xs font-semibold text-[#1b7a43] bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              Reset Category Filter
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedTrees.map((tree) => (
            <div
              key={tree.id}
              className="bg-white rounded-3xl border border-[#e2eae5] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Header with Badge */}
                <div className="relative h-48 w-full overflow-hidden bg-[#eaf1ec]">
                  <img
                    src={tree.img}
                    alt={tree.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#173324] shadow-xs">
                    {tree.category}
                  </span>
                  <span className="absolute bottom-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-[#173324]/90 backdrop-blur-md text-emerald-300 shadow-xs">
                    ₹{tree.price}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3
                        style={{ fontFamily: "var(--font-display)" }}
                        className="text-lg font-semibold text-[#173324]"
                      >
                        {tree.name}
                      </h3>
                      <span className="text-xs text-[#73877b] italic block">
                        {tree.sci}
                      </span>
                    </div>
                    {tree.isActive === false && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#55695d] line-clamp-2 leading-relaxed">
                    {tree.desc}
                  </p>

                  <div className="pt-3 border-t border-[#f0f4f1] grid grid-cols-2 gap-2 text-[11px] text-[#73877b]">
                    <div>
                      <span className="block text-[#a0b0a6] text-[10px] uppercase font-bold">
                        Region
                      </span>
                      <span className="font-semibold text-[#173324] truncate block">
                        {tree.location}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[#a0b0a6] text-[10px] uppercase font-bold">
                        CO2 Sequestration
                      </span>
                      <span className="font-semibold text-[#1b7a43]">
                        {tree.co2PerYearKg} kg/year
                      </span>
                    </div>
                  </div>

                  {tree.careRequirements && (
                    <div className="pt-2 text-[10px] text-[#55695d] bg-[#f8faf8] p-2.5 rounded-xl border border-[#e5ebe7]">
                      <span className="font-bold text-[#173324] uppercase tracking-wider text-[9px] block mb-0.5">
                        Care Requirements
                      </span>
                      <span className="line-clamp-2">{tree.careRequirements}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-[#f9faf8] border-t border-[#f0f4f1] flex items-center justify-between">
                <span className="text-[11px] text-[#73877b] font-medium">
                  {tree.growth}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEditTree(tree)}
                    title={`Edit ${tree.name}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#173324] hover:text-[#1b7a43] px-2.5 py-1.5 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all cursor-pointer"
                  >
                    <PencilIcon className="w-3.5 h-3.5 text-[#1b7a43]" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTree(tree.id, tree.name)}
                    title={`Delete ${tree.name}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Compact Table View */
        <div className="bg-white rounded-3xl border border-[#e2eae5] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7faf8] border-b border-[#e2eae5] text-[#7a8a80] uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">Tree Variety</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">CO2 / Year</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f1]">
                {paginatedTrees.map((tree) => (
                  <tr
                    key={tree.id}
                    className="hover:bg-[#fcfdfc] transition-colors"
                  >
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={tree.img}
                        alt={tree.name}
                        className="w-9 h-9 rounded-xl object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#173324] block">
                            {tree.name}
                          </span>
                          {tree.isActive === false && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              Inactive
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#73877b] italic">
                          {tree.sci}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#55695d]">
                      {tree.category}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#173324]">
                      ₹{tree.price}
                    </td>
                    <td className="py-3 px-4 text-[#73877b]">{tree.location}</td>
                    <td className="py-3 px-4 font-semibold text-[#1b7a43]">
                      {tree.co2PerYearKg} kg
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditTree(tree)}
                          title={`Edit ${tree.name}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#173324] hover:text-[#1b7a43] hover:bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-transparent hover:border-emerald-200 transition-all cursor-pointer"
                        >
                          <PencilIcon className="w-3.5 h-3.5 text-[#1b7a43]" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteTree(tree.id, tree.name)}
                          title={`Delete ${tree.name}`}
                          className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl border border-transparent hover:border-rose-200 font-semibold transition-all cursor-pointer"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls Bar */}
      {filteredTrees.length > 0 && (
        <div className="bg-white p-4 rounded-3xl border border-[#e2eae5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Record summary */}
          <div className="text-xs text-[#55695d]">
            Showing <span className="font-bold text-[#173324]">{startIndex + 1}</span> to{" "}
            <span className="font-bold text-[#173324]">{endIndex}</span> of{" "}
            <span className="font-bold text-[#173324]">{filteredTrees.length}</span> tree varieties
          </div>

          {/* Page navigation buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              className="px-3 py-1.5 rounded-xl border border-[#e2eae5] text-xs font-semibold text-[#173324] hover:bg-[#f2f6f3] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
            >
              <span>‹</span>
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {pageNumbers.map((p, idx) =>
                typeof p === "number" ? (
                  <button
                    key={`page-${p}`}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`min-w-8 h-8 px-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      safeCurrentPage === p
                        ? "bg-[#173324] text-white shadow-xs"
                        : "bg-white text-[#55695d] border border-[#e2eae5] hover:bg-[#f2f6f3]"
                    }`}
                  >
                    {p}
                  </button>
                ) : (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-1 text-xs text-[#73877b] select-none"
                  >
                    •••
                  </span>
                )
              )}
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
              className="px-3 py-1.5 rounded-xl border border-[#e2eae5] text-xs font-semibold text-[#173324] hover:bg-[#f2f6f3] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <span>›</span>
            </button>
          </div>

          {/* Page size dropdown */}
          <div className="flex items-center gap-2 text-xs text-[#73877b]">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-xl border border-[#e2eae5] bg-[#fcfaf7] text-xs font-semibold text-[#173324] focus:border-[#173324] outline-none cursor-pointer"
            >
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={18}>18</option>
              <option value={27}>27</option>
            </select>
            <span>per page</span>
          </div>
        </div>
      )}
    </div>
  );
}

