"use client";

import { useState, useMemo, useEffect } from "react";
import { TreeInstanceItem, TreeHealthStatus } from "../types";
import { TrashIcon, PencilIcon, Select } from "@/components/ui";
import { treeInstanceService } from "@/services/tree-instances/tree-instance.service";

interface TreeInstancesTabProps {
  instances: TreeInstanceItem[];
  searchQuery: string;
  onOpenAddInstance: () => void;
  onEditInstance?: (instance: TreeInstanceItem) => void;
  onUpdateHealth?: (id: string, status: TreeHealthStatus) => void;
  onDeleteInstance?: (id: string, tag?: string) => void;
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

const resolveImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const origin = apiUrl.replace(/\/api\/v1\/?$/, "");
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
};

export function TreeInstancesTab({
  instances,
  searchQuery,
  onOpenAddInstance,
  onEditInstance,
  onUpdateHealth,
  onDeleteInstance,
}: TreeInstancesTabProps) {
  const [selectedHealth, setSelectedHealth] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchQuery);
  const [serverInstances, setServerInstances] = useState<TreeInstanceItem[] | null>(null);
  const [serverTotal, setServerTotal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Debounce search query to prevent excessive backend queries
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page to 1 whenever filters or page size change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedHealth, pageSize]);

  // Summary Metrics (derived from instances)
  const stats = useMemo(() => {
    const total = serverTotal !== null ? serverTotal : instances.length;
    const thrivingOrHealthy = instances.filter((i) => i.healthStatus === "Thriving" || i.healthStatus === "Healthy").length;
    const saplings = instances.filter((i) => i.healthStatus === "Sapling Growing").length;
    const attentionNeeded = instances.filter((i) => i.healthStatus === "Needs Attention" || i.healthStatus === "Critical").length;
    return { total, thrivingOrHealthy, saplings, attentionNeeded };
  }, [instances, serverTotal]);

  // Fallback client-side filtered list
  const filtered = useMemo(() => {
    return instances.filter((item) => {
      const q = debouncedSearch.toLowerCase();
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
  }, [instances, debouncedSearch, selectedHealth]);

  // Fetch paginated data from backend API
  useEffect(() => {
    let isMounted = true;
    async function fetchInstancesFromBackend() {
      setIsLoading(true);
      try {
        const skip = (currentPage - 1) * pageSize;
        const res = await treeInstanceService.getAll({
          limit: pageSize,
          skip,
          search: debouncedSearch.trim() || undefined,
          healthStatus: selectedHealth !== "All" ? selectedHealth : undefined,
        });

        if (isMounted && res.data) {
          const uiItems = res.data.items.map(treeInstanceService.mapToUiItem);
          setServerInstances(uiItems);
          setServerTotal(res.data.total);
        }
      } catch (err) {
        console.warn("Backend tree instances pagination notice:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchInstancesFromBackend();
    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, debouncedSearch, selectedHealth, instances]);

  // Total records count and pagination calculations
  const totalCount = serverTotal !== null ? serverTotal : filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);

  // Active items to render
  const displayInstances = useMemo(() => {
    if (serverInstances !== null) {
      return serverInstances;
    }
    return filtered.slice(startIndex, endIndex);
  }, [serverInstances, filtered, startIndex, endIndex]);

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

  // Optimistic health status change
  const handleHealthChange = (id: string, status: TreeHealthStatus) => {
    if (serverInstances) {
      setServerInstances((prev) =>
        prev ? prev.map((item) => (item.id === id ? { ...item, healthStatus: status } : item)) : prev
      );
    }
    if (onUpdateHealth) {
      onUpdateHealth(id, status);
    }
  };

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
          <div className="flex items-center gap-2.5">
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-[#173324]">
              Individual Tree Instances & Geotags ({totalCount})
            </h2>
            {totalPages > 1 && (
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#1b7a43] border border-emerald-200">
                Page {safeCurrentPage} of {totalPages}
              </span>
            )}
            {isLoading && (
              <span className="w-3.5 h-3.5 border-2 border-[#1b7a43] border-t-transparent rounded-full animate-spin" />
            )}
          </div>
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
      {totalCount === 0 && !isLoading ? (
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
                {displayInstances.map((item) => {
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
                      {/* Tree Tag & Thumbnail */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-2.5">
                          {item.imageUrl ? (
                            <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#d2ded7] shrink-0 bg-gray-100">
                              <img
                                src={resolveImageUrl(item.imageUrl)}
                                alt={item.treeTag}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-lg border border-dashed border-[#ccd9d1] bg-[#f4f7f5] flex items-center justify-center text-xs shrink-0 text-[#8b9c92]">
                              🌳
                            </div>
                          )}
                          <span className="font-bold text-[#1b7a43] bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 text-xs block w-fit">
                            {item.treeTag}
                          </span>
                        </div>
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
                       
                      </td>

                      {/* Date Planted */}
                      <td className="py-3.5 px-4 text-[#55695d]">
                        {formatDate(item.datePlanted)}
                      </td>

                      {/* Health Status */}
                      <td className="py-3.5 px-4">
                        {onUpdateHealth ? (
                          <Select
                            value={item.healthStatus}
                            onChange={(e) => handleHealthChange(item.id, e.target.value as TreeHealthStatus)}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold outline-none cursor-pointer ${badge.bg} ${badge.text} ${badge.border}`}
                          >
                            <option value="Sapling Growing">🌱 Sapling Growing</option>
                            <option value="Healthy">🌿 Healthy</option>
                            <option value="Thriving">🌳 Thriving</option>
                            <option value="Needs Attention">⚠️ Needs Attention</option>
                            <option value="Critical">🚨 Critical</option>
                          </Select>
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
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {onEditInstance && (
                            <button
                              type="button"
                              onClick={() => onEditInstance(item)}
                              className="text-[#173324] hover:text-[#1b7a43] hover:bg-emerald-50 p-1.5 rounded-lg transition-colors cursor-pointer text-xs inline-flex items-center justify-center border border-transparent hover:border-emerald-200"
                              title={`Edit tree instance ${item.treeTag}`}
                            >
                              <PencilIcon className="w-3.5 h-3.5 text-[#1b7a43]" />
                            </button>
                          )}
                          {onDeleteInstance && (
                            <button
                              type="button"
                              onClick={() => onDeleteInstance(item.id, item.treeTag ? `${item.treeTag} (${item.treeVarietyName})` : item.treeVarietyName)}
                              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer text-xs inline-flex items-center justify-center border border-transparent hover:border-rose-200"
                              title={`Delete tree instance ${item.treeTag}`}
                            >
                              <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
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
          {displayInstances.map((item) => {
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
                className="p-5 rounded-3xl bg-white border border-[#e2eae5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div>
                  {item.imageUrl && (
                    <div className="h-32 -mx-5 -mt-5 mb-3 overflow-hidden bg-gray-100">
                      <img
                        src={resolveImageUrl(item.imageUrl)}
                        alt={item.treeTag}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
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
                    <Select
                      value={item.healthStatus}
                      onChange={(e) => handleHealthChange(item.id, e.target.value as TreeHealthStatus)}
                      className="text-xs font-semibold px-2 py-1 rounded-lg border border-[#e2eae5] bg-[#f7faf8] text-[#173324] outline-none cursor-pointer"
                    >
                      <option value="Sapling Growing">🌱 Sapling Growing</option>
                      <option value="Healthy">🌿 Healthy</option>
                      <option value="Thriving">🌳 Thriving</option>
                      <option value="Needs Attention">⚠️ Needs Attention</option>
                      <option value="Critical">🚨 Critical</option>
                    </Select>
                  )}

                  <div className="flex items-center gap-1.5">
                    {onEditInstance && (
                      <button
                        type="button"
                        onClick={() => onEditInstance(item)}
                        className="inline-flex items-center gap-1 text-[#173324] hover:text-[#1b7a43] hover:bg-emerald-50 px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-transparent hover:border-emerald-200"
                        title={`Edit tree instance ${item.treeTag}`}
                      >
                        <PencilIcon className="w-3.5 h-3.5 text-[#1b7a43]" />
                        <span>Edit</span>
                      </button>
                    )}
                    {onDeleteInstance && (
                      <button
                        type="button"
                        onClick={() => onDeleteInstance(item.id, item.treeTag ? `${item.treeTag} (${item.treeVarietyName})` : item.treeVarietyName)}
                        className="inline-flex items-center gap-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-transparent hover:border-rose-200"
                        title={`Delete tree instance ${item.treeTag}`}
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls Bar */}
      {totalCount > 0 && (
        <div className="bg-white p-4 rounded-3xl border border-[#e2eae5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Record summary */}
          <div className="text-xs text-[#55695d]">
            Showing <span className="font-bold text-[#173324]">{startIndex + 1}</span> to{" "}
            <span className="font-bold text-[#173324]">{endIndex}</span> of{" "}
            <span className="font-bold text-[#173324]">{totalCount}</span> tree instances
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
            <Select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-xl border border-[#e2eae5] bg-[#fcfaf7] text-xs font-semibold text-[#173324] focus:border-[#173324] outline-none cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Select>
            <span>per page</span>
          </div>
        </div>
      )}
    </div>
  );
}
