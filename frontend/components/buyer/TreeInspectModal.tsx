"use client";

import { BackendTreeInstance } from "@/services/tree-instances/tree-instance.service";

interface TreeInspectModalProps {
  tree: BackendTreeInstance | null;
  onClose: () => void;
  onViewCertificate: (tree: BackendTreeInstance) => void;
}

export function TreeInspectModal({
  tree,
  onClose,
  onViewCertificate,
}: TreeInspectModalProps) {
  if (!tree) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-gradient-to-br from-[#0c2417] via-[#123624] to-[#081810] rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/40 text-white flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/20 bg-[#08170f]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🛰️</span>
            <div>
              <h3 className="text-sm font-bold tracking-wide">Arborist Telemetry Dossier</h3>
              <p className="text-[11px] text-emerald-400 font-mono">Serial: {tree.treeTag}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Tree Image & Health Banner */}
          <div className="relative h-52 w-full rounded-2xl overflow-hidden border border-white/10 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                tree.imageUrl ||
                "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format"
              }
              alt={tree.treeVarietyName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-300 font-bold block">
                  Living Specimen
                </span>
                <h2 className="text-xl font-bold text-white drop-shadow-md">
                  {tree.treeVarietyName}
                </h2>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {tree.healthStatus}
              </span>
            </div>
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
              <span className="text-[10px] text-white/50 uppercase font-mono block">Reserve Location</span>
              <p className="font-bold text-white text-sm">{tree.assignedReserve}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
              <span className="text-[10px] text-white/50 uppercase font-mono block">GPS Coordinates</span>
              <p className="font-mono font-bold text-emerald-300 text-sm">{tree.formattedGps}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
              <span className="text-[10px] text-white/50 uppercase font-mono block">Date Planted</span>
              <p className="font-bold text-white text-sm">{tree.datePlanted}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
              <span className="text-[10px] text-white/50 uppercase font-mono block">Last Drone Sweep</span>
              <p className="font-mono font-bold text-blue-300 text-sm">
                {tree.lastInspectedAt || "14 Days Ago (Verified)"}
              </p>
            </div>
          </div>

          {/* Arborist Notes */}
          <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/20 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <span>🩺</span>
              <span>Field Arborist Observations:</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed italic">
              &ldquo;{tree.notes || "Sapling rooted in rich loam. Optimal leaf transpiration and mycorrhizal fungus network established. Growing vigorously under permanent forestry wardens."}&rdquo;
            </p>
          </div>

          {/* Adopter Credential Card */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
            <div>
              <span className="text-[10px] text-white/50 block">Registered Eco-Guardian:</span>
              <strong className="text-white text-sm">{tree.adopterName || "Verified Adopter"}</strong>
              <span className="text-[11px] text-emerald-400/90 font-mono block">{tree.adopterEmail}</span>
            </div>

            <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Ref: {tree.orderRef || "PO-DIRECT"}
            </span>
          </div>

          {/* Bottom Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onViewCertificate(tree);
              }}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-[#1b7a43] via-[#2d6a4f] to-[#52b788] text-white hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-950/40 cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/30"
            >
              <span>📜</span>
              <span>View Official Certificate Deed</span>
            </button>

            <button
              onClick={onClose}
              className="py-3 px-5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
