"use client";

import { Tree } from "@/types";

interface Step1TreeSelectionProps {
  selectedTree: Tree | null;
  onSelectTree: (tree: Tree) => void;
  trees?: Tree[];
  loading?: boolean;
}

export function Step1TreeSelection({
  selectedTree,
  onSelectTree,
  trees = [],
  loading = false,
}: Step1TreeSelectionProps) {
  if (loading) {
    return (
      <div>
        <p className="text-[#4a6557] mb-5">Fetching available nursery species from database...</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#eaf2ec] animate-pulse">
              <div className="w-14 h-14 rounded-lg bg-emerald-50 shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-emerald-50 rounded w-3/4"></div>
                <div className="h-3 bg-emerald-50 rounded w-1/2"></div>
                <div className="h-4 bg-emerald-100 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[#4a6557] mb-5">Which tree would you like to plant?</p>
      {trees.length === 0 ? (
        <div className="text-center py-10 bg-[#f9fbf9] rounded-2xl border border-[#d4e9dd]">
          <span className="text-3xl">🌱</span>
          <p className="text-sm font-semibold text-[#173324] mt-2">No species available at this moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {trees.map((t) => (
            <button
              key={t.id}
              id={`tree-option-${t.id}`}
              onClick={() => onSelectTree(t)}
              className="flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 cursor-pointer"
              style={{
                border:
                  selectedTree?.id === t.id
                    ? "2px solid #52b788"
                    : "2px solid #eaf2ec",
                background: selectedTree?.id === t.id ? "#f0faf4" : "#fff",
              }}
            >
              <img
                src={t.img}
                alt={t.name}
                className="w-14 h-14 rounded-lg object-cover shrink-0"
              />
              <div>
                <div className="font-semibold text-[#173324] text-sm">{t.name}</div>
                <div className="text-[#4a6557] text-xs">{t.category}</div>
                <div className="text-[#2d6a4f] font-bold text-sm">₹{t.price}</div>
              </div>
              {selectedTree?.id === t.id && (
                <span className="ml-auto text-[#52b788] text-lg">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
