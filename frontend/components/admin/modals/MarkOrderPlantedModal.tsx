"use client";

import { useState, useEffect } from "react";
import { AdoptionOrder, PlantationLocationItem, TreeInstanceItem } from "../types";

export interface TreePreset {
  name: string;
  scientific: string;
  category: string;
}

export const POPULAR_TREE_PRESETS: TreePreset[] = [
  { name: "Indian Sandalwood", scientific: "Santalum album", category: "Timber Trees" },
  { name: "Teak / Sagwan", scientific: "Tectona grandis", category: "Timber Trees" },
  { name: "Neem", scientific: "Azadirachta indica", category: "Medicinal Trees" },
  { name: "Banyan", scientific: "Ficus benghalensis", category: "Native Trees" },
  { name: "Sacred Fig / Peepal", scientific: "Ficus religiosa", category: "Native Trees" },
  { name: "Alphonso Mango", scientific: "Mangifera indica", category: "Fruit Trees" },
  { name: "Indian Rosewood / Sheesham", scientific: "Dalbergia latifolia", category: "Timber Trees" },
  { name: "Malabar Neem", scientific: "Melia dubia", category: "Timber Trees" },
  { name: "Wild Jack / Anjili", scientific: "Artocarpus hirsutus", category: "Native Trees" },
  { name: "Mahua", scientific: "Madhuca longifolia", category: "Native Trees" },
];

export const TREE_CATEGORIES = [
  "Native Trees",
  "Timber Trees",
  "Fruit Trees",
  "Medicinal Trees",
  "Sacred & Shade Trees",
  "Agroforestry Biomass",
];

interface MarkOrderPlantedModalProps {
  isOpen: boolean;
  order: AdoptionOrder | null;
  locations?: PlantationLocationItem[];
  instances?: TreeInstanceItem[];
  onClose: () => void;
  onSubmit: (
    orderNumber: string,
    gpsCoords: string,
    reserveName: string,
    notes: string,
    treeTags?: string[],
    assignedTreeInstanceIds?: string[],
    treeSpecies?: string,
    scientificName?: string,
    category?: string,
    treeGpsCoords?: string[]
  ) => Promise<void> | void;
}

export function MarkOrderPlantedModal({
  isOpen,
  order,
  locations = [],
  onClose,
  onSubmit,
}: MarkOrderPlantedModalProps) {
  // Tree Details to Plant
  const [treeSpecies, setTreeSpecies] = useState<string>("Indian Sandalwood");
  const [scientificName, setScientificName] = useState<string>("Santalum album");
  const [category, setCategory] = useState<string>("Timber Trees");

  const [treeTags, setTreeTags] = useState<string[]>([]);
  const [selectedReserve, setSelectedReserve] = useState<string>("");

  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize reserve, tree species, and tree tags from order
  useEffect(() => {
    if (order) {
      const isPending = !order.treeSpecies || order.treeSpecies === "Pending Admin Assignment";
      const initialSpecies = isPending ? "Indian Sandalwood" : order.treeSpecies;
      setTreeSpecies(initialSpecies);

      const matchedPreset = POPULAR_TREE_PRESETS.find(
        (p) => p.name.toLowerCase() === initialSpecies.toLowerCase()
      );
      setScientificName(order.scientificName && !isPending ? order.scientificName : (matchedPreset?.scientific || "Santalum album"));
      setCategory(order.category && !isPending ? order.category : (matchedPreset?.category || "Timber Trees"));

      const initialReserve = order.reserveName || "";
      setSelectedReserve(initialReserve);

      // Initialize clean tree tags matching order quantity
      const speciesCode = (initialSpecies || "TR").substring(0, 2).toUpperCase();
      const cleanOrderNumber = order.orderNumber.replace(/^POA-?/, "");
      const count = Math.max(1, order.quantity || 1);
      const initialTags = Array.from({ length: count }, (_, i) =>
        `POA-${speciesCode}-${cleanOrderNumber}-${String(i + 1).padStart(3, "0")}`
      );
      setTreeTags(initialTags);

      setNotes(
        order.notes ||
          `Planted at assigned reserve sanctuary for ${order.adopterName}.`
      );
      setErrorMsg(null);
    }
  }, [order, locations]);

  if (!isOpen || !order) return null;

  // Handle preset selection
  const handleSelectPreset = (preset: TreePreset) => {
    setTreeSpecies(preset.name);
    setScientificName(preset.scientific);
    setCategory(preset.category);

    // Update tags with new species code
    const speciesCode = preset.name.substring(0, 2).toUpperCase();
    const cleanOrderNumber = order.orderNumber.replace(/^POA-?/, "");
    const count = Math.max(1, order.quantity || 1);
    const updatedTags = Array.from({ length: count }, (_, i) =>
      `POA-${speciesCode}-${cleanOrderNumber}-${String(i + 1).padStart(3, "0")}`
    );
    setTreeTags(updatedTags);
  };

  const handleTagChange = (index: number, val: string) => {
    setTreeTags((prev) => {
      const next = [...prev];
      next[index] = val.trim().toUpperCase();
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!treeSpecies.trim()) {
      setErrorMsg("Tree species name is required.");
      return;
    }

    const hasEmptyTag = treeTags.some((t) => !t || t.trim().length === 0);
    if (hasEmptyTag) {
      setErrorMsg("Please provide valid Tree IDs for all trees in this order.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      await onSubmit(
        order.orderNumber,
        "", // no GPS coordinates
        selectedReserve.trim(),
        notes.trim(),
        treeTags,
        undefined, // no nursery IDs
        treeSpecies.trim(),
        scientificName.trim(),
        category.trim(),
        undefined
      );
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to mark order as planted. Please check inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const treeCount = Math.max(1, order.quantity || 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="no-scrollbar bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-[#d4e9dd] relative text-[#173324]">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 text-[#7a8a80] hover:text-[#173324] text-lg font-bold cursor-pointer disabled:opacity-40"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-2xl">🌱</span>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Assign Tree Species & Mark Planted</h2>
            <p className="text-xs text-[#52796f]">
              Assign botanical species, Unique Tree IDs, and issue certificate to this buyer
            </p>
          </div>
        </div>

        {/* Order Summary Banner */}
        <div className="p-3.5 rounded-2xl bg-[#f4f8f5] border border-[#d2e4d8] text-xs space-y-1.5 my-3">
          <div className="flex justify-between items-center">
            <span className="text-[#687f72] font-medium">Order Number:</span>
            <span className="font-mono font-bold text-[#1b7a43]">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#687f72] font-medium">Buyer / Adopter:</span>
            <span className="font-bold text-[#173324]">
              {order.adopterName} ({order.adopterEmail})
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#687f72] font-medium">Adoption Plan & Qty:</span>
            <span className="font-bold text-[#173324]">
              {treeCount} Tree(s) • {order.planType}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium mb-3">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* SECTION 1: Tree Details to Plant (Appears on Certificate) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#f8fbf9] to-[#edf7f1] border border-[#b8dfc7] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#173324] flex items-center gap-1.5">
                <span>🌳</span>
                <span>Tree Species to Plant (Stamped on Deed)</span>
                <span className="text-emerald-600">*</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                Official Deed
              </span>
            </div>

            {/* Quick Presets Chips */}
            <div>
              <span className="text-[10px] font-semibold text-[#55695d] block mb-1.5">
                Quick Native Tree Presets (or type below):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_TREE_PRESETS.map((preset) => {
                  const isSelected = treeSpecies.toLowerCase() === preset.name.toLowerCase();
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#173324] text-white font-bold shadow-xs border border-[#173324]"
                          : "bg-white text-[#334d3d] hover:bg-emerald-50 border border-[#c4e3d0]"
                      }`}
                    >
                      {preset.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tree Name / Species Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-[#173324] mb-1">
                  Tree Species / Variety Name <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={treeSpecies}
                  onChange={(e) => setTreeSpecies(e.target.value)}
                  placeholder="e.g. Indian Sandalwood, Teak, Neem"
                  className="w-full px-3 py-2 rounded-xl border border-[#b2ddc4] bg-white text-[#173324] font-bold text-xs focus:outline-none focus:border-[#1b7a43]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#173324] mb-1">
                  Botanical / Scientific Name
                </label>
                <input
                  type="text"
                  value={scientificName}
                  onChange={(e) => setScientificName(e.target.value)}
                  placeholder="e.g. Santalum album, Tectona grandis"
                  className="w-full px-3 py-2 rounded-xl border border-[#b2ddc4] bg-white text-[#173324] italic text-xs focus:outline-none focus:border-[#1b7a43]"
                />
              </div>
            </div>

            {/* Tree Category */}
            <div>
              <label className="block text-[11px] font-bold text-[#173324] mb-1">
                Tree Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#b2ddc4] bg-white text-[#173324] font-medium text-xs focus:outline-none focus:border-[#1b7a43]"
              >
                {TREE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Planting Location (chosen by the buyer — read-only for admin) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173324] mb-1.5">
              Planting Location (Selected by Buyer)
            </label>
            <div className="w-full px-3.5 py-2.5 rounded-xl border border-[#d2e4d8] bg-[#f4f8f5] text-[#173324] font-semibold flex items-center gap-2">
              <span>📍</span>
              <span className="truncate">{selectedReserve || "—"}</span>
              <span className="ml-auto text-[10px] font-bold text-[#687f72] uppercase tracking-wider shrink-0">🔒 Locked</span>
            </div>
          </div>

          {/* SECTION 2: Tree Identification & Unique Tree IDs */}
          <div className="p-3.5 rounded-2xl bg-[#fafdfa] border border-[#d2e4d8] space-y-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#173324] block">
                Tree Identification & Unique Tree IDs ({treeCount} {treeCount > 1 ? "Trees" : "Tree"}) <span className="text-emerald-600">*</span>
              </label>
              <p className="text-[10px] text-[#55695d]">
                Enter the unique Tree ID code for each sapling (stamped onto the digital deed):
              </p>
            </div>

            {/* Tree Rows List */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {treeTags.map((tag, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border bg-[#fbfdfa] border-[#e2eae5] flex items-center gap-2"
                >
                  {/* Tag Input */}
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-[11px] font-mono font-bold text-[#1b7a43] shrink-0 w-16">
                      Tree #{idx + 1}:
                    </span>
                    <input
                      type="text"
                      required
                      value={tag}
                      onChange={(e) => handleTagChange(idx, e.target.value)}
                      placeholder="e.g. POA-SW-2026-001"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#b2ddc4] bg-white font-mono font-bold text-[#173324] uppercase outline-none focus:border-[#1b7a43]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arborist Planting Notes */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173324] mb-1.5">
              Field Arborist Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Sapling bedded with mycorrhizal inoculant and drip irrigation..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#b2ddc4] bg-white text-[#173324] focus:outline-none focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43]"
            />
          </div>

          {/* Certificate Live Preview Pill */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-[#1e5233] leading-relaxed flex items-start gap-2">
            <span className="text-base mt-0.5">📜</span>
            <div>
              <strong>Certificate Deed Stamping:</strong> Upon confirming, the official certificate will be generated and issued displaying:
              <div className="mt-1 font-semibold text-emerald-900 bg-white/70 p-2 rounded-lg border border-emerald-200 text-[11px]">
                🌿 Specimen: <strong>{treeSpecies}</strong> ({scientificName}) • Tag: <strong>{treeTags[0] || "POA-TR-001"}{treeCount > 1 ? ` (and ${treeCount - 1} more)` : ""}</strong> • Reserve: <strong>{selectedReserve}</strong>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e2eae5]">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-semibold text-[#55695d] hover:bg-[#edf4f0] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#173324] to-[#1b7a43] hover:brightness-105 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>{isSubmitting ? "Assigning & Minting..." : "Confirm & Assign Tree to User 🌿"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
