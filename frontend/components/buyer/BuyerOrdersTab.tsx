"use client";

import { useState } from "react";
import { BuyerOrderRecord } from "./types";

interface BuyerOrdersTabProps {
  orders: BuyerOrderRecord[];
  onOpenPlantFlow: () => void;
  onViewInvoice: (order: BuyerOrderRecord) => void;
}

export function BuyerOrdersTab({
  orders,
  onOpenPlantFlow,
  onViewInvoice,
}: BuyerOrdersTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalTreesSeeded = orders.reduce((sum, o) => sum + (o.quantity || 1), 0);

  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(term) ||
      o.invoiceNumber.toLowerCase().includes(term) ||
      o.treeSpecies.toLowerCase().includes(term) ||
      o.reserveName.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "All" || o.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Top Ledger Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e2eae5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📦</span>
            <h2 className="text-base sm:text-lg font-bold text-[#173324]">
              Adoption Orders & Payment Ledger
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              {orders.length} Records
            </span>
          </div>
          <p className="text-xs text-[#52796f] mt-1">
            Complete transaction history, tax invoices, and verified afforestation contracts.
          </p>
        </div>

        <button
          onClick={onOpenPlantFlow}
          className="text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-[#1b7a43] to-[#2d6a4f] text-white hover:scale-105 transition-transform shadow-sm cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>🌱</span>
          <span>New Tree Adoption</span>
        </button>
      </div>

      {/* 4 Financial & Telemetry Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-[#e2eae5] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#52796f] block">Total Invoices</span>
          <p className="text-xl font-bold font-serif text-[#173324] mt-0.5">{orders.length}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">100% Verified</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#e2eae5] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#52796f] block">Trees Seeded</span>
          <p className="text-xl font-bold font-serif text-emerald-700 mt-0.5">{totalTreesSeeded} Trees</p>
          <span className="text-[10px] text-[#52796f]">Lifetime Afforestation</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#e2eae5] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#52796f] block">Total Contribution</span>
          <p className="text-xl font-bold font-mono text-[#173324] mt-0.5">₹{totalSpent.toLocaleString()}</p>
          <span className="text-[10px] text-teal-700 font-semibold">Zero Hidden Fees</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#e2eae5] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#52796f] block">Payment Gateway</span>
          <p className="text-sm font-bold text-[#173324] mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            100% Cleared
          </p>
          <span className="text-[10px] text-gray-500">Tax Exempt Receipt</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl p-3 border border-[#e2eae5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
          <input
            type="text"
            placeholder="Search by order #, invoice #, species, reserve..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["All", "Planted", "Verified & Tagged", "New Request"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? "bg-[#173324] text-white shadow-xs"
                  : "bg-[#f4f7f5] text-[#52796f] hover:text-[#173324]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Ledger Table */}
      <div className="bg-white rounded-2xl border border-[#e2eae5] shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mx-auto shadow-inner">
              📦
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#173324]">No Orders Found</h3>
              <p className="text-xs text-[#52796f] mt-1">
                {searchTerm || statusFilter !== "All"
                  ? "No transactions match your search criteria."
                  : "You haven't adopted any trees yet. Start your green legacy today!"}
              </p>
            </div>
            <button
              onClick={onOpenPlantFlow}
              className="mt-2 text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-[#1b7a43] to-[#2d6a4f] text-white hover:scale-105 transition-transform shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>🌱</span>
              <span>Adopt Your First Tree</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7faf8] border-b border-[#e2eae5] text-[#6b7c72] uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order / Invoice</th>
                  <th className="py-3 px-4">Species & Tier</th>
                  <th className="py-3 px-4">Reserve Parcel</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f1]">
                {filteredOrders.map((order) => {
                  return (
                    <tr
                      key={order.id || order.orderNumber}
                      className="hover:bg-[#fafcfb] transition-colors"
                    >
                      {/* Order / Invoice Number */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#1b7a43] text-[11px] block">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {order.invoiceNumber}
                        </span>
                      </td>

                      {/* Tree Species */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#173324] block">{order.treeSpecies}</span>
                        <span className="text-[10px] text-[#52796f]">
                          {order.quantity} {order.quantity > 1 ? "Trees" : "Tree"} • {order.planType}
                        </span>
                      </td>

                      {/* Reserve */}
                      <td className="py-3.5 px-4">
                        <span className="text-[#173324] font-medium block truncate max-w-[160px]">
                          {order.reserveName}
                        </span>
                        {order.gpsCoords && (
                          <span className="text-[10px] font-mono text-[#73877b] block truncate max-w-[160px]">
                            {order.gpsCoords}
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-gray-600 text-[11px] font-mono">
                        {typeof order.date === "string"
                          ? order.date.split("T")[0]
                          : new Date(order.date).toISOString().split("T")[0]}
                      </td>

                      {/* Amount Paid */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#173324]">
                        ₹{order.totalAmount.toLocaleString()}
                        <span className="block text-[9px] text-emerald-700 font-sans uppercase font-bold">
                          {order.paymentMethod}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {order.status || "Planted"}
                        </span>
                      </td>

                      {/* Invoice Button */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onViewInvoice(order)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-[#1b7a43] border border-emerald-300 text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1 hover:border-emerald-500"
                        >
                          <span>🧾</span>
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
