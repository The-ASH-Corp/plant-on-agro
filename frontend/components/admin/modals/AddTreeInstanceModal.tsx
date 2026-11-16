"use client";

import { useState } from "react";
import { Select } from "@/components/ui";
import { TreeHealthStatus } from "../types";

interface AddTreeInstanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting?: boolean;
}

const HEALTH_OPTIONS: { value: TreeHealthStatus; label: string; icon: string; color: string }[] = [
  { value: "Sapling Growing", label: "Sapling Growing", icon: "🌱", color: "text-emerald-700" },
  { value: "Healthy", label: "Healthy", icon: "🌿", color: "text-green-700" },
  { value: "Thriving", label: "Thriving", icon: "🌳", color: "text-emerald-800" },
  { value: "Needs Attention", label: "Needs Attention", icon: "⚠️", color: "text-amber-700" },
  { value: "Critical", label: "Critical", icon: "🚨", color: "text-rose-700" },
];

export function AddTreeInstanceModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: AddTreeInstanceModalProps) {
  const [tagSuggestion] = useState(() => `POA-TR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e2eae5] relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#7a8a80] hover:text-[#173324] text-lg font-bold cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🏷️</span>
          <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#173324]">
            Tag & Plant Tree Instance
          </h3>
        </div>
        <p className="text-xs text-[#55695d] mb-4">
          Register a physical sapling put into the ground with unique Tree ID tag, reserve sanctuary, and initial health status.
        </p>

        <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
          {/* Tree Tag & Order Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Unique Tree Tag / Serial *
              </label>
              <input
                name="treeTag"
                type="text"
                required
                defaultValue={tagSuggestion}
                placeholder="e.g. POA-TR-2026-0042"
                className="w-full px-3.5 py-2.5 font-mono uppercase font-bold rounded-xl border border-[#e2eae5] outline-none text-[#1b7a43] bg-[#fcfaf7]"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Order Reference (optional)
              </label>
              <input
                name="orderRef"
                type="text"
                placeholder="e.g. ORD-88219"
                className="w-full px-3.5 py-2.5 font-mono uppercase rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
          </div>

          {/* Assigned Reserve & Tree Variety */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Assigned Reserve *
              </label>
              <input
                name="assignedReserve"
                type="text"
                required
                defaultValue="Western Ghats Conservation Corridor, Parcel A"
                placeholder="e.g. Sahyadri Bio-Reserve"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Botanical Variety
              </label>
              <input
                name="treeVarietyName"
                type="text"
                placeholder="e.g. Indian Mango / Teakwood"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
          </div>

          {/* Date Planted & Health Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Date Planted *
              </label>
              <input
                name="datePlanted"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Current Health Status *
              </label>
              <Select
                name="healthStatus"
                required
                defaultValue="Sapling Growing"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              >
                {HEALTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Adopter details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Adopter Name (optional)
              </label>
              <input
                name="adopterName"
                type="text"
                placeholder="e.g. Aarav Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Adopter Email (optional)
              </label>
              <input
                name="adopterEmail"
                type="email"
                placeholder="e.g. adopter@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
          </div>

          {/* Planting Notes */}
          <div>
            <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
              Field & Soil Notes
            </label>
            <textarea
              name="notes"
              rows={2}
              placeholder="e.g. Metal serial tag affixed to stake. Rich loam soil with organic vermicompost."
              className="w-full px-3.5 py-2 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-[#173324] text-white font-semibold hover:bg-[#1e4433] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Tagging Sapling...</span>
              ) : (
                <span>Tag & Plant Sapling</span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl border border-[#e2eae5] text-[#55695d] hover:bg-[#f4f7f5] font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
