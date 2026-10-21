"use client";

import { useState, useEffect } from "react";
import { PlantationLocationItem } from "../types";

interface EditLocationModalProps {
  isOpen: boolean;
  location: PlantationLocationItem | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function EditLocationModal({
  isOpen,
  location,
  onClose,
  onSubmit,
  isSubmitting = false,
}: EditLocationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    gps: "",
    areaHectares: 25,
    capacity: 10000,
    soilHealth: "Optimal Loam (pH 6.5, Moisture 35%)",
    ndviScore: 0.88,
    survivalRate: "99.0%",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
    status: "Active" as PlantationLocationItem["status"],
  });

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || "",
        region: location.region || "",
        gps: location.gps || "",
        areaHectares: location.areaHectares || 25,
        capacity: location.capacity || 10000,
        soilHealth: location.soilHealth || "Optimal Loam (pH 6.5, Moisture 35%)",
        ndviScore: location.ndviScore !== undefined ? location.ndviScore : 0.88,
        survivalRate: location.survivalRate || "99.0%",
        image:
          location.image ||
          "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
        status: location.status || "Active",
      });
    }
  }, [location]);

  if (!isOpen || !location) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const utilizationPct = Math.min(
    100,
    Math.round(((location.treesPlanted || 0) / (formData.capacity || 1)) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#e2eae5] relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          type="button"
          disabled={isSubmitting}
          className="absolute top-5 right-5 text-[#7a8a80] hover:text-[#173324] text-lg font-bold cursor-pointer transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🗺️</span>
          <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-[#173324]">
            Edit Bio-Reserve Location
          </h3>
        </div>
        <p className="text-xs text-[#55695d] mb-4">
          Modify geotagged sector telemetry, capacity limits, and soil health conditions for{" "}
          <strong className="text-[#173324]">{location.name}</strong>.
        </p>

        {/* Current status bar */}
        <div className="p-3.5 rounded-2xl bg-[#f4f8f5] border border-[#dce8e0] mb-4 flex items-center justify-between text-xs">
          <div>
            <span className="text-[#73877b] block text-[10px] uppercase font-bold tracking-wider">
              Live Plantings
            </span>
            <span className="font-bold text-[#173324] text-sm">
              {location.treesPlanted.toLocaleString()} saplings
            </span>
          </div>
          <div className="text-right">
            <span className="text-[#73877b] block text-[10px] uppercase font-bold tracking-wider">
              Reserve Utilization
            </span>
            <span className="font-bold text-emerald-700 text-sm">
              {utilizationPct}% capacity
            </span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <input type="hidden" name="id" value={location.id} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Reserve Name *
              </label>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Western Ghats Bio-Reserve"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Region / State *
              </label>
              <input
                name="region"
                type="text"
                required
                value={formData.region}
                onChange={handleChange}
                placeholder="e.g. Sahyadri Mountain Range, MH"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                GPS Coordinates *
              </label>
              <input
                name="gps"
                type="text"
                required
                value={formData.gps}
                onChange={handleChange}
                placeholder="e.g. 18.9894° N, 73.4428° E"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] font-mono text-[11px] focus:border-[#2d6a4f] transition-colors"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Area (Hectares) *
              </label>
              <input
                name="areaHectares"
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.areaHectares}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Sapling Capacity (Trees) *
              </label>
              <input
                name="capacity"
                type="number"
                min="1"
                required
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Operational Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors"
              >
                <option value="Active">Active (Accepting New Plantings)</option>
                <option value="Expanding">Expanding (Parcel Acquisition)</option>
                <option value="Full">Full (At Maximum Capacity)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
              Soil Profile & pH Health Metrics *
            </label>
            <input
              name="soilHealth"
              type="text"
              required
              value={formData.soilHealth}
              onChange={handleChange}
              placeholder="e.g. Humus Loam (pH 6.5, Moisture 40%)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                NDVI Vegetation Index (0.00 – 1.00)
              </label>
              <input
                name="ndviScore"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={formData.ndviScore}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Survival Rate
              </label>
              <input
                name="survivalRate"
                type="text"
                value={formData.survivalRate}
                onChange={handleChange}
                placeholder="e.g. 99.0%"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
              Cover Photo URL
            </label>
            <input
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#2d6a4f] transition-colors"
            />
          </div>

          {formData.image && (
            <div className="h-28 w-full rounded-2xl overflow-hidden border border-[#e2eae5] bg-[#eaf1ec] relative">
              <img
                src={formData.image}
                alt="Reserve preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs">
                Satellite Imagery Preview
              </span>
            </div>
          )}

          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-[#173324] text-white font-semibold hover:bg-[#1e4433] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Update Reserve Location</span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="py-3 px-5 rounded-xl border border-[#e2eae5] text-[#55695d] hover:bg-[#f4f7f5] font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
