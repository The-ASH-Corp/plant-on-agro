"use client";

import { useState } from "react";
import { AdoptionOrder, AdoptionOrderStatus } from "../types";

interface OrderDetailsModalProps {
  order: AdoptionOrder | null;
  onClose: () => void;
  onDownloadCertificate: (certificateId: string) => void;
  onUpdateStatus?: (orderNumber: string, newStatus: AdoptionOrderStatus) => void;
}

const ALL_STATUSES: { value: AdoptionOrderStatus; label: string; desc: string; color: string }[] = [
  {
    value: "New Request",
    label: "New Request",
    desc: "Buyer submitted adoption, awaiting initial admin review",
    color: "bg-amber-50 text-amber-800 border-amber-300",
  },
  {
    value: "Verified & Tagged",
    label: "Verified & Tagged",
    desc: "Nursery batch confirmed & assigned sapling serial tag",
    color: "bg-sky-50 text-sky-800 border-sky-300",
  },
  {
    value: "Planted",
    label: "Planted in Ground",
    desc: "Sapling physically planted by forestry team at reserve parcel",
    color: "bg-lime-50 text-lime-800 border-lime-300",
  },
  {
    value: "Pending Drone Scan",
    label: "Pending Drone Scan",
    desc: "Awaiting NDVI canopy index and telemetry scan",
    color: "bg-purple-50 text-purple-800 border-purple-300",
  },
  {
    value: "Certificate Issued",
    label: "Certificate Issued",
    desc: "Digital deed generated & verified with blockchain timestamp",
    color: "bg-emerald-50 text-emerald-800 border-emerald-300",
  },
  {
    value: "Completed",
    label: "Completed & Archived",
    desc: "Fully mature record entered into permanent registry",
    color: "bg-teal-50 text-teal-800 border-teal-300",
  },
];

export function OrderDetailsModal({
  order,
  onClose,
  onDownloadCertificate,
  onUpdateStatus,
}: OrderDetailsModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<AdoptionOrderStatus | null>(null);

  if (!order) return null;

  const currentStatus = selectedStatus || order.status;

  const handleStatusChange = (newStatus: AdoptionOrderStatus) => {
    setSelectedStatus(newStatus);
    if (onUpdateStatus) {
      onUpdateStatus(order.orderNumber, newStatus);
    }
  };

  const getNextRecommendedStatus = (status: AdoptionOrderStatus): AdoptionOrderStatus | null => {
    switch (status) {
      case "New Request":
        return "Verified & Tagged";
      case "Verified & Tagged":
        return "Planted";
      case "Planted":
        return "Pending Drone Scan";
      case "Pending Drone Scan":
        return "Certificate Issued";
      case "Certificate Issued":
        return "Completed";
      default:
        return null;
    }
  };

  const nextStatus = getNextRecommendedStatus(currentStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#e2eae5] relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#7a8a80] hover:text-[#173324] text-lg font-bold cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs font-bold text-[#1b7a43] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            {order.orderNumber}
          </span>
          <span className="text-xs text-[#7a8a80]">{order.datePlanted}</span>
          {order.status === "New Request" && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
              NEW REQUEST
            </span>
          )}
        </div>

        <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#173324] mt-1 mb-3">
          {order.treeSpecies} Adoption Details
        </h3>

        {/* Status Changing Option Panel */}
        <div className="p-3.5 mb-4 rounded-2xl bg-[#f0faf4] border border-[#cbe9d8]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#173324]">
              Workflow Status
            </span>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                ALL_STATUSES.find((s) => s.value === currentStatus)?.color ||
                "bg-emerald-50 text-emerald-800 border-emerald-300"
              }`}
            >
              {currentStatus}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1">
              <select
                id="select-order-modal-status"
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value as AdoptionOrderStatus)}
                className="w-full text-xs font-medium py-2 px-3 rounded-xl border border-[#b2ddc4] bg-white text-[#173324] outline-none focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] cursor-pointer"
              >
                {ALL_STATUSES.map((st) => (
                  <option key={st.value} value={st.value}>
                    Status: {st.label}
                  </option>
                ))}
              </select>
            </div>

            {nextStatus && (
              <button
                type="button"
                onClick={() => handleStatusChange(nextStatus)}
                className="px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#1b7a43] to-[#2d6a4f] hover:brightness-105 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                Advance to: {nextStatus} →
              </button>
            )}
          </div>
          <p className="text-[11px] text-[#55695d] mt-2">
            {ALL_STATUSES.find((s) => s.value === currentStatus)?.desc}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#f7faf8] border border-[#e2eae5] space-y-2.5 text-xs mb-5">
          <div className="flex justify-between">
            <span className="text-[#7a8a80]">Adopter Name:</span>
            <span className="font-semibold text-[#173324]">{order.adopterName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7a8a80]">Adopter Email:</span>
            <span className="font-semibold text-[#173324]">{order.adopterEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7a8a80]">Botanical Name:</span>
            <span className="font-semibold italic text-[#173324]">{order.scientificName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7a8a80]">Reserve Parcel:</span>
            <span className="font-semibold text-[#173324]">{order.reserveName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7a8a80]">GPS Coordinates:</span>
            <span className="font-mono font-semibold text-[#1b7a43]">{order.gpsCoords}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7a8a80]">Plan Type:</span>
            <span className="font-semibold text-[#173324]">{order.planType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7a8a80]">Quantity & Total:</span>
            <span className="font-bold text-[#173324]">
              {order.quantity}x • ₹{order.totalAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7a8a80]">Certificate Serial:</span>
            <span className="font-mono font-semibold text-[#2d6a4f]">{order.certificateId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7a8a80]">NDVI Vigour Score:</span>
            <span className="font-bold text-[#10b981]">{order.ndviScore} (High Quality)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onDownloadCertificate(order.certificateId)}
            className="flex-1 py-3 px-4 rounded-xl bg-[#173324] text-white font-semibold text-xs hover:bg-[#1e4433] transition-all cursor-pointer shadow-sm text-center"
          >
            Download Certificate
          </button>
          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl border border-[#e2eae5] text-[#55695d] hover:bg-[#f4f7f5] font-semibold text-xs transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

