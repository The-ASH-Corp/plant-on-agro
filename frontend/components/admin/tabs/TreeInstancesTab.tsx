"use client";

import { useState, useMemo } from "react";
import { TreeInstanceItem, TreeHealthStatus } from "../types";

interface TreeInstancesTabProps {
  instances: TreeInstanceItem[];
  searchQuery: string;
  onOpenAddInstance: () => void;
  onUpdateHealth?: (id: string, status: TreeHealthStatus) => void;
  onDeleteInstance?: (id: string) => void;
}

const HEALTH_FILTERS: { value: string; label: string; icon: string }[] = [
  { value: "All", label: "All Saplings", icon: "🌐" },
  { value: "Thriving", label: "Thriving", icon: "🌳" },
  { value: "Healthy", label: "Healthy", icon: "🌿" },
  { value: "Sapling Growing", label: "Sapling Growing", icon: "🌱" },
  { value: "Needs Attention", label: "Needs Attention", icon: "⚠️" },
  { value: "Critical", label: "Critical", icon: "🚨" },
];

const HEALTH_BADGES: Record<TreeHealthStatus, { label: string; icon: string; bg: string; text: string; border: string }> = {
  Thriving: { label: "Thriving", icon: "🌳", bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  Healthy: { label: "Healthy", icon: "🌿", bg: "bg-green-50", text: "text-green-800", border: "border-green-200" },
  "Sapling Growing": { label: "Sapling Growing", icon: "🌱", bg: "bg-teal-50", text: "text-teal-800", border: "border-teal-200" },
  "Needs Attention": { label: "Needs Attention", icon: "⚠️", bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  Critical: { label: "Critical", icon: "🚨", bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
};

export function TreeInstancesTab({
  instances,
  searchQuery,
  onOpenAddInstance,
  onUpdateHealth,
  onDeleteInstance,
}: TreeInstancesTabProps) {
  const [selectedHealth, setSelectedHealth] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Summary Metrics
  const stats = useMemo(() => {
    const total = instances.length;
    const thrivingOrHealthy = instances.filter((i) => i.healthStatus === "Thriving" || i.healthStatus === "Healthy").length;
    const saplings = instances.filter((i) => i.healthStatus === "Sapling Growing").length;
    const attentionNeeded = instances.filter((i) => i.healthStatus === "Needs Attention" || i.healthStatus === "Critical").length;
    return { total, thrivingOrHealthy, saplings, attentionNeeded };
  }, [instances]);

  // Filtered List
  const filtered = useMemo(() => {
    return instances.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.treeTag.toLowerCase().includes(q) ||
        (item.orderRef && item.orderRef.toLowerCase().includes(q)) ||
        item.assignedReserve.toLowerCase().includes(q) ||
        item.treeVarietyName.toLowerCase().includes(q) ||
        item.adopterName.toLowerCase().includes(q) ||
        item.formattedGps.toLowerCase().includes(q);

      const matchesHealth = selectedHealth === "All" || item.healthStatus === selectedHealth;

      return matchesSearch && matchesHealth;
    });
  }, [instances, searchQuery, selectedHealth]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-xs">
        <div>
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-[#173324]">
            Individual Tree Instances & Geotags ({filtered.length})
          </h2>
          <p className="text-xs text-[#73877b]">
            Physical saplings with unique serial tags, verified GPS coordinates, and ground health logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[#f2f6f3] border border-[#e2eae5]">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                viewMode === "table" ? "bg-white text-[#173324] shadow-xs" : "text-[#73877b] hover:text-[#173324]"
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                viewMode === "grid" ? "bg-white text-[#173324] shadow-xs" : "text-[#73877b] hover:text-[#173324]"
              }`}
            >
              Card View
            </button>
          </div>

          <button
            onClick={onOpenAddInstance}
            className="px-4 py-2.5 rounded-xl bg-[#173324] hover:bg-[#1f4230] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
          >
            <span>+</span>
            <span>Tag & Plant Sapling</span>
          </button>
        </div>
      </div>

      {/* Quick Status KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-[#e2eae5] shadow-xs">
          <span className="text-[10px] text-[#73877b] font-bold uppercase tracking-wider block">
            Total Tagged Trees
          </span>
          <span className="text-2xl font-bold text-[#173324] mt-1 block">
            {stats.total.toLocaleString()}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#e2eae5] shadow-xs">
          <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
            Thriving & Healthy
          </span>
          <span className="text-2xl font-bold text-emerald-800 mt-1 block">
            {stats.thrivingOrHealthy.toLocaleString()}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#e2eae5] shadow-xs">
          <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider block">
            Saplings Growing
          </span>
          <span className="text-2xl font-bold text-teal-800 mt-1 block">
            {stats.saplings.toLocaleString()}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#e2eae5] shadow-xs">
          <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block">
            Attention Needed
          </span>
          <span className="text-2xl font-bold text-amber-800 mt-1 block">
            {stats.attentionNeeded.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Health Status Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {HEALTH_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setSelectedHealth(f.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedHealth === f.value
                ? "bg-[#173324] text-white shadow-xs"
                : "bg-white text-[#55695d] border border-[#e2eae5] hover:border-[#173324]"
            }`}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#e2eae5] space-y-3">
          <div className="text-4xl">🏷️</div>
          <h3 className="text-base font-bold text-[#173324]">No Tree Instances Found</h3>
          <p className="text-xs text-[#73877b] max-w-sm mx-auto">
            {searchQuery || selectedHealth !== "All"
              ? "No tree instances match your active search or health status filter."
              : "No physical saplings have been geotagged yet. Tag your first sapling with serial tag and GPS coordinates!"}
          </p>
          <button
            onClick={onOpenAddInstance}
            className="px-4 py-2 rounded-xl bg-[#173324] text-white text-xs font-semibold hover:bg-[#1f4230] transition-all cursor-pointer"
          >
            + Tag & Plant First Sapling
          </button>
        </div>
      ) : viewMode === "table" ? (
        /* Table View */
        <div className="bg-white rounded-3xl border border-[#e2eae5] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7faf8] border-b border-[#e2eae5] text-[#7a8a80] uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-4 px-4">Tree Tag / Serial</th>
                  <th className="py-4 px-4">Order Ref / Adopter</th>
                  <th className="py-4 px-4">Variety & Reserve</th>
                  <th className="py-4 px-4">Exact GPS Lat / Long</th>
                  <th className="py-4 px-4">Date Planted</th>
                  <th className="py-4 px-4">Health Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f1]">
                {filtered.map((item) => {
                  const badge = HEALTH_BADGES[item.healthStatus] || {
                    label: item.healthStatus,
                    icon: "🌱",
                    bg: "bg-gray-50",
                    text: "text-gray-800",
                    border: "border-gray-200",
                  };

                  const mapsUrl = `https://www.google.com/maps?q=${item.gpsCoordinates.latitude},${item.gpsCoordinates.longitude}`;

                  return (
                    <tr key={item.id} className="hover:bg-[#fbfcfb] transition-colors">
                      {/* Tree Tag */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-[#1b7a43] bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 text-xs block w-fit">
                          {item.treeTag}
                        </span>
                      </td>

                      {/* Order Ref & Adopter */}
                      <td className="py-3.5 px-4">
                        {item.orderRef ? (
                          <span className="font-mono text-[11px] font-semibold text-[#173324] block">
                            {item.orderRef}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#a0b0a6] italic block">Unassigned Nursery Stock</span>
                        )}
                        {item.adopterName && (
                          <span className="text-[11px] text-[#55695d] font-medium block">
                            {item.adopterName}
                          </span>
                        )}
                      </td>

                      {/* Variety & Reserve */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#173324] block">
                          {item.treeVarietyName || "Botanical Specimen"}
                        </span>
                        <span className="text-[11px] text-[#73877b] block truncate max-w-xs">
                          {item.assignedReserve}
                        </span>
                      </td>

                      {/* Exact GPS Coordinates */}
                      <td className="py-3.5 px-4 font-mono">
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#1b7a43] hover:underline flex items-center gap-1 w-fit"
                          title="Open in Google Maps"
                        >
                          <span>📍</span>
                          <span>{item.formattedGps}</span>
                        </a>
                        <span className="text-[10px] text-[#8b9c92] block">
                          Lat: {item.gpsCoordinates.latitude.toFixed(4)}, Lng: {item.gpsCoordinates.longitude.toFixed(4)}
                        </span>
                      </td>

                      {/* Date Planted */}
                      <td className="py-3.5 px-4 text-[#55695d]">
                        {formatDate(item.datePlanted)}
                      </td>

                      {/* Health Status */}
                      <td className="py-3.5 px-4">
                        {onUpdateHealth ? (
                          <select
                            value={item.healthStatus}
                            onChange={(e) => onUpdateHealth(item.id, e.target.value as TreeHealthStatus)}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold outline-none cursor-pointer ${badge.bg} ${badge.text} ${badge.border}`}
                          >
                            <option value="Sapling Growing">🌱 Sapling Growing</option>
                            <option value="Healthy">🌿 Healthy</option>
                            <option value="Thriving">🌳 Thriving</option>
                            <option value="Needs Attention">⚠️ Needs Attention</option>
                            <option value="Critical">🚨 Critical</option>
                          </select>
                        ) : (
                          <span
                            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold inline-flex items-center gap-1 ${badge.bg} ${badge.text} ${badge.border}`}
                          >
                            <span>{badge.icon}</span>
                            <span>{badge.label}</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {onDeleteInstance && (
                          <button
                            onClick={() => onDeleteInstance(item.id)}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer text-xs"
                            title={`Delete tree instance ${item.treeTag}`}
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const badge = HEALTH_BADGES[item.healthStatus] || {
              label: item.healthStatus,
              icon: "🌱",
              bg: "bg-gray-50",
              text: "text-gray-800",
              border: "border-gray-200",
            };
            const mapsUrl = `https://www.google.com/maps?q=${item.gpsCoordinates.latitude},${item.gpsCoordinates.longitude}`;

            return (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white border border-[#e2eae5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-[#1b7a43] bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                      {item.treeTag}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      <span>{badge.icon}</span>
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  <h3 style={{ fontFamily: "var(--font-display)" }} className="text-base font-bold text-[#173324]">
                    {item.treeVarietyName || "Botanical Tree Specimen"}
                  </h3>
                  <p className="text-xs text-[#73877b] mt-1">{item.assignedReserve}</p>

                  <div className="mt-4 pt-3 border-t border-[#f4f7f5] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#8b9c92]">Order Ref:</span>
                      <span className="font-mono font-semibold text-[#173324]">
                        {item.orderRef || "Nursery Reserve"}
                      </span>
                    </div>
                    {item.adopterName && (
                      <div className="flex justify-between">
                        <span className="text-[#8b9c92]">Adopter:</span>
                        <span className="font-medium text-[#173324]">{item.adopterName}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-[#8b9c92]">Exact GPS:</span>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono font-bold text-[#1b7a43] hover:underline text-[11px]"
                      >
                        📍 {item.formattedGps}
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8b9c92]">Date Planted:</span>
                      <span className="text-[#55695d]">{formatDate(item.datePlanted)}</span>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="mt-3 text-[11px] text-[#55695d] bg-[#f9fbfa] p-2 rounded-xl border border-[#e8f0ec] italic">
                      "{item.notes}"
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#f4f7f5] flex items-center justify-between">
                  {onUpdateHealth && (
                    <select
                      value={item.healthStatus}
                      onChange={(e) => onUpdateHealth(item.id, e.target.value as TreeHealthStatus)}
                      className="text-xs font-semibold px-2 py-1 rounded-lg border border-[#e2eae5] bg-[#f7faf8] text-[#173324] outline-none cursor-pointer"
                    >
                      <option value="Sapling Growing">🌱 Sapling Growing</option>
                      <option value="Healthy">🌿 Healthy</option>
                      <option value="Thriving">🌳 Thriving</option>
                      <option value="Needs Attention">⚠️ Needs Attention</option>
                      <option value="Critical">🚨 Critical</option>
                    </select>
                  )}

                  {onDeleteInstance && (
                    <button
                      onClick={() => onDeleteInstance(item.id)}
                      className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
