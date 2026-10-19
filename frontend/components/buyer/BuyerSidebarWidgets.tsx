"use client";

import { BackendTreeInstance } from "@/services/tree-instances/tree-instance.service";
import { User } from "@/types/auth";

interface BuyerSidebarWidgetsProps {
  trees: BackendTreeInstance[];
  user: User | null | undefined;
  onOpenPlantFlow: () => void;
  onSelectTreeDeed: (tree: BackendTreeInstance) => void;
}

export function BuyerSidebarWidgets({
  trees,
  user,
  onOpenPlantFlow,
  onSelectTreeDeed,
}: BuyerSidebarWidgetsProps) {
  return (
    <div className="space-y-4">
      {/* Widget: Field Care & Arborist Inspection Timeline */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e2eae5] shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#f0f4f1] pb-2.5">
          <h4 className="text-xs font-bold text-[#173324] flex items-center gap-1.5">
            <span>🛡️</span> Forestry Care & Inspection Schedule
          </h4>
          <span className="text-[10px] font-bold text-[#1b7a43] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Active Care
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#f7faf8] border border-[#e2eae5]">
            <span className="text-base text-emerald-600 mt-0.5">✓</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <strong className="text-[#173324] text-xs">Monsoon Organic Mulching</strong>
                <span className="text-[10px] text-emerald-700 font-semibold">Done</span>
              </div>
              <p className="text-[11px] text-[#52796f] mt-0.5 leading-snug">
                Enriched with bio-compost to encourage deep root establishment.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#f7faf8] border border-[#e2eae5]">
            <span className="text-base text-blue-600 mt-0.5">🌿</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <strong className="text-[#173324] text-xs">Field Arborist Canopy Audit</strong>
                <span className="text-[10px] text-blue-700 font-semibold font-mono">24 Oct 2026</span>
              </div>
              <p className="text-[11px] text-[#52796f] mt-0.5 leading-snug">
                On-ground botanical health check, height measurement, and foliage expansion review.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#f7faf8] border border-[#e2eae5]">
            <span className="text-base text-amber-600 mt-0.5">🌱</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <strong className="text-[#173324] text-xs">Soil Nitrate & Biochar Inspection</strong>
                <span className="text-[10px] text-amber-700 font-semibold font-mono">08 Nov 2026</span>
              </div>
              <p className="text-[11px] text-[#52796f] mt-0.5 leading-snug">
                Ground team soil test to verify optimal mycorrhizal fungi growth.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Widget 3: Adopter Species Portfolio Breakdown */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e2eae5] shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#f0f4f1] pb-2.5">
          <h4 className="text-xs font-bold text-[#173324] flex items-center gap-1.5">
            <span>🌿</span> Species Biodiversity Distribution
          </h4>
          <span className="text-[10px] font-mono text-[#52796f]">
            {trees.length} Varieties
          </span>
        </div>

        <div className="space-y-2">
          {trees.map((tree, i) => (
            <div
              key={tree.id || i}
              className="flex items-center justify-between p-2 rounded-xl bg-[#fafcfb] border border-[#edf2ee] hover:bg-emerald-50/50 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
                  {tree.treeVarietyName.charAt(0)}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-[#173324] truncate">{tree.treeVarietyName}</p>
                  <span className="text-[10px] text-emerald-700 font-mono">{tree.treeTag}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectTreeDeed(tree)}
                className="text-[10px] font-bold text-[#1b7a43] hover:underline shrink-0 cursor-pointer ml-2"
              >
                Deed →
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onOpenPlantFlow}
          className="w-full py-2 rounded-xl border border-dashed border-[#c5dbce] text-xs font-bold text-[#1b7a43] hover:bg-emerald-50/70 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>+</span> Adopt a Different Native Variety
        </button>
      </div>

      {/* Widget 4: Living Ledger Audit Log */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e2eae5] shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#f0f4f1] pb-2.5">
          <h4 className="text-xs font-bold text-[#173324] flex items-center gap-1.5">
            <span>⚡</span> Recent Ledger Activity
          </h4>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            Realtime
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {trees.length === 0 ? (
            <p className="text-[11px] text-[#52796f] italic py-2">
              No ledger transactions recorded yet. Plant your first tree to begin.
            </p>
          ) : (
            trees.slice(0, 3).map((tree, idx) => (
              <div
                key={tree.id || idx}
                className={`flex items-start gap-2 border-l-2 ${
                  idx === 0 ? "border-emerald-500" : idx === 1 ? "border-blue-500" : "border-amber-500"
                } pl-2.5 py-0.5`}
              >
                <div>
                  <p className="text-[11px] font-semibold text-[#173324]">
                    {tree.treeVarietyName} Sapling Active ({tree.healthStatus})
                  </p>
                  <span className="text-[9px] text-[#52796f] block">
                    Tag: {tree.treeTag} • Planted {tree.datePlanted} • {tree.assignedReserve}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
