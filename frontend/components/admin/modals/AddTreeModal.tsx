"use client";

import { TreeVarietyItem } from "../types";

import { Select } from "@/components/ui";
interface AddTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function AddTreeModal({ isOpen, onClose, onSubmit }: AddTreeModalProps) {
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
        <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#173324] mb-1">
          Add New Tree Variety
        </h3>
        <p className="text-xs text-[#55695d] mb-4">Add a new botanical tree species to the adoption catalog.</p>

        <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Common Name</label>
              <input
                name="name"
                type="text"
                required
                placeholder="e.g. Malabar Neem"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Scientific Name</label>
              <input
                name="sci"
                type="text"
                required
                placeholder="e.g. Melia dubia"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Category</label>
              <Select
                name="category"
                required
                className="w-full px-3 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              >
                <option value="Fruit Trees">Fruit Trees</option>
                <option value="Native Trees">Native Trees</option>
                <option value="Timber Trees">Timber Trees</option>
                <option value="Medicinal">Medicinal</option>
                <option value="Shade Trees">Shade Trees</option>
                <option value="Occasion">Occasion</option>
              </Select>
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Price (₹)</label>
              <input
                name="price"
                type="number"
                required
                defaultValue={349}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">CO2 (kg/yr)</label>
              <input
                name="co2"
                type="number"
                required
                defaultValue={25}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Region</label>
              <input
                name="location"
                type="text"
                required
                placeholder="e.g. Western Ghats, Maharashtra"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Growth Metric</label>
              <input
                name="growth"
                type="text"
                required
                placeholder="e.g. 10–14 m in 5 years"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Cover Photo URL</label>
            <input
              name="img"
              type="url"
              defaultValue="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
            />
          </div>

          <div>
            <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Care Requirements</label>
            <input
              name="careRequirements"
              type="text"
              required
              defaultValue="Weekly watering in early stages, adequate sunlight, organic soil"
              placeholder="e.g. Weekly irrigation, full sunlight, organic fertilizer"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
            />
          </div>

          <div>
            <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Description</label>
            <textarea
              name="desc"
              rows={2}
              required
              placeholder="Thrives in diverse forest ecosystems and produces dense foliage..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#173324] text-white font-semibold hover:bg-[#1e4433] transition-all cursor-pointer"
            >
              Save Tree Variety
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
