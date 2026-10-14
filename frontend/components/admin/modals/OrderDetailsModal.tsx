"use client";

import { AdoptionOrder } from "../types";

interface OrderDetailsModalProps {
  order: AdoptionOrder | null;
  onClose: () => void;
  onDownloadCertificate: (certificateId: string) => void;
}

export function OrderDetailsModal({
  order,
  onClose,
  onDownloadCertificate,
}: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e2eae5] relative animate-fadeIn">
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
        </div>

        <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#173324] mt-1 mb-4">
          {order.treeSpecies} Adoption Details
        </h3>

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
