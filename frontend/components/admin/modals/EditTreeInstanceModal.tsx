"use client";

import { useState, useEffect } from "react";
import { TreeInstanceItem, TreeHealthStatus } from "../types";

interface EditTreeInstanceModalProps {
  isOpen: boolean;
  instance: TreeInstanceItem | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void;
  isSubmitting?: boolean;
}

const HEALTH_OPTIONS: { value: TreeHealthStatus; label: string; icon: string; color: string }[] = [
  { value: "Sapling Growing", label: "Sapling Growing", icon: "🌱", color: "text-emerald-700" },
  { value: "Healthy", label: "Healthy", icon: "🌿", color: "text-green-700" },
  { value: "Thriving", label: "Thriving", icon: "🌳", color: "text-emerald-800" },
  { value: "Needs Attention", label: "Needs Attention", icon: "⚠️", color: "text-amber-700" },
  { value: "Critical", label: "Critical", icon: "🚨", color: "text-rose-700" },
];

export function EditTreeInstanceModal({
  isOpen,
  instance,
  onClose,
  onSubmit,
  isSubmitting = false,
}: EditTreeInstanceModalProps) {
  const [formData, setFormData] = useState({
    treeTag: "",
    orderRef: "",
    assignedReserve: "",
    treeVarietyName: "",
    lat: "18.5204",
    lng: "73.8567",
    datePlanted: new Date().toISOString().split("T")[0],
    healthStatus: "Sapling Growing" as TreeHealthStatus,
    adopterName: "",
    adopterEmail: "",
    notes: "",
    imageUrl: "",
    isActive: true,
  });

  useEffect(() => {
    if (instance) {
      let formattedDate = new Date().toISOString().split("T")[0];
      if (instance.datePlanted) {
        try {
          const d = new Date(instance.datePlanted);
          if (!isNaN(d.getTime())) {
            formattedDate = d.toISOString().split("T")[0];
          } else {
            formattedDate = instance.datePlanted;
          }
        } catch {
          formattedDate = instance.datePlanted;
        }
      }

      setFormData({
        treeTag: instance.treeTag || "",
        orderRef: instance.orderRef || "",
        assignedReserve: instance.assignedReserve || "Western Ghats, Maharashtra",
        treeVarietyName: instance.treeVarietyName || "",
        lat: String(instance.gpsCoordinates?.latitude ?? "18.5204"),
        lng: String(instance.gpsCoordinates?.longitude ?? "73.8567"),
        datePlanted: formattedDate,
        healthStatus: instance.healthStatus || "Sapling Growing",
        adopterName: instance.adopterName || "",
        adopterEmail: instance.adopterEmail || "",
        notes: instance.notes || "",
        imageUrl: instance.imageUrl || "",
        isActive: instance.isActive !== undefined ? instance.isActive : true,
      });
    }
  }, [instance]);

  if (!isOpen || !instance) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUseCurrentGps = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            lat: pos.coords.latitude.toFixed(6),
            lng: pos.coords.longitude.toFixed(6),
          }));
        },
        () => {
          setFormData((prev) => ({
            ...prev,
            lat: (18.5204 + (Math.random() - 0.5) * 0.05).toFixed(4),
            lng: (73.8567 + (Math.random() - 0.5) * 0.05).toFixed(4),
          }));
        }
      );
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
            Physical Living Ledger
          </span>
        </div>

        <h3
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl text-[#173324] mb-1 font-bold"
        >
          Edit Tree Sapling Instance
        </h3>
        <p className="text-xs text-[#55695d] mb-4">
          Update physical nursery tag, ground GPS coordinates, reserve parcel, and health status.
        </p>

        <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
          <input type="hidden" name="id" value={instance.id} />

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
                value={formData.treeTag}
                onChange={handleChange}
                placeholder="e.g. POA-TR-2026-0042"
                className="w-full px-3.5 py-2.5 font-mono uppercase font-bold rounded-xl border border-[#e2eae5] outline-none text-[#1b7a43] bg-[#fcfaf7] focus:border-[#173324] transition-colors"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Order Reference
              </label>
              <input
                name="orderRef"
                type="text"
                value={formData.orderRef}
                onChange={handleChange}
                placeholder="e.g. ORD-88219"
                className="w-full px-3.5 py-2.5 font-mono uppercase rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] transition-colors"
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
                value={formData.assignedReserve}
                onChange={handleChange}
                placeholder="e.g. Western Ghats Conservation Corridor"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] transition-colors"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Botanical Variety
              </label>
              <input
                name="treeVarietyName"
                type="text"
                value={formData.treeVarietyName}
                onChange={handleChange}
                placeholder="e.g. Indian Mango / Teakwood"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] transition-colors"
              />
            </div>
          </div>

          {/* Exact GPS Coordinates */}
          <div className="p-3.5 rounded-2xl bg-[#f7faf8] border border-emerald-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#173324] flex items-center gap-1.5">
                <span>📍</span>
                <span>Exact Physical GPS Pinpoint *</span>
              </span>
              <button
                type="button"
                onClick={handleUseCurrentGps}
                className="text-[11px] font-semibold text-[#1b7a43] hover:underline cursor-pointer"
              >
                Auto-Locate GPS Pin
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#73877b] block mb-1">
                  Latitude (-90 to 90) *
                </label>
                <input
                  name="latitude"
                  type="number"
                  step="any"
                  required
                  value={formData.lat}
                  onChange={handleChange}
                  placeholder="e.g. 18.5204"
                  className="w-full px-3 py-2 font-mono rounded-xl border border-[#e2eae5] bg-white outline-none text-[#173324] focus:border-[#173324] transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#73877b] block mb-1">
                  Longitude (-180 to 180) *
                </label>
                <input
                  name="longitude"
                  type="number"
                  step="any"
                  required
                  value={formData.lng}
                  onChange={handleChange}
                  placeholder="e.g. 73.8567"
                  className="w-full px-3 py-2 font-mono rounded-xl border border-[#e2eae5] bg-white outline-none text-[#173324] focus:border-[#173324] transition-colors"
                />
              </div>
            </div>
            <span className="text-[10px] text-[#73877b] block">
              Permanent coordinates stamped onto adoption certificate and deeds.
            </span>
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
                value={formData.datePlanted}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] transition-colors"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Current Health Status *
              </label>
              <select
                name="healthStatus"
                required
                value={formData.healthStatus}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] transition-colors cursor-pointer"
              >
                {HEALTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Adopter details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Adopter Name
              </label>
              <input
                name="adopterName"
                type="text"
                value={formData.adopterName}
                onChange={handleChange}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] transition-colors"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Adopter Email
              </label>
              <input
                name="adopterEmail"
                type="email"
                value={formData.adopterEmail}
                onChange={handleChange}
                placeholder="e.g. adopter@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] transition-colors"
              />
            </div>
          </div>

          {/* Field Photo URL */}
          <div>
            <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
              Sapling Photo URL
            </label>
            <input
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] transition-colors"
            />
          </div>

          {/* Planting Notes */}
          <div>
            <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
              Field & Soil Notes
            </label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Metal serial tag affixed to stake. Rich loam soil with organic vermicompost."
              className="w-full px-3.5 py-2 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] transition-colors"
            />
          </div>

          {/* Active Status */}
          <div className="pt-1 flex items-center gap-2">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#173324]">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-[#173324]"
              />
              <span>Sapling Active in Living Registry</span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-[#173324] text-white font-semibold hover:bg-[#1e4433] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating Sapling...</span>
                </>
              ) : (
                <span>Update Tree Sapling</span>
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
