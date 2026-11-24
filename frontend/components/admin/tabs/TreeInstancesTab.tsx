"use client";

import { useState, useMemo, useEffect } from "react";
import { TreeInstanceItem, TreeHealthStatus } from "../types";
import { TrashIcon, PencilIcon, Select } from "@/components/ui";
import { treeInstanceService } from "@/services/tree-instances/tree-instance.service";
import { getBackendOrigin } from "@/services/api/api-client";

interface TreeInstancesTabProps {
  instances: TreeInstanceItem[];
  searchQuery: string;
  onOpenAddInstance?: () => void;
  onLogInspection?: (instance: TreeInstanceItem) => void;
  onEditInstance?: (instance: TreeInstanceItem) => void;
  onUpdateHealth?: (id: string, status: TreeHealthStatus) => void;
  onDeleteInstance?: (id: string, tag?: string) => void;
}

export interface PurchaserGroup {
  purchaserName: string;
  purchaserEmail?: string;
  orderRefs: string[];
  reserves: string[];
  varieties: string[];
  totalTrees: number;
  trees: TreeInstanceItem[];
  healthCounts: Record<TreeHealthStatus, number>;
}

const HEALTH_FILTERS: { value: string; label: string; icon: string }[] = [
  { value: "All", label: "All Saplings", icon: "🌐" },
  { value: "Thriving", label: "Thriving", icon: "🌳" },
  { value: "Healthy", label: "Healthy", icon: "🌿" },
  { value: "Sapling Growing", label: "Sapling Growing", icon: "🌱" },
  { value: "Needs Attention", label: "Needs Attention", icon: "⚠️" },
  { value: "Critical", label: "Critical", icon: "🚨" },
];

const HEALTH_BADGES: Record<
  TreeHealthStatus,
  { label: string; icon: string; bg: string; text: string; border: string }
> = {
  Thriving: { label: "Thriving", icon: "🌳", bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  Healthy: { label: "Healthy", icon: "🌿", bg: "bg-green-50", text: "text-green-800", border: "border-green-200" },
  "Sapling Growing": { label: "Sapling Growing", icon: "🌱", bg: "bg-teal-50", text: "text-teal-800", border: "border-teal-200" },
  "Needs Attention": { label: "Needs Attention", icon: "⚠️", bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  Critical: { label: "Critical", icon: "🚨", bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
};

const resolveImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  const origin = getBackendOrigin();
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
};

export function TreeInstancesTab({
  instances,
  searchQuery,
  onLogInspection,
  onEditInstance,
  onUpdateHealth,
  onDeleteInstance,
}: TreeInstancesTabProps) {
  const [selectedHealth, setSelectedHealth] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grouped" | "table" | "grid">("grouped");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchQuery);
  const [serverInstances, setServerInstances] = useState<TreeInstanceItem[] | null>(null);
  const [serverTotal, setServerTotal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedHealth, pageSize]);

  // Base instances list (prioritize server data if loaded, otherwise prop data)
  const baseInstances = useMemo(() => {
    return serverInstances !== null && serverInstances.length > 0 ? serverInstances : instances;
  }, [serverInstances, instances]);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = baseInstances.length;
    const thrivingOrHealthy = baseInstances.filter(
      (i) => i.healthStatus === "Thriving" || i.healthStatus === "Healthy"
    ).length;
    const saplings = baseInstances.filter((i) => i.healthStatus === "Sapling Growing").length;
    const attentionNeeded = baseInstances.filter(
      (i) => i.healthStatus === "Needs Attention" || i.healthStatus === "Critical"
    ).length;
    return { total, thrivingOrHealthy, saplings, attentionNeeded };
  }, [baseInstances]);

  // Filtered list
  const filtered = useMemo(() => {
    return baseInstances.filter((item) => {
      const q = debouncedSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.treeTag.toLowerCase().includes(q) ||
        (item.orderRef && item.orderRef.toLowerCase().includes(q)) ||
        item.assignedReserve.toLowerCase().includes(q) ||
        item.treeVarietyName.toLowerCase().includes(q) ||
        (item.adopterName && item.adopterName.toLowerCase().includes(q)) ||
        (item.adopterEmail && item.adopterEmail.toLowerCase().includes(q));

      const matchesHealth = selectedHealth === "All" || item.healthStatus === selectedHealth;

      return matchesSearch && matchesHealth;
    });
  }, [baseInstances, debouncedSearch, selectedHealth]);

  // Group trees by purchaser / adopter name
  const purchaserGroups = useMemo(() => {
    const groupsMap = new Map<string, PurchaserGroup>();

    filtered.forEach((item) => {
      const name = item.adopterName?.trim() || "Unassigned / General Reserve";
      let group = groupsMap.get(name);
      if (!group) {
        group = {
          purchaserName: name,
          purchaserEmail: item.adopterEmail,
          orderRefs: [],
          reserves: [],
          varieties: [],
          totalTrees: 0,
          trees: [],
          healthCounts: {
            Thriving: 0,
            Healthy: 0,
            "Sapling Growing": 0,
            "Needs Attention": 0,
            Critical: 0,
          },
        };
        groupsMap.set(name, group);
      }

      if (item.adopterEmail && !group.purchaserEmail) {
        group.purchaserEmail = item.adopterEmail;
      }
      if (item.orderRef && !group.orderRefs.includes(item.orderRef)) {
        group.orderRefs.push(item.orderRef);
      }
      if (item.assignedReserve && !group.reserves.includes(item.assignedReserve)) {
        group.reserves.push(item.assignedReserve);
      }
      if (item.treeVarietyName && !group.varieties.includes(item.treeVarietyName)) {
        group.varieties.push(item.treeVarietyName);
      }

      group.totalTrees += 1;
      group.trees.push(item);

      if (item.healthStatus && group.healthCounts[item.healthStatus] !== undefined) {
        group.healthCounts[item.healthStatus] += 1;
      }
    });

    // Sort groups by total trees descending (e.g. bulk orders first)
    return Array.from(groupsMap.values()).sort((a, b) => b.totalTrees - a.totalTrees);
  }, [filtered]);

  // Fetch instances from backend API (fetch full catalog with high limit)
  useEffect(() => {
    let isMounted = true;
    async function fetchInstancesFromBackend() {
      setIsLoading(true);
      try {
        const res = await treeInstanceService.getAll({
          limit: 100,
          search: debouncedSearch.trim() || undefined,
          healthStatus: selectedHealth !== "All" ? selectedHealth : undefined,
        });

        if (isMounted && res.data) {
          const uiItems = res.data.items.map(treeInstanceService.mapToUiItem);
          setServerInstances(uiItems);
          setServerTotal(res.data.total);
        }
      } catch (err) {
        console.warn("Backend tree instances load notice:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchInstancesFromBackend();
    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, selectedHealth]);

  // Expand / Collapse group toggles
  const toggleGroup = (name: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [name]: prev[name] === false ? true : false,
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    purchaserGroups.forEach((g) => {
      all[g.purchaserName] = true;
    });
    setExpandedGroups(all);
  };

  const collapseAll = () => {
    const all: Record<string, boolean> = {};
    purchaserGroups.forEach((g) => {
      all[g.purchaserName] = false;
    });
    setExpandedGroups(all);
  };

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

  // Flat table pagination
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  const displayFlatInstances = useMemo(() => {
    return filtered.slice(startIndex, endIndex);
  }, [filtered, startIndex, endIndex]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#e2eae5] shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl sm:text-2xl font-bold text-[#173324]">
              Tree Saplings & Instances Ledger
            </h2>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {stats.total} Total Saplings
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#f4f7f5] text-[#55695d] border border-[#dce5df]">
              👥 {purchaserGroups.length} Purchasers
            </span>
            {isLoading && (
              <span className="w-3.5 h-3.5 border-2 border-[#1b7a43] border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          <p className="text-xs text-[#73877b] mt-1">
            Living trees and saplings planted exclusively through verified customer adoption orders. Grouped by purchaser name.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center p-1 rounded-xl bg-[#f2f6f3] border border-[#e2eae5]">
            <button
              onClick={() => setViewMode("grouped")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                viewMode === "grouped" ? "bg-white text-[#173324] shadow-xs" : "text-[#73877b] hover:text-[#173324]"
              }`}
            >
              <span>👥</span>
              <span>Grouped by Buyer</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                viewMode === "table" ? "bg-white text-[#173324] shadow-xs" : "text-[#73877b] hover:text-[#173324]"
              }`}
            >
              <span>📋</span>
              <span>Flat Table</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                viewMode === "grid" ? "bg-white text-[#173324] shadow-xs" : "text-[#73877b] hover:text-[#173324]"
              }`}
            >
              <span>🗂️</span>
              <span>Card Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Status KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 3xl:gap-5">
        <div className="p-4 3xl:p-6 rounded-2xl bg-white border border-[#e2eae5] shadow-xs">
          <span className="text-[10px] 3xl:text-xs text-[#73877b] font-bold uppercase tracking-wider block">
            Total Planted Trees
          </span>
          <span className="text-2xl 3xl:text-3xl font-bold text-[#173324] mt-1 block">
            {stats.total.toLocaleString()}
          </span>
        </div>
        <div className="p-4 3xl:p-6 rounded-2xl bg-white border border-[#e2eae5] shadow-xs">
          <span className="text-[10px] 3xl:text-xs text-blue-700 font-bold uppercase tracking-wider block">
            Active Purchasers
          </span>
          <span className="text-2xl 3xl:text-3xl font-bold text-blue-900 mt-1 block">
            {purchaserGroups.length.toLocaleString()}
          </span>
        </div>
        <div className="p-4 3xl:p-6 rounded-2xl bg-white border border-[#e2eae5] shadow-xs">
          <span className="text-[10px] 3xl:text-xs text-emerald-700 font-bold uppercase tracking-wider block">
            Thriving & Healthy
          </span>
          <span className="text-2xl 3xl:text-3xl font-bold text-emerald-800 mt-1 block">
            {stats.thrivingOrHealthy.toLocaleString()}
          </span>
        </div>
        <div className="p-4 3xl:p-6 rounded-2xl bg-white border border-[#e2eae5] shadow-xs">
          <span className="text-[10px] 3xl:text-xs text-teal-700 font-bold uppercase tracking-wider block">
            Saplings Growing
          </span>
          <span className="text-2xl 3xl:text-3xl font-bold text-teal-800 mt-1 block">
            {stats.saplings.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Health Status Filter Chips & Expand/Collapse */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

        {viewMode === "grouped" && purchaserGroups.length > 0 && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={expandAll}
              className="text-[11px] font-semibold text-[#1b7a43] hover:text-[#173324] bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="text-[11px] font-semibold text-[#55695d] hover:text-[#173324] bg-gray-50 hover:bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 transition-colors cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {purchaserGroups.length === 0 && !isLoading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#e2eae5] space-y-3">
          <div className="text-4xl">🌱</div>
          <h3 className="text-base font-bold text-[#173324]">No Tree Saplings Found</h3>
          <p className="text-xs text-[#73877b] max-w-md mx-auto leading-relaxed">
            {debouncedSearch || selectedHealth !== "All"
              ? "No tree saplings match your active search or health status filter."
              : "Tree saplings and living instances are automatically added to this ledger once a user completes a tree adoption purchase and the order is marked planted by the forestry team. Admin manual creation is restricted to maintain authentic ledger deeds."}
          </p>
        </div>
      ) : viewMode === "grouped" ? (
        /* ========================================================================= */
        /* GROUPED BY PURCHASER VIEW (DEFAULT)                                       */
        /* ========================================================================= */
        <div className="space-y-4">
          {purchaserGroups.map((group) => {
            const isExpanded = expandedGroups[group.purchaserName] !== false; // Default open
            const initialLetter = group.purchaserName.charAt(0).toUpperCase() || "U";

            return (
              <div
                key={group.purchaserName}
                className="bg-white rounded-3xl border border-[#e2eae5] shadow-xs overflow-hidden transition-all"
              >
                {/* Group Header Card */}
                <div
                  onClick={() => toggleGroup(group.purchaserName)}
                  className="p-5 sm:p-6 bg-gradient-to-r from-white via-[#fbfdfb] to-[#f4f8f5] flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-[#f6faf7] select-none border-b border-[#edf3ef]"
                >
                  {/* Left: User Avatar, Name, Email, Order Refs */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#173324] to-[#2d6a4f] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                      {initialLetter}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          style={{ fontFamily: "var(--font-display)" }}
                          className="text-lg sm:text-xl font-bold text-[#173324]"
                        >
                          {group.purchaserName}
                        </h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {group.totalTrees} {group.totalTrees === 1 ? "Tree Planted" : "Trees Planted"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#55695d] mt-1">
                        {group.purchaserEmail && (
                          <span className="flex items-center gap-1">
                            <span>✉️</span>
                            <span>{group.purchaserEmail}</span>
                          </span>
                        )}
                        {group.orderRefs.length > 0 && (
                          <span className="flex items-center gap-1 font-mono text-[11px] text-[#1b7a43]">
                            <span>🧾</span>
                            <span>{group.orderRefs.join(", ")}</span>
                          </span>
                        )}
                        {group.reserves.length > 0 && (
                          <span className="flex items-center gap-1 text-[11px]">
                            <span>📍</span>
                            <span>{group.reserves.join(" • ")}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Health Metrics Breakdown & Toggle */}
                  <div className="flex items-center gap-3">
                    <div className="hidden lg:flex items-center gap-1.5">
                      {group.healthCounts.Thriving > 0 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                          🌳 {group.healthCounts.Thriving} Thriving
                        </span>
                      )}
                      {group.healthCounts.Healthy > 0 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-green-50 text-green-800 border border-green-200">
                          🌿 {group.healthCounts.Healthy} Healthy
                        </span>
                      )}
                      {group.healthCounts["Sapling Growing"] > 0 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                          🌱 {group.healthCounts["Sapling Growing"]} Growing
                        </span>
                      )}
                      {group.healthCounts["Needs Attention"] > 0 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          ⚠️ {group.healthCounts["Needs Attention"]} Attention
                        </span>
                      )}
                      {group.healthCounts.Critical > 0 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
                          🚨 {group.healthCounts.Critical} Critical
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-[#173324] bg-white border border-[#d2ded7] px-3 py-1.5 rounded-xl shadow-2xs">
                      <span>{isExpanded ? "Collapse" : `View ${group.totalTrees} Trees`}</span>
                      <span className="text-sm font-bold ml-1">{isExpanded ? "▲" : "▼"}</span>
                    </div>
                  </div>
                </div>

                {/* Group Body: Trees Table (Visible when expanded) */}
                {isExpanded && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f8faf8] border-b border-[#e2eae5] text-[#7a8a80] uppercase tracking-wider font-bold">
                        <tr>
                          <th className="py-3 px-4 w-12 text-center">#</th>
                          <th className="py-3 px-4">Unique Tree ID</th>
                          <th className="py-3 px-4">Variety Specimen</th>
                          <th className="py-3 px-4">Sanctuary Location</th>
                          <th className="py-3 px-4">Date Planted</th>
                          <th className="py-3 px-4">Health Status</th>
                          <th className="py-3 px-4">Growth Journey</th>
                          <th className="py-3 px-4">Arborist Notes</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f4f1]">
                        {group.trees.map((item, idx) => {
                          const badge = HEALTH_BADGES[item.healthStatus] || {
                            label: item.healthStatus,
                            icon: "🌱",
                            bg: "bg-gray-50",
                            text: "text-gray-800",
                            border: "border-gray-200",
                          };
                          const updateCount = item.growthUpdates?.length || 0;

                          return (
                            <tr key={item.id} className="hover:bg-[#fbfcfb] transition-colors">
                              <td className="py-3 px-4 text-center text-[#8b9c92] font-mono text-[11px]">
                                {idx + 1}
                              </td>

                              {/* Tree Tag */}
                              <td className="py-3 px-4 font-mono">
                                <span className="font-bold text-[#1b7a43] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs inline-flex items-center gap-1.5">
                                  <span>🏷️</span>
                                  <span>{item.treeTag}</span>
                                </span>
                              </td>

                              {/* Variety */}
                              <td className="py-3 px-4 font-bold text-[#173324]">
                                {item.treeVarietyName || "Botanical Specimen"}
                              </td>

                              {/* Reserve */}
                              <td className="py-3 px-4 text-[#55695d]">
                                <span className="flex items-center gap-1">
                                  <span>📍</span>
                                  <span className="truncate max-w-[180px]">{item.assignedReserve}</span>
                                </span>
                              </td>

                              {/* Date Planted */}
                              <td className="py-3 px-4 text-[#73877b]">
                                {formatDate(item.datePlanted)}
                              </td>

                              {/* Health Status Selector */}
                              <td className="py-3 px-4">
                                {onUpdateHealth ? (
                                  <Select
                                    value={item.healthStatus}
                                    onChange={(e) =>
                                      handleHealthChange(item.id, e.target.value as TreeHealthStatus)
                                    }
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

                              {/* Growth Journey Pill / Trigger */}
                              <td className="py-3 px-4">
                                <button
                                  type="button"
                                  onClick={() => onLogInspection?.(item)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                                    updateCount > 0
                                      ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 shadow-2xs"
                                      : "bg-[#f4f7f5] text-[#55695d] border-[#dce5df] hover:bg-[#e8efe9]"
                                  }`}
                                  title="View growth journey or upload periodic photo"
                                >
                                  <span>📸</span>
                                  <span>
                                    {updateCount > 0
                                      ? `${updateCount} ${updateCount === 1 ? "Photo" : "Photos"}`
                                      : "+ Log Photo"}
                                  </span>
                                </button>
                              </td>

                              {/* Notes */}
                              <td className="py-3 px-4 text-[#55695d] max-w-xs truncate text-[11px] italic">
                                {item.notes || "Ground plantation verified."}
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {onLogInspection && (
                                    <button
                                      type="button"
                                      onClick={() => onLogInspection(item)}
                                      className="px-2.5 py-1 rounded-lg bg-[#173324] hover:bg-[#1f4230] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1 hover:scale-105"
                                      title="Log arborist inspection & growth photo"
                                    >
                                      <span>📸</span>
                                      <span className="hidden sm:inline">Log Update</span>
                                    </button>
                                  )}
                                  {onEditInstance && (
                                    <button
                                      type="button"
                                      onClick={() => onEditInstance(item)}
                                      className="p-1.5 rounded-lg border border-[#d2ded7] hover:bg-[#f2f6f3] text-[#55695d] hover:text-[#173324] transition-colors cursor-pointer text-xs"
                                      title="Edit tree details"
                                    >
                                      ✏️
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
                )}
              </div>
            );
          })}
        </div>
      ) : viewMode === "table" ? (
        /* ========================================================================= */
        /* FLAT TABLE VIEW                                                           */
        /* ========================================================================= */
        <div className="bg-white rounded-3xl border border-[#e2eae5] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7faf8] border-b border-[#e2eae5] text-[#7a8a80] uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-4 px-4">Unique Tree ID</th>
                  <th className="py-4 px-4">Purchaser / Adopter</th>
                  <th className="py-4 px-4">Order Ref</th>
                  <th className="py-4 px-4">Variety & Reserve</th>
                  <th className="py-4 px-4">Date Planted</th>
                  <th className="py-4 px-4">Health Status</th>
                  <th className="py-4 px-4">Growth Photos</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f1]">
                {displayFlatInstances.map((item) => {
                  const badge = HEALTH_BADGES[item.healthStatus] || {
                    label: item.healthStatus,
                    icon: "🌱",
                    bg: "bg-gray-50",
                    text: "text-gray-800",
                    border: "border-gray-200",
                  };
                  const updateCount = item.growthUpdates?.length || 0;

                  return (
                    <tr key={item.id} className="hover:bg-[#fbfcfb] transition-colors">
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-[#1b7a43] bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 text-xs block w-fit">
                          {item.treeTag}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#173324] block">
                          {item.adopterName || "Guest Purchaser"}
                        </span>
                        {item.adopterEmail && (
                          <span className="text-[10px] text-[#73877b] block">
                            {item.adopterEmail}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] font-semibold text-[#173324]">
                        {item.orderRef || "—"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#173324] block">
                          {item.treeVarietyName || "Botanical Specimen"}
                        </span>
                        <span className="text-[11px] text-[#73877b] block truncate max-w-xs">
                          {item.assignedReserve}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#55695d]">
                        {formatDate(item.datePlanted)}
                      </td>
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

                      {/* Growth Photos Count & Quick Trigger */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => onLogInspection?.(item)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                            updateCount > 0
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 shadow-2xs"
                              : "bg-[#f4f7f5] text-[#55695d] border-[#dce5df] hover:bg-[#e8efe9]"
                          }`}
                          title="View growth journey or upload periodic photo"
                        >
                          <span>📸</span>
                          <span>
                            {updateCount > 0
                              ? `${updateCount} ${updateCount === 1 ? "Update" : "Updates"}`
                              : "+ Add Photo"}
                          </span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onLogInspection && (
                            <button
                              type="button"
                              onClick={() => onLogInspection(item)}
                              className="px-2.5 py-1 rounded-lg bg-[#173324] hover:bg-[#1f4230] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1 hover:scale-105"
                              title="Log arborist inspection & growth photo"
                            >
                              <span>📸</span>
                              <span>Log Update</span>
                            </button>
                          )}
                          {onEditInstance && (
                            <button
                              type="button"
                              onClick={() => onEditInstance(item)}
                              className="p-1.5 rounded-lg border border-[#d2ded7] hover:bg-[#f2f6f3] text-[#55695d] hover:text-[#173324] transition-colors cursor-pointer text-xs"
                              title="Edit tree details"
                            >
                              ✏️
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

          {/* Flat Table Pagination Controls */}
          {totalCount > 0 && (
            <div className="bg-white p-4 border-t border-[#e2eae5] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#55695d]">
                Showing <span className="font-bold text-[#173324]">{startIndex + 1}</span> to{" "}
                <span className="font-bold text-[#173324]">{endIndex}</span> of{" "}
                <span className="font-bold text-[#173324]">{totalCount}</span> saplings
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                  className="px-3 py-1.5 rounded-xl border border-[#e2eae5] text-xs font-semibold text-[#173324] hover:bg-[#f2f6f3] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-xs font-semibold text-[#173324] px-2">
                  Page {safeCurrentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="px-3 py-1.5 rounded-xl border border-[#e2eae5] text-xs font-semibold text-[#173324] hover:bg-[#f2f6f3] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Next
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#73877b]">
                <span>Show</span>
                <Select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-xl border border-[#e2eae5] bg-[#fcfaf7] text-xs font-semibold text-[#173324]"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </Select>
                <span>per page</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* CARD GRID VIEW                                                            */
        /* ========================================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
          {displayFlatInstances.map((item) => {
            const badge = HEALTH_BADGES[item.healthStatus] || {
              label: item.healthStatus,
              icon: "🌱",
              bg: "bg-gray-50",
              text: "text-gray-800",
              border: "border-gray-200",
            };
            const updateCount = item.growthUpdates?.length || 0;

            return (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white border border-[#e2eae5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <span className="font-mono text-xs font-bold text-[#1b7a43] bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                      {item.treeTag}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onLogInspection?.(item)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 cursor-pointer transition-colors ${
                          updateCount > 0
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                            : "bg-[#f4f7f5] text-[#55695d] border-[#dce5df] hover:bg-[#e8efe9]"
                        }`}
                        title="View growth updates"
                      >
                        <span>📸</span>
                        <span>{updateCount}</span>
                      </button>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        <span>{badge.icon}</span>
                        <span>{badge.label}</span>
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontFamily: "var(--font-display)" }} className="text-base font-bold text-[#173324]">
                    {item.treeVarietyName || "Botanical Tree Specimen"}
                  </h3>
                  <p className="text-xs text-[#73877b] mt-1">{item.assignedReserve}</p>

                  <div className="mt-4 pt-3 border-t border-[#f4f5f4] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#8b9c92]">Purchaser:</span>
                      <span className="font-semibold text-[#173324]">{item.adopterName || "Guest"}</span>
                    </div>
                    {item.orderRef && (
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-[#8b9c92]">Order Ref:</span>
                        <span className="font-semibold text-[#173324]">{item.orderRef}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#8b9c92]">Date Planted:</span>
                      <span className="text-[#55695d]">{formatDate(item.datePlanted)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f4f7f5] flex items-center justify-between gap-2">
                  {onLogInspection && (
                    <button
                      type="button"
                      onClick={() => onLogInspection(item)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-[#173324] hover:bg-[#1f4230] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02]"
                    >
                      <span>📸</span>
                      <span>Log Inspection</span>
                    </button>
                  )}

                  {onEditInstance && (
                    <button
                      type="button"
                      onClick={() => onEditInstance(item)}
                      className="p-1.5 rounded-xl border border-[#d2ded7] hover:bg-[#f2f6f3] text-[#55695d] hover:text-[#173324] transition-colors cursor-pointer text-xs"
                      title="Edit tree details"
                    >
                      ✏️
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
