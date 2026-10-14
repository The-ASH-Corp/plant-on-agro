"use client";

import { useMemo } from "react";
import { AdoptionOrder } from "../types";

interface OrdersTabProps {
  orders: AdoptionOrder[];
  searchQuery: string;
  onSelectOrder: (order: AdoptionOrder) => void;
  onExportCSV: () => void;
}

export function OrdersTab({
  orders,
  searchQuery,
  onSelectOrder,
  onExportCSV,
}: OrdersTabProps) {
  const filteredOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.adopterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.adopterEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.treeSpecies.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.reserveName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-xs">
        <div>
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-[#173324]">
            Adoption Orders & Certificate Register ({filteredOrders.length})
          </h2>
          <p className="text-xs text-[#73877b]">Verified blockchain timestamped adoptions with digital certificate downloads</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            className="px-3.5 py-2 rounded-xl border border-emerald-200 text-xs font-semibold text-[#1b7a43] bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            Export CSV
          </button>
        </div>
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
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f1]">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#fbfcfb] transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] font-bold text-[#1b7a43] block">
                      {order.orderNumber}
                    </span>
                    <span className="font-semibold text-[#173324] block">{order.adopterName}</span>
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
                  <td className="py-3.5 px-4 font-bold text-[#173324]">
                    ₹{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {order.status}
                    </span>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
