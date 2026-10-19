"use client";

import { BuyerOrderRecord } from "./types";

interface InvoiceModalProps {
  order: BuyerOrderRecord | null;
  onClose: () => void;
}

export function InvoiceModal({ order, onClose }: InvoiceModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0f2419] rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/40 text-white flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/20 bg-[#08170f]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🧾</span>
            <div>
              <h3 className="text-sm font-bold tracking-wide">Official Adoption Tax Invoice</h3>
              <p className="text-[11px] text-emerald-400 font-mono">Invoice #{order.invoiceNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <span>🖨️</span>
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Invoice Body Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-2xl p-6 sm:p-8 shadow-inner border border-gray-200">
            {/* Invoice Top Branding */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 font-mono block">
                  PlantOn Agro Forestry Registry
                </span>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mt-0.5">
                  Tax Invoice & Deed Receipt
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  National Afforestation & Environmental Offset Protocol
                </p>
              </div>

              <div className="sm:text-right">
                <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 mb-1">
                  ● 100% Payment Cleared
                </span>
                <p className="text-xs font-mono font-bold text-gray-700">Invoice: {order.invoiceNumber}</p>
                <p className="text-[11px] text-gray-500 font-mono">Order: {order.orderNumber}</p>
                <p className="text-[11px] text-gray-500">Date: {order.date}</p>
              </div>
            </div>

            {/* Billed To / Telemetry Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-gray-200 text-xs">
              <div>
                <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block mb-1">
                  Billed To (Adopter)
                </span>
                <p className="font-bold text-sm text-gray-900">{order.adopterName}</p>
                <p className="text-gray-600">{order.adopterEmail}</p>
                {order.adopterPhone && <p className="text-gray-600">{order.adopterPhone}</p>}
                <p className="text-emerald-700 font-semibold mt-1">Role: Verified Living Tree Adopter</p>
              </div>

              <div>
                <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block mb-1">
                  Afforestation Parcel
                </span>
                <p className="font-bold text-gray-900">{order.reserveName}</p>
                {order.gpsCoords && (
                  <p className="font-mono text-gray-600 text-[11px]">GPS: {order.gpsCoords}</p>
                )}
                <p className="font-mono text-gray-600 text-[11px]">Deed ID: {order.certificateId || "CERT-" + order.orderNumber}</p>
                <p className="text-gray-600 text-[11px]">Method: {order.paymentMethod.toUpperCase()}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="py-4 border-b border-gray-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] tracking-wider">
                    <th className="py-2">Description / Package</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit Rate</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3">
                      <strong className="text-gray-900 block">{order.treeSpecies}</strong>
                      <span className="text-[11px] text-gray-500">
                        {order.planType} Lifetime Adoption Package (Nursery seed, GPS tagging, arborist care)
                      </span>
                    </td>
                    <td className="py-3 text-center font-bold text-gray-800">{order.quantity}</td>
                    <td className="py-3 text-right font-mono text-gray-700">
                      ₹{Math.round(order.totalAmount / order.quantity).toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-gray-900">
                      ₹{order.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Summary */}
            <div className="py-4 space-y-1.5 text-xs text-right border-b border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-mono">₹{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Afforestation & Environmental Cess (0%):</span>
                <span className="font-mono">₹0</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Drone Telemetry & Maintenance Fee:</span>
                <span className="font-mono text-emerald-700 font-bold">Waived (Lifetime Single-Payment)</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Paid:</span>
                <span className="font-mono text-[#1b7a43] text-lg">₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Stamp & Verification Seal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-gray-500">
              <div className="space-y-0.5">
                <span className="font-bold text-gray-700 text-[10px] uppercase block">
                  Cryptographic Verification Seal
                </span>
                <p className="font-mono text-[10px] text-gray-500">
                  TXN: {order.transactionRef || `TXN-${order.orderNumber}-CLEARED`}
                </p>
                <p className="text-[10px] text-emerald-700 font-semibold">
                  ✓ Registered under Living Afforestation Registry
                </p>
              </div>

              {/* Official Seal badge */}
              <div className="w-16 h-16 rounded-full border-2 border-emerald-600 border-dashed p-1 flex items-center justify-center text-center">
                <div className="w-full h-full rounded-full bg-emerald-50 flex flex-col items-center justify-center text-[7px] font-bold text-emerald-800">
                  <span>★ VERIFIED ★</span>
                  <span className="text-[10px]">🌿</span>
                  <span>PAID</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
