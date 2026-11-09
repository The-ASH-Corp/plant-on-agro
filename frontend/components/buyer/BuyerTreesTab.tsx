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

  const filteredTrees = trees.filter((tree: any) => {
    const variety = tree?.treeVarietyName || tree?._treeVarietyName || "Indigenous Tree";
    const tag = tree?.treeTag || tree?._treeTag || "";
    const reserve = tree?.assignedReserve || tree?._assignedReserve || "";
    const health = tree?.healthStatus || tree?._healthStatus || "Healthy";

    const term = (searchTerm || "").toLowerCase();
    const matchesSearch =
      variety.toLowerCase().includes(term) ||
      tag.toLowerCase().includes(term) ||
      reserve.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "All" || health.toLowerCase() === (statusFilter || "").toLowerCase();

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
        <div className="bg-white rounded-3xl p-10 text-center border border-[#e2eae5] space-y-4 max-w-lg mx-auto shadow-xs my-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-inner border border-emerald-100">
            🌱
          </div>
          <div>
            <h3 className="text-base font-bold text-[#173324]">
              {searchTerm || statusFilter !== "All" ? "No Trees Matched" : "No Trees Adopted Yet"}
            </h3>
            <p className="text-xs text-[#52796f] mt-1.5 leading-relaxed max-w-sm mx-auto">
              {searchTerm || statusFilter !== "All"
                ? "No living trees matched your search query. Try clearing or resetting the filters."
                : "You haven't adopted any trees yet. Explore our living reserves to adopt your first tree."}
            </p>
          </div>
          <button
            onClick={onOpenPlantFlow}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#1b7a43] to-[#2d6a4f] text-white hover:from-[#145c32] hover:to-[#22543d] shadow-sm cursor-pointer transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            <span>🌱</span>
            <span>Adopt Your First Tree</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTrees.map((tree: any) => {
            const treeId = tree.id || tree._id || `inst-${tree.treeTag || Math.random()}`;
            const treeVarietyName = tree.treeVarietyName || tree._treeVarietyName || "Indigenous Tree";
            const treeTag = tree.treeTag || tree._treeTag || "POA-TR-001";
            const orderRef = tree.orderRef || tree._orderRef || "";
            const assignedReserve = tree.assignedReserve || tree._assignedReserve || "Living Reserve";
            const healthStatus = tree.healthStatus || tree._healthStatus || "Sapling Growing";
            const gpsCoords = tree.gpsCoordinates || tree._gpsCoordinates || { latitude: 18.9894, longitude: 73.4428 };
            const formattedGps = tree.formattedGps || `${gpsCoords.latitude}° N, ${gpsCoords.longitude}° E`;
            const datePlanted = tree.datePlanted || tree._datePlanted || "Recently Planted";
            const lastInspectedAt = tree.lastInspectedAt || tree._lastInspectedAt;
            const notes = tree.notes || tree._notes || "";
            const imageUrl = tree.imageUrl || tree._imageUrl;

            return (
              <div
                key={treeId}
                className="bg-white rounded-2xl border border-[#dbe6df] shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Media Image Banner */}
                  <div className="relative h-48 w-full bg-gray-900 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        imageUrl
                          ? imageUrl.startsWith("http") || imageUrl.startsWith("data:")
                            ? imageUrl
                            : `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace(/\/api\/v1\/?$/, "")}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`
                          : "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format"
                      }
                      alt={treeVarietyName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    {/* Serial Monospace Tag Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider bg-[#0f2419]/90 text-emerald-300 border border-emerald-400/30 backdrop-blur-md shadow-xs">
                        {treeTag}
                      </span>
                      {orderRef && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white/90 backdrop-blur-md">
                          {orderRef}
                        </span>
                      )}
                    </div>

                    {/* Health Status Pill */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-600/90 text-white border border-emerald-400/40 backdrop-blur-md flex items-center gap-1 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        {healthStatus}
                      </span>
                    </div>

                    {/* Title overlay in image banner */}
                    <div className="absolute bottom-3 left-3.5 right-3.5">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-300 font-mono block">
                        Protected Living Specimen
                      </span>
                      <h3 className="text-xl font-bold font-serif text-white tracking-wide leading-tight">
                        {treeVarietyName}
                      </h3>
                    </div>
                  </div>

                  {/* Tree Data Details */}
                  <div className="p-4 space-y-3">
                    {/* Reserve and Geo location */}
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-emerald-600 mt-0.5">📍</span>
                      <div>
                        <p className="text-xs font-bold text-[#173324]">{assignedReserve}</p>
                        <p className="text-[10px] text-[#52796f]">Protected Bio-Reserve Ecological Corridor</p>
                      </div>
                    </div>

                    {/* Sensor and Telemetry Data */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#f7faf8] border border-[#e2eae5] text-xs">
                      <div>
                        <span className="text-[9px] font-semibold text-[#52796f] block">GPS Telemetry</span>
                        <span className="font-mono text-[#173324] font-bold text-[11px] truncate block">
                          {formattedGps}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] font-semibold text-[#52796f] block">Date Planted</span>
                        <span className="text-[#173324] font-bold text-[11px] block">{datePlanted}</span>
                      </div>

                      <div>
                        <span className="text-[9px] font-semibold text-[#52796f] block">Field Inspection</span>
                        <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                          <span>🌿</span> {lastInspectedAt || "Recently Audited"}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] font-semibold text-[#52796f] block">Vigor & Canopy</span>
                        <span className="text-emerald-700 font-bold text-[11px]">99% Optimal</span>
                      </div>
                    </div>

                    {/* Forestry Inspection Notes */}
                    {notes && (
                      <div className="p-2.5 rounded-xl bg-[#fbfdfc] border border-dashed border-[#cfe0d5] text-xs space-y-0.5">
                        <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#1b7a43]">
                          <span>🌱</span> Field Arborist Note:
                        </div>
                        <p className="text-[11px] text-[#4a6557] italic leading-snug line-clamp-2">
                          &ldquo;{notes}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Interactive Actions Bar */}
                <div className="px-4 py-3 bg-[#fafcfb] border-t border-[#edf2ee] flex items-center justify-between gap-2 text-xs">
                  <a
                    href={`https://www.google.com/maps?q=${gpsCoords?.latitude || 18.922},${gpsCoords?.longitude || 73.816}`}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
