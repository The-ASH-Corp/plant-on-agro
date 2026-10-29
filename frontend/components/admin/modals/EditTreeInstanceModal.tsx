"use client";

import { useState, useEffect, useRef } from "react";
import { Select } from "@/components/ui";
import { TreeInstanceItem, TreeHealthStatus, TreeGrowthUpdateItem } from "../types";
import { treeInstanceService } from "@/services/tree-instances/tree-instance.service";

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

const GROWTH_STAGES = [
  "Sapling Planting",
  "Early Rooting",
  "Vegetative Growth",
  "Branching & Foliage",
  "Canopy Development",
  "Flowering & Blossom",
  "Fruit Bearing",
  "Mature Protected Canopy",
];

export function EditTreeInstanceModal({
  isOpen,
  instance,
  onClose,
  onSubmit,
  isSubmitting = false,
}: EditTreeInstanceModalProps) {
  const [activeTab, setActiveTab] = useState<"general" | "images">("general");
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

  // Growth Updates gallery state
  const [growthUpdates, setGrowthUpdates] = useState<TreeGrowthUpdateItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // New growth update draft form
  const [newUpdate, setNewUpdate] = useState<{
    imageUrl: string;
    stageName: string;
    heightCm: string;
    notes: string;
    recordedAt: string;
  }>({
    imageUrl: "",
    stageName: "Vegetative Growth",
    heightCm: "",
    notes: "",
    recordedAt: new Date().toISOString().split("T")[0],
  });

  // Editing existing growth update
  const [editingUpdateIndex, setEditingUpdateIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainImageInputRef = useRef<HTMLInputElement>(null);

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

      setGrowthUpdates(
        (instance.growthUpdates || []).map((u) => ({
          ...u,
          recordedAt: u.recordedAt ? u.recordedAt.split("T")[0] : new Date().toISOString().split("T")[0],
        }))
      );
      setEditingUpdateIndex(null);
      setUploadError(null);
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

  // Upload main tree photograph
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      const res = await treeInstanceService.uploadImage(file);
      if (res.data?.imageUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: res.data!.imageUrl }));
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload photograph");
    } finally {
      setIsUploading(false);
      if (mainImageInputRef.current) mainImageInputRef.current.value = "";
    }
  };

  // Upload growth update photograph
  const handleGrowthImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      const res = await treeInstanceService.uploadImage(file);
      if (res.data?.imageUrl) {
        setNewUpdate((prev) => ({ ...prev, imageUrl: res.data!.imageUrl }));
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Add new growth update record
  const handleAddGrowthUpdate = () => {
    if (!newUpdate.imageUrl.trim()) {
      setUploadError("Please provide an image URL or upload an image file first.");
      return;
    }

    const item: TreeGrowthUpdateItem = {
      id: `upd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      imageUrl: newUpdate.imageUrl.trim(),
      stageName: newUpdate.stageName.trim() || "Vegetative Growth",
      notes: newUpdate.notes.trim(),
      recordedAt: newUpdate.recordedAt || new Date().toISOString().split("T")[0],
      heightCm: newUpdate.heightCm ? Number(newUpdate.heightCm) : undefined,
    };

    setGrowthUpdates((prev) => [...prev, item]);
    // Also update main photo if not set
    if (!formData.imageUrl) {
      setFormData((prev) => ({ ...prev, imageUrl: item.imageUrl }));
    }

    setNewUpdate({
      imageUrl: "",
      stageName: "Vegetative Growth",
      heightCm: "",
      notes: "",
      recordedAt: new Date().toISOString().split("T")[0],
    });
    setUploadError(null);
  };

  // Save edit for existing growth update
  const handleSaveEditedUpdate = (index: number) => {
    setEditingUpdateIndex(null);
  };

  // Remove growth update record
  const handleRemoveGrowthUpdate = (index: number) => {
    setGrowthUpdates((prev) => prev.filter((_, i) => i !== index));
    if (editingUpdateIndex === index) {
      setEditingUpdateIndex(null);
    }
  };

  // Set as primary tree photograph
  const handleSetPrimaryPhoto = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
  };

  // Format image display helper
  const resolveImageUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const origin = apiUrl.replace(/\/api\/v1\/?$/, "");
    return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting && !isUploading) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#e2eae5] relative max-h-[92vh] overflow-y-auto">
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
            Physical Living Ledger • Serial: {instance.treeTag}
          </span>
        </div>

        <h3
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl text-[#173324] mb-1 font-bold"
        >
          Update Tree Details & Photos
        </h3>
        <p className="text-xs text-[#55695d] mb-4">
          Manage ground telemetry, physical arborist notes, and client-facing growth photographs.
        </p>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f2f6f3] rounded-2xl border border-[#e2eae5] mb-5">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "general"
                ? "bg-white text-[#173324] shadow-xs"
                : "text-[#627a6c] hover:text-[#173324]"
            }`}
          >
            <span>📋</span>
            <span>Tree Profile & Ground Data</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("images")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "images"
                ? "bg-white text-[#173324] shadow-xs"
                : "text-[#627a6c] hover:text-[#173324]"
            }`}
          >
            <span>📸</span>
            <span>Growth Photos & Timeline ({growthUpdates.length})</span>
          </button>
        </div>

        {uploadError && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
            <span>⚠️ {uploadError}</span>
            <button
              type="button"
              onClick={() => setUploadError(null)}
              className="text-rose-500 hover:text-rose-800 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <input type="hidden" name="id" value={instance.id} />
          {/* JSON stringified growth updates so parent form handler receives them */}
          <input type="hidden" name="growthUpdates" value={JSON.stringify(growthUpdates)} />

          {activeTab === "general" && (
            <div className="space-y-3.5 animate-fadeIn">
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
                  <Select
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
                  </Select>
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

              {/* Primary Image preview & file upload */}
              <div className="p-3.5 rounded-2xl bg-[#fafcfa] border border-[#e2eae5] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block">
                    Primary Tree Photograph
                  </label>
                  <button
                    type="button"
                    onClick={() => mainImageInputRef.current?.click()}
                    disabled={isUploading}
                    className="text-[11px] font-bold text-[#1b7a43] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>📤 Upload File</span>
                  </button>
                  <input
                    type="file"
                    ref={mainImageInputRef}
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex items-center gap-3">
                  {formData.imageUrl ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#d2ded7] shrink-0 bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveImageUrl(formData.imageUrl)}
                        alt="Tree thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-dashed border-[#ccd9d1] bg-[#f4f7f5] flex items-center justify-center text-xl shrink-0 text-[#8b9c92]">
                      🌳
                    </div>
                  )}
                  <input
                    name="imageUrl"
                    type="text"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="Image URL or upload file..."
                    className="flex-1 px-3 py-2 font-mono text-[11px] rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-white focus:border-[#173324] transition-colors"
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
            </div>
          )}

          {activeTab === "images" && (
            <div className="space-y-4 animate-fadeIn">
              {/* Add New Growth Update Box */}
              <div className="p-4 rounded-2xl bg-[#f7faf8] border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#173324] text-xs flex items-center gap-1.5">
                    <span>🌱</span>
                    <span>Add New Tree Growth Photo & Inspection Record</span>
                  </h4>
                  {isUploading && (
                    <span className="text-[11px] font-semibold text-emerald-700 animate-pulse flex items-center gap-1">
                      <span className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      Uploading image...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-[#44574c] text-[10px] uppercase block mb-1">
                      Photo Source (Upload or URL) *
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Image URL or upload via button..."
                        value={newUpdate.imageUrl}
                        onChange={(e) => setNewUpdate((prev) => ({ ...prev, imageUrl: e.target.value }))}
                        className="flex-1 px-3 py-2 font-mono text-xs rounded-xl border border-[#d2ded7] bg-white outline-none text-[#173324]"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-colors"
                      >
                        Upload
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleGrowthImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[#44574c] text-[10px] uppercase block mb-1">
                      Growth Stage
                    </label>
                    <Select
                      value={newUpdate.stageName}
                      onChange={(e) => setNewUpdate((prev) => ({ ...prev, stageName: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-[#d2ded7] bg-white outline-none text-[#173324] font-medium cursor-pointer"
                    >
                      {GROWTH_STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-[#44574c] text-[10px] uppercase block mb-1">
                      Current Height (cm)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 75"
                      value={newUpdate.heightCm}
                      onChange={(e) => setNewUpdate((prev) => ({ ...prev, heightCm: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-[#d2ded7] bg-white outline-none text-[#173324]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#44574c] text-[10px] uppercase block mb-1">
                      Recorded Date *
                    </label>
                    <input
                      type="date"
                      value={newUpdate.recordedAt}
                      onChange={(e) => setNewUpdate((prev) => ({ ...prev, recordedAt: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-[#d2ded7] bg-white outline-none text-[#173324]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#44574c] text-[10px] uppercase block mb-1">
                    Arborist Inspection Observations
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Strong vertical shoot, vigorous leaf buds, healthy root flare..."
                    value={newUpdate.notes}
                    onChange={(e) => setNewUpdate((prev) => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#d2ded7] bg-white outline-none text-[#173324]"
                  />
                </div>

                <div className="pt-1 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleAddGrowthUpdate}
                    className="px-4 py-2 rounded-xl bg-[#173324] hover:bg-[#1f4230] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>+</span>
                    <span>Add Growth Photo Record</span>
                  </button>
                </div>
              </div>

              {/* Existing Growth Updates List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#173324] text-xs uppercase tracking-wider">
                    Recorded Growth Timeline ({growthUpdates.length})
                  </h4>
                  <span className="text-[11px] text-[#73877b]">
                    Clients see these photos & updates in their tree dossier
                  </span>
                </div>

                {growthUpdates.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[#fafcfa] border border-dashed border-[#ccd9d1] space-y-2">
                    <span className="text-3xl block">📷</span>
                    <p className="text-xs font-semibold text-[#173324]">No Growth Photos Added Yet</p>
                    <p className="text-[11px] text-[#73877b] max-w-sm mx-auto">
                      Use the form above to add inspection photos, tree heights, and notes. The client will be able to view their tree&apos;s growth journey over time!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {growthUpdates.map((update, index) => {
                      const isEditing = editingUpdateIndex === index;
                      const isPrimary = formData.imageUrl === update.imageUrl;

                      return (
                        <div
                          key={update.id || `upd-idx-${index}`}
                          className="p-3 rounded-2xl bg-white border border-[#e2eae5] shadow-xs hover:border-[#1b7a43] transition-colors"
                        >
                          {isEditing ? (
                            /* Inline Edit Form for this update */
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[#173324] text-xs">
                                  Edit Photo & Growth Details #{index + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleSaveEditedUpdate(index)}
                                  className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                                >
                                  Done Editing
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] font-bold text-[#55695d] uppercase block mb-0.5">
                                    Image URL
                                  </label>
                                  <input
                                    type="text"
                                    value={update.imageUrl}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setGrowthUpdates((prev) =>
                                        prev.map((item, i) => (i === index ? { ...item, imageUrl: val } : item))
                                      );
                                    }}
                                    className="w-full px-2.5 py-1.5 font-mono text-[11px] rounded-lg border border-[#d2ded7] bg-[#fcfaf7]"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-[#55695d] uppercase block mb-0.5">
                                    Stage Name
                                  </label>
                                  <Select
                                    value={update.stageName || "Vegetative Growth"}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setGrowthUpdates((prev) =>
                                        prev.map((item, i) => (i === index ? { ...item, stageName: val } : item))
                                      );
                                    }}
                                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#d2ded7] bg-[#fcfaf7]"
                                  >
                                    {GROWTH_STAGES.map((s) => (
                                      <option key={s} value={s}>
                                        {s}
                                      </option>
                                    ))}
                                  </Select>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] font-bold text-[#55695d] uppercase block mb-0.5">
                                    Height (cm)
                                  </label>
                                  <input
                                    type="number"
                                    value={update.heightCm ?? ""}
                                    onChange={(e) => {
                                      const val = e.target.value ? Number(e.target.value) : undefined;
                                      setGrowthUpdates((prev) =>
                                        prev.map((item, i) => (i === index ? { ...item, heightCm: val } : item))
                                      );
                                    }}
                                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#d2ded7] bg-[#fcfaf7]"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-[#55695d] uppercase block mb-0.5">
                                    Recorded Date
                                  </label>
                                  <input
                                    type="date"
                                    value={update.recordedAt || ""}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setGrowthUpdates((prev) =>
                                        prev.map((item, i) => (i === index ? { ...item, recordedAt: val } : item))
                                      );
                                    }}
                                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#d2ded7] bg-[#fcfaf7]"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-[#55695d] uppercase block mb-0.5">
                                  Notes & Observations
                                </label>
                                <input
                                  type="text"
                                  value={update.notes || ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setGrowthUpdates((prev) =>
                                      prev.map((item, i) => (i === index ? { ...item, notes: val } : item))
                                    );
                                  }}
                                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#d2ded7] bg-[#fcfaf7]"
                                />
                              </div>
                            </div>
                          ) : (
                            /* Summary Row */
                            <div className="flex items-center gap-3">
                              <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#d2ded7] shrink-0 bg-gray-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={resolveImageUrl(update.imageUrl)}
                                  alt={update.stageName || "Tree update"}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[#173324] truncate">
                                    {update.stageName || "Growth Observation"}
                                  </span>
                                  {update.heightCm && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                                      {update.heightCm} cm
                                    </span>
                                  )}
                                  {isPrimary && (
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                                      Primary Cover
                                    </span>
                                  )}
                                </div>

                                <div className="text-[11px] text-[#73877b] flex items-center gap-2 mt-0.5">
                                  <span>📅 {update.recordedAt}</span>
                                  {update.notes && (
                                    <span className="truncate italic max-w-xs text-[#55695d]">
                                      • &ldquo;{update.notes}&rdquo;
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {!isPrimary && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetPrimaryPhoto(update.imageUrl)}
                                    className="text-[10px] font-semibold text-[#1b7a43] hover:underline px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 cursor-pointer"
                                    title="Set as primary tree photograph"
                                  >
                                    Set Primary
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setEditingUpdateIndex(index)}
                                  className="text-[11px] font-semibold text-[#173324] hover:bg-[#f2f6f3] p-1.5 rounded-lg transition-colors cursor-pointer"
                                  title="Edit details"
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGrowthUpdate(index)}
                                  className="text-[11px] font-semibold text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                                  title="Delete record"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions Bar */}
          <div className="pt-3 border-t border-[#f0f4f1] flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 py-3 rounded-xl bg-[#173324] text-white font-semibold hover:bg-[#1e4433] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <span>Save All Changes & Photo Updates</span>
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
