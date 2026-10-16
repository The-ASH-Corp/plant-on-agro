"use client";

import { Tree } from "@/types";
import { TREES } from "@/data/mockData";

interface Step1TreeSelectionProps {
  selectedTree: Tree | null;
  onSelectTree: (tree: Tree) => void;
}

export function Step1TreeSelection({
  selectedTree,
  onSelectTree,
}: Step1TreeSelectionProps) {
  return (
    <div>
      <p className="text-[#4a6557] mb-5">Which tree would you like to plant?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TREES.map((t) => (
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
    </div>
  );
}
