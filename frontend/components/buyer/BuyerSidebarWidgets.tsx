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
  const activeTree = trees[0] || null;

  return (
    <div className="space-y-4">
      {/* Widget 1: Live Drone Telemetry & Reserve Radar */}
      <div className="bg-gradient-to-br from-[#0c2417] via-[#123624] to-[#081810] rounded-2xl p-4 sm:p-5 text-white border border-emerald-500/25 shadow-lg relative overflow-hidden">
        {/* Radar ambient sweep glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono">
                Live Drone Telemetry
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              DRONE-04 ONLINE
            </span>
          </div>

          {/* Reserve Satellite Quick View Card */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60 font-medium">Assigned Bio-Reserve:</span>
              <span className="font-bold text-white text-right truncate max-w-[170px]">
                {activeTree ? activeTree.assignedReserve : "Western Ghats Corridor"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-mono">
              <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="text-white/40 block text-[9px] uppercase font-sans">Coordinates</span>
                <span className="text-emerald-300 font-bold">
                  {activeTree?.formattedGps || "18.922° N, 73.816° E"}
                </span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="text-white/40 block text-[9px] uppercase font-sans">Elevation</span>
                <span className="text-white font-bold">540m ASL</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-[10px]">
              <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/20">
                <span className="text-white/50 block text-[8px]">Soil Moisture</span>
                <strong className="text-emerald-300 font-bold">68% (Optimal)</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/20">
                <span className="text-white/50 block text-[8px]">Sunlight</span>
                <strong className="text-amber-300 font-bold">7.4 hrs/day</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/20">
                <span className="text-white/50 block text-[8px]">Micro-Climate</span>
                <strong className="text-blue-300 font-bold">28°C • Good</strong>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-white/60 leading-snug">
            Autonomous drone sweeps cross-reference sapling foliage index with multi-spectral satellite imagery every 14 days.
          </p>
        </div>
      </div>

      {/* Widget 2: Field Care & Arborist Inspection Timeline */}
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
            <span className="text-base text-blue-600 mt-0.5">🛰️</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <strong className="text-[#173324] text-xs">Drone Canopy Photogrammetry</strong>
                <span className="text-[10px] text-blue-700 font-semibold font-mono">24 Oct 2026</span>
              </div>
              <p className="text-[11px] text-[#52796f] mt-0.5 leading-snug">
                High-resolution 4K orthomosaic scan of foliage expansion.
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
          <div className="flex items-start gap-2 border-l-2 border-emerald-500 pl-2.5 py-0.5">
            <div>
              <p className="text-[11px] font-semibold text-[#173324]">
                Drone Survey Photogrammetry Synced
              </p>
              <span className="text-[9px] text-[#52796f] block">Tag: POA-MG-2847 • 2 days ago</span>
            </div>
          </div>

          <div className="flex items-start gap-2 border-l-2 border-blue-500 pl-2.5 py-0.5">
            <div>
              <p className="text-[11px] font-semibold text-[#173324]">
                Official Digital Deed Certified & Sealed
              </p>
              <span className="text-[9px] text-[#52796f] block">Recipient: {user?.name || "Tree Adopter"} • 5 days ago</span>
            </div>
          </div>

          <div className="flex items-start gap-2 border-l-2 border-amber-500 pl-2.5 py-0.5">
            <div>
              <p className="text-[11px] font-semibold text-[#173324]">
                Sapling Root Anchoring Verified by Field Arborist
              </p>
              <span className="text-[9px] text-[#52796f] block">Western Ghats Reserve • 1 week ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
