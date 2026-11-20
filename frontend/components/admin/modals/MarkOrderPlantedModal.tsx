"use client";

import { useState, useEffect, useMemo } from "react";
import {
  AdoptionOrder,
  PlantationLocationItem,
  TreeInstanceItem,
  TreeVarietyItem,
} from "../types";
import { treeVarietyService } from "@/services/tree-varieties/tree-variety.service";

export const TREE_CATEGORIES = [
  "Timber Trees",
  "Native Trees",
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
  treeVarieties?: TreeVarietyItem[];
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
    treeGpsCoords?: string[],
  ) => Promise<void> | void;
  onCompleteOrder?: (orderNumber: string) => Promise<void> | void;
  onViewOrderDetails?: (order: AdoptionOrder) => void;
}

export function MarkOrderPlantedModal({
  isOpen,
  order,
  locations = [],
  instances = [],
  treeVarieties = [],
  onClose,
  onSubmit,
  onCompleteOrder,
  onViewOrderDetails,
}: MarkOrderPlantedModalProps) {
  // Tree Details to Plant
  const [treeSpecies, setTreeSpecies] = useState<string>("");
  const [scientificName, setScientificName] = useState<string>("");
  const [category, setCategory] = useState<string>("Timber Trees");
  const [selectedCategory, setSelectedCategory] = useState<string>("Timber Trees");

  const [treeTags, setTreeTags] = useState<string[]>([]);
  const [selectedReserve, setSelectedReserve] = useState<string>("");

  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Success & Next-Step Workflow States
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isCompleting, setIsCompleting] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [availableVarieties, setAvailableVarieties] = useState<TreeVarietyItem[]>(treeVarieties);

  // Self-healing: load live tree varieties from backend catalog
  useEffect(() => {
    let isMounted = true;
    async function loadVarieties() {
      try {
        const res = await treeVarietyService.getAll();
        if (isMounted && res.data?.items && res.data.items.length > 0) {
          setAvailableVarieties(res.data.items.map(treeVarietyService.mapToUiItem));
        }
      } catch (err) {
        console.warn("Could not load tree varieties:", err);
      }
    }
    loadVarieties();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (treeVarieties && treeVarieties.length > 0) {
      setAvailableVarieties(treeVarieties);
    }
  }, [treeVarieties]);

  // Unique categories derived strictly from available added tree varieties
  const availableCategories = useMemo(() => {
    const presentCats = Array.from(
      new Set(availableVarieties.map((v) => v.category).filter(Boolean))
    );
    return presentCats.length > 0 ? presentCats : TREE_CATEGORIES;
  }, [availableVarieties]);

  // Trees strictly filtered by the selected category
  const filteredTrees = useMemo(() => {
    if (!selectedCategory) return availableVarieties;
    return availableVarieties.filter(
      (v) => (v.category || "").toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [availableVarieties, selectedCategory]);

  // Handle catalog variety selection
  const handleSelectVariety = (variety: TreeVarietyItem) => {
    setTreeSpecies(variety.name);
    setScientificName(variety.scientificName || variety.sci || "");
    const treeCat = variety.category || selectedCategory || "Timber Trees";
    setCategory(treeCat);
    setSelectedCategory(treeCat);

    const speciesCode = (variety.name || "TR").substring(0, 2).toUpperCase();
    const cleanOrderNumber = order?.orderNumber.replace(/^POA-?/, "") || "ORD";
    const count = Math.max(1, order?.quantity || 1);
    const updatedTags = Array.from(
      { length: count },
      (_, i) =>
        `POA-${speciesCode}-${cleanOrderNumber}-${String(i + 1).padStart(3, "0")}`,
    );
    setTreeTags(updatedTags);
  };

  // Handle category change -> auto-select first tree in that category if available
  const handleCategoryChange = (newCat: string) => {
    setSelectedCategory(newCat);
    setCategory(newCat);
    const inNewCategory = availableVarieties.filter(
      (v) => (v.category || "").toLowerCase() === newCat.toLowerCase()
    );
    if (inNewCategory.length > 0) {
      handleSelectVariety(inNewCategory[0]);
    } else {
      setTreeSpecies("");
      setScientificName("");
      setTreeTags([]);
    }
  };

  // Initialize reserve, tree species, and tree tags from order & catalog
  useEffect(() => {
    if (order) {
      const isPending =
        !order.treeSpecies || order.treeSpecies === "Pending Admin Assignment";

      // Match against available catalog varieties
      const matchedVariety = availableVarieties.find(
        (v) => v.name.toLowerCase() === (order.treeSpecies || "").toLowerCase(),
      );

      const targetVariety =
        matchedVariety ||
        (availableVarieties.length > 0 ? availableVarieties[0] : null);

      if (targetVariety) {
        const cat = targetVariety.category || "Timber Trees";
        setSelectedCategory(cat);
        setCategory(cat);
        setTreeSpecies(targetVariety.name);
        setScientificName(targetVariety.scientificName || targetVariety.sci || "");

        const speciesCode = (targetVariety.name || "TR")
          .substring(0, 2)
          .toUpperCase();
        const cleanOrderNumber = order.orderNumber.replace(/^POA-?/, "");
        const count = Math.max(1, order.quantity || 1);
        const initialTags = Array.from(
          { length: count },
          (_, i) =>
            `POA-${speciesCode}-${cleanOrderNumber}-${String(i + 1).padStart(3, "0")}`,
        );
        setTreeTags(initialTags);
      } else {
        const initialSpecies = isPending ? "" : order.treeSpecies;
        const initialCat = order.category || "Timber Trees";
        setSelectedCategory(initialCat);
        setCategory(initialCat);
        setTreeSpecies(initialSpecies);
        setScientificName(order.scientificName || "");

        const speciesCode = (initialSpecies || "TR")
          .substring(0, 2)
          .toUpperCase();
        const cleanOrderNumber = order.orderNumber.replace(/^POA-?/, "");
        const count = Math.max(1, order.quantity || 1);
        const initialTags = Array.from(
          { length: count },
          (_, i) =>
            `POA-${speciesCode}-${cleanOrderNumber}-${String(i + 1).padStart(3, "0")}`,
        );
        setTreeTags(initialTags);
      }

      const initialReserve = order.reserveName || "";
      setSelectedReserve(initialReserve);

      setNotes(
        order.notes ||
          `Planted at assigned reserve sanctuary for ${order.adopterName}.`,
      );
      setErrorMsg(null);
      setIsSuccess(false);
      setIsCompleted(false);
      setIsCompleting(false);
    }
  }, [order, locations, availableVarieties, isOpen]);

  if (!isOpen || !order) return null;

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
        undefined,
      );
      // Advance directly to success and move-forward stage; do NOT auto-close
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(
        err?.message || "Failed to mark order as planted. Please check inputs.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteNow = async () => {
    if (!order) return;
    try {
      setIsCompleting(true);
      setErrorMsg(null);
      if (onCompleteOrder) {
        await onCompleteOrder(order.orderNumber);
      }
      setIsCompleted(true);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to finalize order.");
    } finally {
      setIsCompleting(false);
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
            <h2 className="text-lg font-bold tracking-tight">
              Assign Tree Species & Mark Planted
            </h2>
            <p className="text-xs text-[#52796f]">
              Assign botanical species, Unique Tree IDs, and issue certificate
              to this buyer
            </p>
          </div>
        </div>

        {/* Order Summary Banner */}
        <div className="p-3.5 rounded-2xl bg-[#f4f8f5] border border-[#d2e4d8] text-xs space-y-1.5 my-3">
          <div className="flex justify-between items-center">
            <span className="text-[#687f72] font-medium">Order Number:</span>
            <span className="font-mono font-bold text-[#1b7a43]">
              {order.orderNumber}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#687f72] font-medium">Buyer / Adopter:</span>
            <span className="font-bold text-[#173324]">
              {order.adopterName} ({order.adopterEmail})
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#687f72] font-medium">
              Adoption Plan & Qty:
            </span>
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

        {isSuccess ? (
          <div className="space-y-4 py-1 text-xs">
            {/* Success Celebration Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#f0faf4] to-[#e4f6eb] border border-[#a2deb8] text-center space-y-2 shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-2xl shadow-xs">
                🌱
              </div>
              <h3 className="text-base font-bold text-[#173324]">
                Tree Assigned & Planted Successfully!
              </h3>
              <p className="text-[11px] text-[#2d6a4f] max-w-md mx-auto leading-relaxed">
                Order <strong className="font-mono font-bold text-[#1b7a43]">{order.orderNumber}</strong> has officially transitioned to <strong>Planted in Ground</strong>. The unique tree identifier and digital deed are cataloged.
              </p>
            </div>

            {/* Tree Assignment Stamped Details */}
            <div className="p-4 rounded-2xl bg-[#f8fbf9] border border-[#cbe6d5] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#687f72] font-medium">Assigned Variety:</span>
                <span className="font-bold text-[#173324]">
                  {treeSpecies} {scientificName ? <span className="italic font-normal text-[#55695d]">({scientificName})</span> : ""}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#687f72] font-medium">Category:</span>
                <span className="font-semibold text-[#173324]">{category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#687f72] font-medium">Unique Tree ID(s):</span>
                <span className="font-mono font-bold text-[#1b7a43] bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  {treeTags.join(", ")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#687f72] font-medium">Reserve Location:</span>
                <span className="font-semibold text-[#173324]">{selectedReserve}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#d8ebe0]">
                <span className="text-[#687f72] font-medium">Current Workflow Status:</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isCompleted
                    ? "bg-teal-100 text-teal-900 border-teal-300"
                    : "bg-lime-100 text-lime-900 border-lime-300"
                }`}>
                  {isCompleted ? "✓ Stage 4: Completed" : "✓ Stage 3: Planted in Ground"}
                </span>
              </div>
            </div>

            {/* Move Forward Action Panel */}
            <div className="p-3.5 rounded-2xl bg-[#edf7f1] border border-[#b2ddc4] space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#173324] block">
                Next Step: Move Forward
              </span>

              {isCompleted ? (
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 font-bold text-center text-xs flex items-center justify-center gap-2">
                  <span>✓</span>
                  <span>Order finalized and registered in permanent living ledger!</span>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isCompleting}
                  onClick={handleCompleteNow}
                  className="w-full py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-teal-700 to-teal-800 hover:brightness-105 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>🎯</span>
                  <span>{isCompleting ? "Finalizing Order..." : "Advance to Step 4: Finalize & Complete Order →"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (onViewOrderDetails) {
                    onViewOrderDetails({
                      ...order,
                      status: isCompleted ? "Completed" : "Planted",
                      treeSpecies,
                      scientificName,
                      category,
                      treeTag: treeTags[0] || "",
                      assignedTreeTags: treeTags,
                    });
                  } else {
                    onClose();
                  }
                }}
                className="w-full py-2.5 px-4 text-xs font-bold text-[#173324] bg-white border border-[#b2ddc4] hover:bg-[#e4f4ea] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
              >
                <span>📜</span>
                <span>View Full Order Details & Certificate Deed →</span>
              </button>
            </div>

            {/* Close / Return Button */}
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-semibold text-xs text-[#55695d] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Done (Back to Orders)
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* SECTION 1: Select Tree from Added Varieties (First Category -> Then Tree) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#f8fbf9] to-[#edf7f1] border border-[#b8dfc7] space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#173324] flex items-center gap-1.5">
                <span>🌳</span>
                <span>Select Tree from Added List</span>
                <span className="text-emerald-600">*</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                Official Deed
              </span>
            </div>

            {availableVarieties.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                ⚠️ No trees found in Tree Varieties catalog. Please add trees in the <strong>Tree Varieties</strong> section first.
              </div>
            ) : (
              <>
                {/* 1. First Select Category */}
                <div>
                  <label className="block text-[11px] font-bold text-[#173324] mb-1.5 uppercase tracking-wide">
                    1. Select Category <span className="text-emerald-600">*</span>
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#b2ddc4] bg-white text-[#173324] font-bold text-xs focus:outline-none focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43]"
                  >
                    {availableCategories.map((cat) => {
                      const count = availableVarieties.filter(
                        (v) => (v.category || "").toLowerCase() === cat.toLowerCase()
                      ).length;
                      return (
                        <option key={cat} value={cat}>
                          {cat} ({count} {count === 1 ? "Tree Available" : "Trees Available"})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* 2. Then Select Tree from that Category */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-[#173324] uppercase tracking-wide">
                      2. Select Tree Species <span className="text-emerald-600">*</span>
                    </label>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {filteredTrees.length} in {selectedCategory}
                    </span>
                  </div>

                  {filteredTrees.length === 0 ? (
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 italic">
                      No trees added under &quot;{selectedCategory}&quot;. Please select another category.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <select
                        value={
                          filteredTrees.find(
                            (v) => v.name.toLowerCase() === treeSpecies.toLowerCase()
                          )?.id ||
                          filteredTrees.find(
                            (v) => v.name.toLowerCase() === treeSpecies.toLowerCase()
                          )?.name ||
                          ""
                        }
                        onChange={(e) => {
                          const chosen = filteredTrees.find(
                            (v) => (v.id || v.name) === e.target.value
                          );
                          if (chosen) handleSelectVariety(chosen);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#b2ddc4] bg-white text-[#173324] font-bold text-xs focus:outline-none focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43]"
                      >
                        <option value="">-- Choose Tree Variety --</option>
                        {filteredTrees.map((v) => (
                          <option key={v.id || v.name} value={v.id || v.name}>
                            {v.name} {v.sci || v.scientificName ? `(${v.sci || v.scientificName})` : ""}
                          </option>
                        ))}
                      </select>

                      {/* Quick click pills for 1-click select */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {filteredTrees.map((variety) => {
                          const isSelected =
                            treeSpecies.toLowerCase() === variety.name.toLowerCase();
                          return (
                            <button
                              key={variety.id || variety.name}
                              type="button"
                              onClick={() => handleSelectVariety(variety)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                  ? "bg-[#173324] text-white font-bold shadow-xs border border-[#173324]"
                                  : "bg-white text-[#173324] hover:bg-emerald-50 border border-[#b2ddc4]"
                              }`}
                            >
                              <span>🌱</span>
                              <span>{variety.name}</span>
                              {(variety.sci || variety.scientificName) && (
                                <span
                                  className={`text-[10px] italic ${
                                    isSelected ? "text-emerald-200" : "text-[#55695d]"
                                  }`}
                                >
                                  ({variety.sci || variety.scientificName})
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stamped Botanical Confirmation Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#cce6d6]">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#55695d] mb-1">
                      Tree Species Name <span className="text-emerald-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={treeSpecies}
                      onChange={(e) => setTreeSpecies(e.target.value)}
                      placeholder="Tree variety name"
                      className="w-full px-3 py-2 rounded-xl border border-[#b2ddc4] bg-white text-[#173324] font-bold text-xs focus:outline-none focus:border-[#1b7a43]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#55695d] mb-1">
                      Botanical / Scientific Name
                    </label>
                    <input
                      type="text"
                      value={scientificName}
                      onChange={(e) => setScientificName(e.target.value)}
                      placeholder="Botanical name"
                      className="w-full px-3 py-2 rounded-xl border border-[#b2ddc4] bg-white text-[#173324] italic text-xs focus:outline-none focus:border-[#1b7a43]"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Planting Location (chosen by the buyer — read-only for admin) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173324] mb-1.5">
              Planting Location (Selected by Buyer)
            </label>
            <div className="w-full px-3.5 py-2.5 rounded-xl border border-[#d2e4d8] bg-[#f4f8f5] text-[#173324] font-semibold flex items-center gap-2">
              <span>📍</span>
              <span className="truncate">{selectedReserve || "—"}</span>
              <span className="ml-auto text-[10px] font-bold text-[#687f72] uppercase tracking-wider shrink-0">
                🔒 Locked
              </span>
            </div>
          </div>

          {/* SECTION 2: Tree Identification & Unique Tree IDs */}
          <div className="p-3.5 rounded-2xl bg-[#fafdfa] border border-[#d2e4d8] space-y-2.5">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#173324] block">
                Unique Tree ID {treeCount > 1 ? `(${treeCount} Trees)` : ""}{" "}
                <span className="text-emerald-600">*</span>
              </label>
              <p className="text-[10px] text-[#55695d]">
                Auto-generated identifier stamped on buyer deed certificate:
              </p>
            </div>

            {treeCount === 1 ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={treeTags[0] || ""}
                  onChange={(e) => handleTagChange(0, e.target.value)}
                  placeholder="e.g. POA-SW-2026-001"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#b2ddc4] bg-white font-mono font-bold text-xs text-[#173324] uppercase outline-none focus:border-[#1b7a43]"
                />
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {treeTags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl border bg-[#fbfdfa] border-[#e2eae5] flex items-center gap-2"
                  >
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
                ))}
              </div>
            )}
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
              <strong>Certificate Deed Stamping:</strong> Upon confirming, the
              official certificate will be generated and issued displaying:
              <div className="mt-1 font-semibold text-emerald-900 bg-white/70 p-2 rounded-lg border border-emerald-200 text-[11px]">
                🌿 Specimen: <strong>{treeSpecies}</strong> ({scientificName}) •
                Tag:{" "}
                <strong>
                  {treeTags[0] || "POA-TR-001"}
                  {treeCount > 1 ? ` (and ${treeCount - 1} more)` : ""}
                </strong>{" "}
                • Reserve: <strong>{selectedReserve}</strong>
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
              <span>
                {isSubmitting
                  ? "Assigning & Minting..."
                  : "Confirm Tree Assignment & Mark Planted 🌿"}
              </span>
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
