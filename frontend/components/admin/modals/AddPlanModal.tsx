"use client";

import { useState } from "react";
import { OccasionDedicationType } from "../types";

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting?: boolean;
}

const OCCASIONS: { value: OccasionDedicationType; label: string; icon: string }[] = [
  { value: "birthday", label: "Birthday", icon: "🎂" },
  { value: "memorial", label: "Memorial", icon: "🕯️" },
  { value: "anniversary", label: "Anniversary", icon: "💍" },
  { value: "corporate", label: "Corporate CSR", icon: "🏢" },
  { value: "general", label: "General", icon: "🌱" },
];

export function AddPlanModal({ isOpen, onClose, onSubmit, isSubmitting = false }: AddPlanModalProps) {
  const [selectedOccasions, setSelectedOccasions] = useState<OccasionDedicationType[]>([
    "birthday",
    "memorial",
    "anniversary",
    "general",
  ]);

  if (!isOpen) return null;

  const toggleOccasion = (val: OccasionDedicationType) => {
    setSelectedOccasions((prev) =>
      prev.includes(val)
        ? prev.length > 1
          ? prev.filter((item) => item !== val)
          : prev // keep at least 1
        : [...prev, val]
    );
  };

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
        <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#173324] mb-1">
          Add Adoption Plan
        </h3>
        <p className="text-xs text-[#55695d] mb-4">
          Configure a tier with pricing modifiers, feature lists, and occasion dedication options.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          {/* Hidden input to pass selected occasion dedications */}
          <input
            type="hidden"
            name="occasionDedications"
            value={JSON.stringify(selectedOccasions)}
          />

          {/* Plan Label and Icon */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Plan Label *
              </label>
              <input
                name="label"
                type="text"
                required
                placeholder="e.g. Occasion Dedication Pack"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Icon Emoji *
              </label>
              <input
                name="icon"
                type="text"
                required
                defaultValue="🎉"
                className="w-full px-3 py-2.5 text-center text-base rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
          </div>

          {/* Pricing Modifier and Badge */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Price Modifier / Subsidy (₹)
              </label>
              <input
                name="price"
                type="number"
                required
                defaultValue={150}
                placeholder="e.g. 150 (Extra), 0, or -50 (Subsidy)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
              <span className="text-[10px] text-[#73877b] mt-0.5 block">
                0 = base price, &gt;0 = premium, &lt;0 = subsidy
              </span>
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Badge Title
              </label>
              <input
                name="badge"
                type="text"
                required
                defaultValue="Popular"
                placeholder="e.g. Popular, Premium, CSR Tier"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
              Description *
            </label>
            <textarea
              name="desc"
              rows={2}
              required
              placeholder="e.g. Dedicate a grove for lifetime celebrations with physical wooden plaques and digital updates."
              className="w-full px-3.5 py-2 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
            />
          </div>

          {/* Features List */}
          <div>
            <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
              Features List (one per line)
            </label>
            <textarea
              name="features"
              rows={3}
              placeholder="Geo-tagged physical plaque&#10;Quarterly high-res field photo logs&#10;Framed digital certificate of adoption&#10;Direct farmer community support"
              defaultValue={`Geo-tagged physical plaque\nQuarterly arborist health monitoring\nFramed dedication certificate\nAnnual impact report`}
              className="w-full px-3.5 py-2 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
            />
            <span className="text-[10px] text-[#73877b] mt-0.5 block">
              Enter each feature on a separate line or separated by commas.
            </span>
          </div>

          {/* Occasion Dedication Options */}
          <div>
            <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1.5">
              Occasion Dedication Options *
            </label>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((occ) => {
                const isChecked = selectedOccasions.includes(occ.value);
                return (
                  <button
                    key={occ.value}
                    type="button"
                    onClick={() => toggleOccasion(occ.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      isChecked
                        ? "bg-[#173324] text-white border-[#173324] shadow-xs"
                        : "bg-white text-[#55695d] border-[#e2eae5] hover:border-[#173324]"
                    }`}
                  >
                    <span>{occ.icon}</span>
                    <span>{occ.label}</span>
                  </button>
                );
              })}
            </div>
            <span className="text-[10px] text-[#73877b] mt-1 block">
              Select which occasions adopters can dedicate this plan towards (e.g. birthday, memorial, anniversary, corporate).
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-[#173324] text-white font-semibold hover:bg-[#1e4433] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Saving Plan...</span>
              ) : (
                <span>Save Adoption Plan</span>
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
