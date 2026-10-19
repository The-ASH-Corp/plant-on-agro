"use client";

import { useMemo, useState } from "react";
import { AdoptionOrder, AdoptionOrderStatus } from "../types";

interface OrdersTabProps {
  orders: AdoptionOrder[];
  searchQuery: string;
  onSelectOrder: (order: AdoptionOrder) => void;
  onExportCSV: () => void;
  onUpdateStatus?: (orderNumber: string, newStatus: AdoptionOrderStatus) => void;
  onMarkAllAsRead?: () => void;
  unreadCount?: number;
}

const STATUS_CONFIG: Record<
  AdoptionOrderStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  "New Request": {
    label: "New Request",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-400/40",
    dotClass: "bg-amber-500 animate-ping",
  },
  "Verified & Tagged": {
    label: "Verified & Tagged",
    badgeClass: "bg-sky-50 text-sky-800 border-sky-300",
    dotClass: "bg-sky-500",
  },
  Planted: {
    label: "Planted",
    badgeClass: "bg-lime-50 text-lime-800 border-lime-300",
    dotClass: "bg-lime-500",
  },
  "Pending Drone Scan": {
    label: "Pending Drone Scan",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-300",
    dotClass: "bg-purple-500",
  },
  "Certificate Issued": {
    label: "Certificate Issued",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-300",
    dotClass: "bg-emerald-500",
  },
  Completed: {
    label: "Completed",
    badgeClass: "bg-teal-50 text-teal-800 border-teal-300",
    dotClass: "bg-teal-500",
  },
};

const ALL_STATUSES: AdoptionOrderStatus[] = [
  "New Request",
  "Verified & Tagged",
  "Planted",
  "Pending Drone Scan",
  "Certificate Issued",
  "Completed",
];

export function OrdersTab({
  orders,
  searchQuery,
  onSelectOrder,
  onExportCSV,
  onUpdateStatus,
  onMarkAllAsRead,
  unreadCount = 0,
}: OrdersTabProps) {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");

  const countsByStatus = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    ALL_STATUSES.forEach((st) => {
      counts[st] = orders.filter((o) => o.status === st).length;
    });
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.adopterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.adopterEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.treeSpecies.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.reserveName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatusFilter === "all" || o.status === selectedStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, selectedStatusFilter]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-[#173324]">
              Adoption Orders & Certificate Register ({filteredOrders.length})
            </h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white animate-pulse">
                {unreadCount} New Requests
              </span>
            )}
          </div>
          <p className="text-xs text-[#73877b] mt-1">
            Real-time verified adoption requests, status workflow management, and digital certificates
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && onMarkAllAsRead && (
            <button
              onClick={onMarkAllAsRead}
              className="px-3.5 py-2 rounded-xl border border-amber-300 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              ✓ Mark All Reviewed
            </button>
          )}
          <button
            onClick={onExportCSV}
            className="px-3.5 py-2 rounded-xl border border-emerald-200 text-xs font-semibold text-[#1b7a43] bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedStatusFilter("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedStatusFilter === "all"
              ? "bg-[#173324] text-white shadow-xs"
              : "bg-white text-[#55695d] hover:bg-[#f2f7f4] border border-[#e2eae5]"
          }`}
        >
          All Orders ({countsByStatus.all || 0})
        </button>

        {ALL_STATUSES.map((st) => {
          const count = countsByStatus[st] || 0;
          const isActive = selectedStatusFilter === st;
          const isNewReq = st === "New Request";

          return (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#173324] text-white shadow-xs"
                  : isNewReq && count > 0
                  ? "bg-amber-50 text-amber-800 border border-amber-300 font-bold"
                  : "bg-white text-[#55695d] hover:bg-[#f2f7f4] border border-[#e2eae5]"
              }`}
            >
              <span>{st}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive
                    ? "bg-white/20 text-white"
                    : isNewReq && count > 0
                    ? "bg-amber-200 text-amber-900 font-bold"
                    : "bg-[#eaf2ec] text-[#55695d]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Data Table */}
      <div className="bg-white rounded-3xl border border-[#e2eae5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7faf8] border-b border-[#e2eae5] text-[#7a8a80] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-4 px-4">Order / Adopter</th>
                <th className="py-4 px-4">Species & Plan</th>
                <th className="py-4 px-4">Reserve Geotag</th>
                <th className="py-4 px-4">Total Amount</th>
                <th className="py-4 px-4">Status Workflow (Changeable)</th>
                <th className="py-4 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f1]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#73877b]">
                    <div className="text-3xl mb-2">🔍</div>
                    <div className="font-semibold text-sm text-[#173324]">No orders match this filter</div>
                    <p className="text-xs text-[#73877b] mt-1">Try resetting the status filter or search query</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isUnread = order.isRead === false || order.status === "New Request";
                  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG["Certificate Issued"];

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-[#fbfcfb] transition-colors ${
                        isUnread ? "bg-amber-50/20" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] font-bold text-[#1b7a43] block">
                            {order.orderNumber}
                          </span>
                          {isUnread && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500 text-white tracking-wider">
                              NEW
                            </span>
                          )}
                        </div>
                        {order.invoiceNumber && (
                          <span className="font-mono text-[9px] text-[#7a8a80] block">
                            {order.invoiceNumber}
                          </span>
                        )}
                        <span className="font-semibold text-[#173324] block mt-0.5">{order.adopterName}</span>
                        <span className="text-[11px] text-[#73877b]">{order.adopterEmail}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#173324] block">{order.treeSpecies}</span>
                        <span className="text-[11px] text-[#55695d]">{order.planType}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[#173324] font-medium block">{order.reserveName}</span>
                        <span className="font-mono text-[10px] text-[#73877b]">{order.gpsCoords}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#173324] block">
                          ₹{order.totalAmount.toLocaleString()}
                        </span>
                        <span className="inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {order.paymentStatus || "Paid"}
                        </span>
                      </td>

                      {/* Status changing dropdown selector */}
                      <td className="py-3.5 px-4">
                        <div className="relative inline-flex items-center">
                          <select
                            id={`status-select-${order.orderNumber}`}
                            value={order.status}
                            onChange={(e) => {
                              const newSt = e.target.value as AdoptionOrderStatus;
                              if (onUpdateStatus) {
                                onUpdateStatus(order.orderNumber, newSt);
                              }
                            }}
                            className={`text-[11px] font-bold py-1.5 pl-3 pr-7 rounded-full border cursor-pointer appearance-none outline-none transition-all ${config.badgeClass}`}
                          >
                            {ALL_STATUSES.map((st) => (
                              <option key={st} value={st} className="bg-white text-gray-900 font-normal">
                                {st}
                              </option>
                            ))}
                          </select>
                          <span className="absolute right-2.5 pointer-events-none text-[9px] text-[#55695d]">
                            ▼
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="px-3 py-1.5 rounded-xl bg-[#173324] text-white text-xs font-semibold hover:bg-[#1f4230] transition-colors cursor-pointer"
                        >
                          Inspect →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

