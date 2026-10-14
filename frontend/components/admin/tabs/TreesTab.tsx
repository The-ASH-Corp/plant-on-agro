"use client";

import { useState, useMemo } from "react";
import { TreeVarietyItem } from "../types";

interface TreesTabProps {
  trees: TreeVarietyItem[];
  searchQuery: string;
  onOpenAddTree: () => void;
  onDeleteTree: (id: string) => void;
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
  onDeleteTree,
}: TreesTabProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-xs">
        <div>
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-[#173324]">
            Botanical Tree Varieties Catalog ({filteredTrees.length})
          </h2>
          <p className="text-xs text-[#73877b]">Manage species, pricing, CO2 absorption rate, and nursery stock</p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#f2f6f3] border border-[#e2eae5]">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === "grid" ? "bg-white text-[#173324] shadow-xs" : "text-[#73877b]"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === "table" ? "bg-white text-[#173324] shadow-xs" : "text-[#73877b]"
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
            <h3 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-[#173324]">
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
          {filteredTrees.map((tree) => (
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
                  <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg font-semibold text-[#173324]">
                    {tree.name}
                  </h3>
                  <span className="text-xs text-[#73877b] italic block -mt-1">{tree.sci}</span>
                  <p className="text-xs text-[#55695d] line-clamp-2 leading-relaxed">{tree.desc}</p>

                  <div className="pt-3 border-t border-[#f0f4f1] grid grid-cols-2 gap-2 text-[11px] text-[#73877b]">
                    <div>
                      <span className="block text-[#a0b0a6] text-[10px] uppercase font-bold">Region</span>
                      <span className="font-semibold text-[#173324] truncate block">{tree.location}</span>
                    </div>
                    <div>
                      <span className="block text-[#a0b0a6] text-[10px] uppercase font-bold">CO2 Sequestration</span>
                      <span className="font-semibold text-[#1b7a43]">{tree.co2PerYearKg} kg/year</span>
                    </div>
                  </div>

                  {tree.careRequirements && (
                    <div className="pt-2 text-[10px] text-[#55695d] bg-[#f8faf8] p-2.5 rounded-xl border border-[#e5ebe7]">
                      <span className="font-bold text-[#173324] uppercase tracking-wider text-[9px] block mb-0.5">Care Requirements</span>
                      <span className="line-clamp-2">{tree.careRequirements}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-[#f9faf8] border-t border-[#f0f4f1] flex items-center justify-between">
                <span className="text-[11px] text-[#73877b] font-medium">{tree.growth}</span>
                <button
                  onClick={() => onDeleteTree(tree.id)}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Remove
                </button>
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
                {filteredTrees.map((tree) => (
                  <tr key={tree.id} className="hover:bg-[#fcfdfc] transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={tree.img} alt={tree.name} className="w-9 h-9 rounded-xl object-cover" />
                      <div>
                        <span className="font-bold text-[#173324] block">{tree.name}</span>
                        <span className="text-[11px] text-[#73877b] italic">{tree.sci}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#55695d]">{tree.category}</td>
                    <td className="py-3 px-4 font-bold text-[#173324]">₹{tree.price}</td>
                    <td className="py-3 px-4 text-[#73877b]">{tree.location}</td>
                    <td className="py-3 px-4 font-semibold text-[#1b7a43]">{tree.co2PerYearKg} kg</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteTree(tree.id)}
                        className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
