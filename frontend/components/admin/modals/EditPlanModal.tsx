"use client";

import { useState, useEffect } from "react";
import { AdoptionPlanItem, OccasionDedicationType } from "../types";

interface EditPlanModalProps {
  isOpen: boolean;
  plan: AdoptionPlanItem | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void;
  isSubmitting?: boolean;
}

const OCCASIONS: { value: OccasionDedicationType; label: string; icon: string }[] = [
  { value: "birthday", label: "Birthday", icon: "🎂" },
  { value: "memorial", label: "Memorial", icon: "🕯️" },
  { value: "anniversary", label: "Anniversary", icon: "💍" },
  { value: "corporate", label: "Corporate CSR", icon: "🏢" },
  { value: "general", label: "General", icon: "🌱" },
];

export function EditPlanModal({
  isOpen,
  plan,
  onClose,
  onSubmit,
  isSubmitting = false,
}: EditPlanModalProps) {
  const [formData, setFormData] = useState({
    label: "",
    icon: "🌱",
    price: 0,
    badge: "Standard",
    desc: "",
    features: "",
    isActive: true,
  });

  const [selectedOccasions, setSelectedOccasions] = useState<OccasionDedicationType[]>([
    "general",
  ]);

  useEffect(() => {
    if (plan) {
      const priceMod =
        plan.priceModifier !== undefined
          ? plan.priceModifier
          : typeof plan.price === "number"
          ? plan.price
          : 0;

      setFormData({
        label: plan.label || plan.planLabel || "",
        icon: plan.icon || "🌱",
        price: priceMod,
        badge: plan.badge || "Standard",
        desc: plan.desc || plan.description || "",
        features: Array.isArray(plan.features) ? plan.features.join("\n") : "",
        isActive: plan.isActive !== undefined ? plan.isActive : true,
      });

      setSelectedOccasions(
        plan.occasionDedications && plan.occasionDedications.length > 0
          ? plan.occasionDedications
          : ["general"]
      );
    }
  }, [plan]);

  if (!isOpen || !plan) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleOccasion = (val: OccasionDedicationType) => {
    setSelectedOccasions((prev) => {
      if (prev.includes(val)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((item) => item !== val);
      }
      return [...prev, val];
    });
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e2eae5] relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 text-[#7a8a80] hover:text-[#173324] text-lg font-bold cursor-pointer transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Adoption Program Management
          </span>
        </div>

        <h3
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl text-[#173324] mb-1 font-bold"
        >
          Edit Adoption Plan
        </h3>
        <p className="text-xs text-[#55695d] mb-4">
          Update pricing modifiers, features, badges, and occasion dedication options.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          {/* Hidden inputs to pass ID and selected occasion dedications */}
          <input type="hidden" name="id" value={plan.id} />
          <input
            type="hidden"
            name="occasionDedications"
            value={JSON.stringify(selectedOccasions)}
          />
          {selectedOccasions.map((occ) => (
            <input key={`edit-hidden-${occ}`} type="hidden" name="occasions" value={occ} />
          ))}

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
                value={formData.label}
                onChange={handleChange}
                placeholder="e.g. Occasion Dedication Pack"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] transition-colors"
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
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-center text-base rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] transition-colors"
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
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 150 (Extra), 0, or -50 (Subsidy)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] transition-colors"
              />
              <span className="text-[10px] text-[#73877b] mt-0.5 block">
                0 = standard base price, &gt;0 = premium, &lt;0 = subsidy
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
                value={formData.badge}
                onChange={handleChange}
                placeholder="e.g. Popular, Premium, CSR Tier"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] transition-colors"
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
              value={formData.desc}
              onChange={handleChange}
              placeholder="e.g. Dedicate a grove for lifetime celebrations with physical wooden plaques and digital updates."
              className="w-full px-3.5 py-2 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] transition-colors"
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
              value={formData.features}
              onChange={handleChange}
              placeholder="Geo-tagged physical plaque&#10;Quarterly high-res field photo logs&#10;Framed digital certificate of adoption&#10;Direct farmer community support"
              className="w-full px-3.5 py-2 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] transition-colors"
            />
            <span className="text-[10px] text-[#73877b] mt-0.5 block">
              Enter each feature on a separate line or separated by commas.
            </span>
          </div>

          {/* Occasion Dedication Options Multi-Select */}
          <div className="p-3 bg-[#f8faf8] rounded-2xl border border-[#e2eae5] space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-[#173324] uppercase tracking-wider text-[11px] block">
                  Occasion Dedication Options *
                </label>
                <span className="text-[10px] text-[#73877b]">
                  {selectedOccasions.length} of {OCCASIONS.length} occasions selected
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setSelectedOccasions(OCCASIONS.map((o) => o.value))}
                  className="px-2 py-0.5 rounded-md border border-[#e2eae5] bg-white text-[#173324] hover:bg-[#f2f6f3] font-medium cursor-pointer transition-colors"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOccasions(["general"])}
                  className="px-2 py-0.5 rounded-md border border-[#e2eae5] bg-white text-[#55695d] hover:bg-[#f2f6f3] font-medium cursor-pointer transition-colors"
                >
                  General Only
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((occ) => {
                const isChecked = selectedOccasions.includes(occ.value);
                return (
                  <button
                    key={occ.value}
                    type="button"
                    onClick={() => toggleOccasion(occ.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                      isChecked
                        ? "bg-[#173324] text-white border-[#173324] shadow-xs ring-1 ring-[#173324]"
                        : "bg-white text-[#55695d] border-[#e2eae5] hover:border-[#173324] hover:text-[#173324]"
                    }`}
                  >
                    <span>{occ.icon}</span>
                    <span>{occ.label}</span>
                    {isChecked ? (
                      <span className="text-emerald-300 font-bold text-xs leading-none">✓</span>
                    ) : (
                      <span className="w-2 h-2 rounded-full border border-gray-300 inline-block" />
                    )}
                  </button>
                );
              })}
            </div>
            <span className="text-[10px] text-[#73877b] block leading-relaxed">
              Adopters can choose to dedicate their tree adoption towards any of the active checked occasion programs.
            </span>
          </div>

          {/* Active status checkbox */}
          <div className="pt-1 flex items-center gap-2">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#173324]">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-[#173324]"
              />
              <span>Program Active (Available to Adopters)</span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-[#173324] text-white font-semibold hover:bg-[#1e4433] transition-all cursor-pointer disabled:opacity-50 shadow-xs flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating Plan...</span>
                </>
              ) : (
                <span>Update Adoption Plan</span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="py-3 px-4 rounded-xl border border-[#e2eae5] text-[#55695d] hover:bg-[#f4f7f5] font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
