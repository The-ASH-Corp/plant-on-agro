"use client";

import { useState, useEffect } from "react";
import { TreeVarietyItem } from "../types";

interface EditTreeModalProps {
  isOpen: boolean;
  tree: TreeVarietyItem | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function EditTreeModal({
  isOpen,
  tree,
  onClose,
  onSubmit,
  isSubmitting = false,
}: EditTreeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    sci: "",
    category: "Fruit Trees" as TreeVarietyItem["category"],
    price: 349,
    co2: 25,
    location: "Western Ghats, Maharashtra",
    growth: "10–14 m in 5 years",
    img: "",
    careRequirements: "",
    desc: "",
    isActive: true,
  });

  useEffect(() => {
    if (tree) {
      setFormData({
        name: tree.name || tree.commonName || "",
        sci: tree.sci || tree.scientificName || "",
        category: tree.category || "Fruit Trees",
        price: tree.price || 349,
        co2: tree.co2PerYearKg || tree.co2AbsorptionRateKgYear || 25,
        location: tree.location || "Western Ghats, Maharashtra",
        growth: tree.growth || tree.growthTimeline || "10–14 m in 5 years",
        img: tree.img || tree.coverImages?.[0] || "",
        careRequirements:
          tree.careRequirements ||
          "Weekly watering in early stages, adequate sunlight, organic soil",
        desc: tree.desc || tree.description || "",
        isActive: tree.isActive !== undefined ? tree.isActive : true,
      });
    }
  }, [tree]);

  if (!isOpen || !tree) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
            Catalog Management
          </span>
        </div>

        <h3
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl text-[#173324] mb-1 font-bold"
        >
          Edit Tree Variety
        </h3>
        <p className="text-xs text-[#55695d] mb-4">
          Update botanical specifications, adoption pricing, and nursery stock data.
        </p>

        <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
          <input type="hidden" name="id" value={tree.id} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Common Name *
              </label>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Malabar Neem"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Scientific Name *
              </label>
              <input
                name="sci"
                type="text"
                required
                value={formData.sci}
                onChange={handleChange}
                placeholder="e.g. Melia dubia"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Category *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors cursor-pointer"
              >
                <option value="Fruit Trees">Fruit Trees</option>
                <option value="Native Trees">Native Trees</option>
                <option value="Timber Trees">Timber Trees</option>
                <option value="Medicinal">Medicinal</option>
                <option value="Shade Trees">Shade Trees</option>
                <option value="Occasion">Occasion</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Price (₹) *
              </label>
              <input
                name="price"
                type="number"
                required
                min={0}
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                CO2 (kg/yr) *
              </label>
              <input
                name="co2"
                type="number"
                required
                min={0}
                value={formData.co2}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Region / Location *
              </label>
              <input
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Western Ghats, Maharashtra"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Growth Metric *
              </label>
              <input
                name="growth"
                type="text"
                required
                value={formData.growth}
                onChange={handleChange}
                placeholder="e.g. 10–14 m in 5 years"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
              Cover Photo URL
            </label>
            <input
              name="img"
              type="url"
              value={formData.img}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors"
            />
            {formData.img && (
              <div className="mt-2 flex items-center gap-3 p-2 bg-[#f8faf8] rounded-xl border border-[#e5ebe7]">
                <img
                  src={formData.img}
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <span className="text-[11px] text-[#73877b]">Cover Photo Preview</span>
              </div>
            )}
          </div>

          <div>
            <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
              Care Requirements
            </label>
            <input
              name="careRequirements"
              type="text"
              required
              value={formData.careRequirements}
              onChange={handleChange}
              placeholder="e.g. Weekly irrigation, full sunlight, organic fertilizer"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors"
            />
          </div>

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
              placeholder="Thrives in diverse forest ecosystems and produces dense foliage..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors"
            />
          </div>

          <div className="pt-1 flex items-center gap-2">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#173324]">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-[#173324]"
              />
              <span>Catalog Active (Available for Adoption)</span>
            </label>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-[#173324] text-white font-semibold hover:bg-[#1e4433] transition-all cursor-pointer disabled:opacity-50 shadow-xs flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Update Tree Variety</span>
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
