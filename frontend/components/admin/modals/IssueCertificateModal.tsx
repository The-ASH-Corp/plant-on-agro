"use client";

import { useState } from "react";
import { Select } from "@/components/ui";
import { AdoptionOrder, TreeInstanceItem } from "../types";

interface IssueCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting?: boolean;
  orders?: AdoptionOrder[];
  instances?: TreeInstanceItem[];
}

export function IssueCertificateModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  orders = [],
  instances = [],
}: IssueCertificateModalProps) {
  const [selectedOrderRef, setSelectedOrderRef] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");
  const [adopterName, setAdopterName] = useState<string>("");
  const [dedicatedMessage, setDedicatedMessage] = useState<string>("");
  const [treeSpecies, setTreeSpecies] = useState<string>("");
  const [treeTag, setTreeTag] = useState<string>("");
  const [reserveName, setReserveName] = useState<string>("");

  if (!isOpen) return null;

  const handleOrderSelect = (orderNumber: string) => {
    setSelectedOrderRef(orderNumber);
    if (!orderNumber) return;

    const matchedOrder = orders.find(
      (o) => o.orderNumber === orderNumber || o.id === orderNumber
    );
    if (matchedOrder) {
      if (!recipientName) setRecipientName(matchedOrder.adopterName);
      if (!adopterName) setAdopterName(matchedOrder.adopterName);
      if (!treeSpecies) setTreeSpecies(matchedOrder.treeSpecies);
      if (!reserveName) setReserveName(matchedOrder.reserveName);
      if (!dedicatedMessage) {
        setDedicatedMessage(
          `In recognition of adopting ${matchedOrder.quantity} living ${matchedOrder.treeSpecies} tree(s) at ${matchedOrder.reserveName}, contributing to native afforestation and environmental biodiversity.`
        );
      }

      // Try to find matching tree tag
      const matchedInst = instances.find(
        (i) => i.orderRef === orderNumber || i.orderRef === matchedOrder.id
      );
      if (matchedInst && !treeTag) {
        setTreeTag(matchedInst.treeTag);
      }
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#e2eae5] relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          type="button"
          disabled={isSubmitting}
          className="absolute top-5 right-5 text-[#7a8a80] hover:text-[#173324] text-lg font-bold cursor-pointer disabled:opacity-50"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Deed & Certificate Registry
          </span>
        </div>

        <h3
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl text-[#173324] mb-1 font-bold"
        >
          Issue Official Plantation Deed
        </h3>
        <p className="text-xs text-[#55695d] mb-4">
          Generate a verified digital afforestation deed stamped with a cryptographic SHA-256 seal.
        </p>

        {/* Quick Order Prefill Selector */}
        {orders.length > 0 && (
          <div className="mb-4 p-3 rounded-2xl bg-[#f0faf4] border border-[#cbe9d8]">
            <label className="text-[11px] font-bold text-[#173324] block mb-1">
              ⚡ Quick Import from Adoption Order:
            </label>
            <Select
              value={selectedOrderRef}
              onChange={(e) => handleOrderSelect(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl border border-[#b2ddc4] bg-white text-[#173324] outline-none cursor-pointer"
            >
              <option value="">-- Select an Order to Autofill --</option>
              {orders.map((o) => (
                <option key={o.id} value={o.orderNumber}>
                  {o.orderNumber} • {o.adopterName} ({o.treeSpecies} - {o.reserveName})
                </option>
              ))}
            </Select>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          {/* Order Reference & Physical Tree Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Order Reference *
              </label>
              <input
                name="orderRef"
                type="text"
                required
                value={selectedOrderRef}
                onChange={(e) => setSelectedOrderRef(e.target.value)}
                placeholder="e.g. POA-ORD-9201"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Tree Sapling Tag
              </label>
              <input
                name="treeTag"
                type="text"
                value={treeTag}
                onChange={(e) => setTreeTag(e.target.value)}
                placeholder="e.g. POA-NE-4819"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] font-mono"
              />
            </div>
          </div>

          {/* Recipient Name & Adopter Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Recipient / Honoree Name *
              </label>
              <input
                name="recipientName"
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324]"
              />
            </div>

            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Adopter / Sponsor Name
              </label>
              <input
                name="adopterName"
                type="text"
                value={adopterName}
                onChange={(e) => setAdopterName(e.target.value)}
                placeholder="e.g. Eco Hero Foundation"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324]"
              />
            </div>
          </div>

          {/* Tree Species & Reserve Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Tree Species
              </label>
              <input
                name="treeSpecies"
                type="text"
                value={treeSpecies}
                onChange={(e) => setTreeSpecies(e.target.value)}
                placeholder="e.g. Neem (Azadirachta indica)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324]"
              />
            </div>

            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Reserve Location
              </label>
              <input
                name="reserveName"
                type="text"
                value={reserveName}
                onChange={(e) => setReserveName(e.target.value)}
                placeholder="e.g. Western Ghats, Maharashtra"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324]"
              />
            </div>
          </div>

          {/* Dedicated Message */}
          <div>
            <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
              Dedication & Occasion Citation *
            </label>
            <textarea
              name="dedicatedMessage"
              rows={3}
              required
              value={dedicatedMessage}
              onChange={(e) => setDedicatedMessage(e.target.value)}
              placeholder="e.g. Planted in honor of Dr. S. Rao on his 60th birthday. May your legacy branch out to shade future generations."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] resize-none"
            />
          </div>

          {/* Status Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Initial Deed Status
              </label>
              <Select
                name="status"
                defaultValue="Issued"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] cursor-pointer"
              >
                <option value="Issued">Issued (Cryptographically Active)</option>
                <option value="Pending Generation">Pending Generation</option>
              </Select>
            </div>

            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Certificate Serial (Optional)
              </label>
              <input
                name="certificateNumber"
                type="text"
                placeholder="Auto-generated if blank"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e2eae5]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-[#e2eae5] text-[#55695d] hover:bg-[#f4f7f5] font-semibold cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#173324] hover:bg-[#1f4230] text-white font-semibold flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Deed...</span>
                </>
              ) : (
                <span>Issue Certificate Deed</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
