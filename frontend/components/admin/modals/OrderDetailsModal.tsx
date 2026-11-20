"use client";

import { useState, useEffect } from "react";
import { AdoptionOrder, AdoptionOrderStatus, PlantationLocationItem, TreeInstanceItem } from "../types";

interface OrderDetailsModalProps {
  order: AdoptionOrder | null;
  onClose: () => void;
  onDownloadCertificate: (certificateId: string) => void;
  onUpdateStatus?: (
    orderNumber: string,
    newStatus: AdoptionOrderStatus,
    gpsCoords?: string,
    reserveName?: string,
    notes?: string,
    treeTags?: string[],
    assignedTreeInstanceIds?: string[]
  ) => void;
  locations?: PlantationLocationItem[];
  instances?: TreeInstanceItem[];
  onOpenAssignTree?: (order: AdoptionOrder) => void;
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
    desc: "Sapling planted by forestry team at reserve sanctuary",
    color: "bg-lime-50 text-lime-800 border-lime-300",
  },
  {
    value: "Certificate Issued",
    label: "Certificate Issued",
    desc: "Digital deed generated & verified with blockchain timestamp",
    color: "bg-emerald-50 text-emerald-800 border-emerald-300",
  },
  {
    value: "Completed",
    label: "Completed",
    desc: "Fully mature record entered into permanent registry",
    color: "bg-teal-50 text-teal-800 border-teal-300",
  },
];

export function OrderDetailsModal({
  order,
  locations = [],
  instances = [],
  onClose,
  onDownloadCertificate,
  onUpdateStatus,
  onOpenAssignTree,
}: OrderDetailsModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<AdoptionOrderStatus | null>(null);
  const [reserveInput, setReserveInput] = useState("");
  const [notesInput, setNotesInput] = useState("");

  const matchingInstances = (instances || []).filter(
    (inst) =>
      (inst.orderRef && (inst.orderRef === order?.orderNumber || inst.orderRef === order?.id)) ||
      (order?.treeTag && inst.treeTag === order?.treeTag)
  );

  const assignedTreeTags = matchingInstances.length > 0
    ? matchingInstances.map((i) => i.treeTag).join(", ")
    : (order?.treeTag || "");

  useEffect(() => {
    if (order) {
      setSelectedStatus(null);
      const res = order.reserveName || (locations[0]?.name ?? "Western Ghats, Maharashtra");
      setReserveInput(res);
      setNotesInput(order.notes || `Planted at verified reserve parcel for ${order.adopterName}.`);
    }
  }, [order, locations]);

  if (!order) return null;

  const currentStatus = selectedStatus || order.status;
  const isCertificateAvailable =
    currentStatus === "Planted" ||
    currentStatus === "Certificate Issued" ||
    currentStatus === "Completed";

  const handleStatusChange = (newStatus: AdoptionOrderStatus) => {
    if (newStatus === "Planted" && !assignedTreeTags) {
      if (onOpenAssignTree) {
        onClose();
        onOpenAssignTree(order);
        return;
      }
    }
    setSelectedStatus(newStatus);
    if (onUpdateStatus) {
      onUpdateStatus(order.orderNumber, newStatus, "", reserveInput, notesInput);
    }
  };

  const getNextRecommendedStatus = (status: AdoptionOrderStatus): AdoptionOrderStatus | null => {
    switch (status) {
      case "New Request":
        return "Verified & Tagged";
      case "Verified & Tagged":
        return "Planted";
      case "Planted":
      case "Certificate Issued":
        return "Completed";
      default:
        return null;
    }
  };

  const nextStatus = getNextRecommendedStatus(currentStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto no-scrollbar p-6 shadow-2xl border border-[#e2eae5] relative animate-fadeIn">
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
          {order.treeSpecies === "Pending Admin Assignment"
            ? `${order.planType} Order Details`
            : `${order.treeSpecies} Adoption Details`}
        </h3>

        {/* Informational banner only when tree is already assigned */}
        {assignedTreeTags && (
          <div className="p-3 mb-4 rounded-2xl bg-[#f2faf5] border border-[#b4ddc3] text-[#173324] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌲</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#173324] block">
                  Assigned Tree Details
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800">
                  🏷️ {assignedTreeTags} • {order.treeSpecies}
                  {order.scientificName && (
                    <span className="text-[11px] text-emerald-700 italic ml-1">
                      ({order.scientificName})
                    </span>
                  )}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              ✓ Planted
            </span>
          </div>
        )}

        {/* Status Changing Option Panel */}
        <div className="p-4 mb-4 rounded-2xl bg-[#f0faf4] border border-[#cbe9d8]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#173324]">
              Sequential Workflow Status
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

          {/* Sequential Step Progress Bar */}
          <div className="grid grid-cols-4 gap-1.5 my-3">
            {["New Request", "Verified & Tagged", "Planted", "Completed"].map((st, idx) => {
              const stepIndex =
                currentStatus === "New Request"
                  ? 0
                  : currentStatus === "Verified & Tagged"
                  ? 1
                  : currentStatus === "Planted" || currentStatus === "Certificate Issued"
                  ? 2
                  : 3;
              const isPast = idx < stepIndex;
              const isCurrent = idx === stepIndex;
              return (
                <div
                  key={st}
                  className={`text-center py-1 px-1 rounded-lg text-[9px] font-bold border transition-all ${
                    isCurrent
                      ? "bg-[#173324] text-white border-[#173324] shadow-xs"
                      : isPast
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-white text-gray-400 border-gray-200"
                  }`}
                >
                  {isPast ? "✓ " : `${idx + 1}. `}
                  {st.replace("Verified & Tagged", "Tagged").replace("New Request", "New")}
                </div>
              );
            })}
          </div>

          {/* Sequential Action Controls */}
          {currentStatus === "New Request" && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => handleStatusChange("Verified & Tagged")}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-sky-700 hover:brightness-105 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Advance to Step 2: Verified & Tagged →</span>
              </button>
            </div>
          )}

          {currentStatus === "Verified & Tagged" && (
            <div className="mt-3 space-y-2.5 p-3.5 bg-white rounded-2xl border border-emerald-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <span>🌱</span>
                  <span>Stage 2 Complete: Ready to Assign Tree</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Ready to Plant
                </span>
              </div>
              <p className="text-[11px] text-[#55695d] leading-relaxed">
                Order is verified. Assign the tree species and unique tree ID to proceed to planting.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenAssignTree) {
                    onOpenAssignTree(order);
                  } else {
                    handleStatusChange("Planted");
                  }
                }}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-[#173324] to-[#1b7a43] hover:brightness-105 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🌱</span>
                <span>Assign Tree Species & Mark Planted →</span>
              </button>
            </div>
          )}

          {(currentStatus === "Planted" || currentStatus === "Certificate Issued") && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => handleStatusChange("Completed")}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-teal-700 to-teal-800 hover:brightness-105 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Finalize & Complete Order →</span>
              </button>
            </div>
          )}

          {currentStatus === "Completed" && (
            <div className="mt-2 text-center text-xs font-bold text-emerald-800 bg-emerald-100/60 py-2 rounded-xl">
              ✓ Order fully mature & registered in permanent living ledger
            </div>
          )}

          <p className="text-[11px] text-[#55695d] mt-2.5">
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
          {order.adopterPhone && (
            <div className="flex justify-between">
              <span className="text-[#7a8a80]">Adopter Phone:</span>
              <span className="font-semibold text-[#173324]">{order.adopterPhone}</span>
            </div>
          )}
          {order.invoiceNumber && (
            <div className="flex justify-between">
              <span className="text-[#7a8a80]">Tax Invoice No:</span>
              <span className="font-mono font-semibold text-[#1b7a43]">{order.invoiceNumber}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-1.5 px-2 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[#173324] font-bold">Assigned Living Tree:</span>
            <span className="font-mono font-bold text-xs text-[#1b7a43] flex items-center gap-1.5">
              {assignedTreeTags ? (
                <span>🏷️ {assignedTreeTags}</span>
              ) : (
                <span className="text-xs text-[#7a8a80] font-normal">Pending Planting</span>
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7a8a80]">Botanical Name:</span>
            <span className="font-semibold italic text-[#173324]">{order.scientificName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7a8a80]">Plantation Reserve:</span>
            <span className="font-semibold text-[#173324]">{order.reserveName} (On-Site Planting)</span>
          </div>
          {assignedTreeTags && (
            <div className="flex justify-between">
              <span className="text-[#7a8a80]">Assigned Tree IDs:</span>
              <span className="font-mono font-semibold text-[#1b7a43]">{assignedTreeTags}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[#7a8a80]">Plan Type:</span>
            <span className="font-semibold text-[#173324]">{order.planType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7a8a80]">Quantity & Total:</span>
            <span className="font-bold text-[#173324]">
              {order.quantity}x ₹{order.totalAmount.toLocaleString()}
            </span>
          </div>
          {order.paymentMethod && (
            <div className="flex justify-between">
              <span className="text-[#7a8a80]">Payment Method:</span>
              <span className="font-semibold text-[#173324] uppercase tracking-wider">{order.paymentMethod}</span>
            </div>
          )}
          {order.transactionRef && (
            <div className="flex justify-between">
              <span className="text-[#7a8a80]">Transaction Reference:</span>
              <span className="font-mono text-[11px] text-[#2d6a4f]">{order.transactionRef}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[#7a8a80]">Certificate Serial:</span>
            <span className="font-mono font-semibold text-[#2d6a4f]">{order.certificateId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7a8a80]">NDVI Vigour Score:</span>
            <span className="font-bold text-[#10b981]">{order.ndviScore} (High Quality)</span>
          </div>
          {order.notes && (
            <div className="pt-2 border-t border-[#e2eae5] text-[#55695d]">
              <span className="text-[11px] font-semibold text-[#7a8a80] block mb-0.5">Plantation Notes / Dedication:</span>
              <p className="text-[11px] italic bg-white p-2 rounded-xl border border-[#e8efe9]">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          {isCertificateAvailable && (
            <button
              onClick={() => onDownloadCertificate(order.certificateId)}
              className="flex-1 py-3 px-4 rounded-xl bg-[#173324] text-white font-semibold text-xs hover:bg-[#1e4433] transition-all cursor-pointer shadow-sm text-center"
            >
              Download Certificate
            </button>
          )}
          <button
            onClick={onClose}
            className={`${
              isCertificateAvailable ? "py-3 px-5" : "w-full py-3 px-5"
            } rounded-xl border border-[#e2eae5] text-[#55695d] hover:bg-[#f4f7f5] font-semibold text-xs transition-all cursor-pointer`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
