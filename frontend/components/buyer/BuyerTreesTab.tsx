"use client";

import { useState } from "react";
import { BackendTreeInstance } from "@/services/tree-instances/tree-instance.service";

interface BuyerTreesTabProps {
  trees: BackendTreeInstance[];
  loading: boolean;
  onOpenPlantFlow: () => void;
  onViewCertificate: (tree: BackendTreeInstance) => void;
  onInspectTree?: (tree: BackendTreeInstance) => void;
}

export function BuyerTreesTab({
  trees,
  loading,
  onOpenPlantFlow,
  onViewCertificate,
  onInspectTree,
}: BuyerTreesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filteredTrees = trees.filter((tree) => {
    const matchesSearch =
      tree.treeVarietyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tree.treeTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tree.assignedReserve.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || tree.healthStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls Header */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2eae5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌲</span>
            <h2 className="text-base sm:text-lg font-bold text-[#173324]">
              My Living Trees & Telemetry Ledger
            </h2>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              {trees.length} Specimens
            </span>
          </div>
          <p className="text-xs text-[#52796f] mt-0.5">
            Living saplings geotagged, cared for by dedicated field arborists, and protected under permanent forestry care.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
            <input
              type="text"
              placeholder="Search by tag, species, reserve..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none w-56 sm:w-64"
            />
          </div>

          {/* Health Filter Pills */}
          <div className="flex items-center gap-1 bg-[#f4f7f5] p-1 rounded-xl border border-[#e2eae5]">
            {["All", "Sapling Growing", "Healthy", "Thriving"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === status
                    ? "bg-[#173324] text-white shadow-xs"
                    : "text-[#52796f] hover:text-[#173324]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenPlantFlow}
            className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#1b7a43] to-[#2d6a4f] text-white hover:scale-105 transition-transform shadow-xs cursor-pointer flex items-center gap-1"
          >
            <span>+</span> Adopt Tree
          </button>
        </div>
      </div>

      {/* Trees Grid */}
      {loading ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-[#e2eae5]">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-medium text-[#52796f]">Querying living tree instances & GPS telemetry...</p>
        </div>
      ) : filteredTrees.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-[#e2eae5] space-y-3 max-w-md mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
            🌱
          </div>
          <div>
            <h3 className="text-base font-bold text-[#173324]">No Trees Found</h3>
            <p className="text-xs text-[#52796f] mt-1 leading-relaxed">
              {searchTerm || statusFilter !== "All"
                ? "No trees matched your search query. Try clearing filters."
                : "You haven't planted your first tree yet! Start your personal green legacy today."}
            </p>
          </div>
          <button
            onClick={onOpenPlantFlow}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1b7a43] text-white hover:bg-[#145c32] shadow-sm cursor-pointer transition-transform hover:scale-105 inline-flex items-center gap-1.5"
          >
            <span>🌱</span>
            <span>Adopt Your First Tree</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTrees.map((tree) => (
            <div
              key={tree.id}
              className="bg-white rounded-2xl border border-[#dbe6df] shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Media Image Banner */}
                <div className="relative h-48 w-full bg-gray-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      tree.imageUrl ||
                      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format"
                    }
                    alt={tree.treeVarietyName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Serial Monospace Tag Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider bg-[#0f2419]/90 text-emerald-300 border border-emerald-400/30 backdrop-blur-md shadow-xs">
                      {tree.treeTag}
                    </span>
                    {tree.orderRef && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white/90 backdrop-blur-md">
                        {tree.orderRef}
                      </span>
                    )}
                  </div>

                  {/* Health Status Pill */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-600/90 text-white border border-emerald-400/40 backdrop-blur-md flex items-center gap-1 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {tree.healthStatus}
                    </span>
                  </div>

                  {/* Title overlay in image banner */}
                  <div className="absolute bottom-3 left-3.5 right-3.5">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-300 font-mono block">
                      Protected Living Specimen
                    </span>
                    <h3 className="text-xl font-bold font-serif text-white tracking-wide leading-tight">
                      {tree.treeVarietyName}
                    </h3>
                  </div>
                </div>

                {/* Tree Data Details */}
                <div className="p-4 space-y-3">
                  {/* Reserve and Geo location */}
                  <div className="flex items-start gap-2">
                    <span className="text-sm text-emerald-600 mt-0.5">📍</span>
                    <div>
                      <p className="text-xs font-bold text-[#173324]">{tree.assignedReserve}</p>
                      <p className="text-[10px] text-[#52796f]">Protected Bio-Reserve Ecological Corridor</p>
                    </div>
                  </div>

                  {/* Sensor and Telemetry Data */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#f7faf8] border border-[#e2eae5] text-xs">
                    <div>
                      <span className="text-[9px] font-semibold text-[#52796f] block">GPS Telemetry</span>
                      <span className="font-mono text-[#173324] font-bold text-[11px] truncate block">
                        {tree.formattedGps}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] font-semibold text-[#52796f] block">Date Planted</span>
                      <span className="text-[#173324] font-bold text-[11px] block">{tree.datePlanted}</span>
                    </div>

                    <div>
                      <span className="text-[9px] font-semibold text-[#52796f] block">Field Inspection</span>
                      <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                        <span>🌿</span> {tree.lastInspectedAt || "Recently Audited"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] font-semibold text-[#52796f] block">Vigor & Canopy</span>
                      <span className="text-emerald-700 font-bold text-[11px]">99% Optimal</span>
                    </div>
                  </div>

                  {/* Forestry Inspection Notes */}
                  {tree.notes && (
                    <div className="p-2.5 rounded-xl bg-[#fbfdfc] border border-dashed border-[#cfe0d5] text-xs space-y-0.5">
                      <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#1b7a43]">
                        <span>🌱</span> Field Arborist Note:
                      </div>
                      <p className="text-[11px] text-[#4a6557] italic leading-snug line-clamp-2">
                        &ldquo;{tree.notes}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Interactive Actions Bar */}
              <div className="px-4 py-3 bg-[#fafcfb] border-t border-[#edf2ee] flex items-center justify-between gap-2 text-xs">
                <a
                  href={`https://www.google.com/maps?q=${tree.gpsCoordinates?.latitude || 18.922},${tree.gpsCoordinates?.longitude || 73.816}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-[11px] text-[#1b7a43] hover:text-[#145c32] hover:underline cursor-pointer"
                >
                  <span>🧭</span> Google Maps
                </a>

                <div className="flex items-center gap-2">
                  {onInspectTree && (
                    <button
                      onClick={() => onInspectTree(tree)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#1b7a43] border border-emerald-300 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>🔍</span>
                      <span>Inspect</span>
                    </button>
                  )}

                  <button
                    onClick={() => onViewCertificate(tree)}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#173324] to-[#1e4433] text-white hover:scale-105 font-bold cursor-pointer transition-transform shadow-xs flex items-center gap-1 text-xs"
                  >
                    <span>📜</span>
                    <span>View Deed</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
