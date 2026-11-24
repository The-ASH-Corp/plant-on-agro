"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { TreeInstanceItem, TreeHealthStatus, TreeGrowthUpdateItem } from "../types";
import { treeInstanceService } from "@/services/tree-instances/tree-instance.service";
import { getBackendOrigin } from "@/services/api/api-client";
import { Select } from "@/components/ui";

interface LogArboristUpdateModalProps {
  isOpen: boolean;
  instance: TreeInstanceItem | null;
  onClose: () => void;
  onSaveUpdate: (
    treeId: string,
    update: TreeGrowthUpdateItem,
    newHealthStatus?: TreeHealthStatus
  ) => Promise<void>;
  onDeleteUpdate?: (treeId: string, updateId: string) => Promise<void>;
  onSetPrimaryPhoto?: (treeId: string, imageUrl: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const ARBORIST_GROWTH_STAGES: { value: string; label: string; icon: string; desc: string }[] = [
  { value: "Sapling Planting", label: "Sapling Planting", icon: "🌱", desc: "Initial ground planting & root collar staking" },
  { value: "Early Rooting", label: "Early Rooting & Acclimatization", icon: "🌿", desc: "Taproot anchoring into native forest soil" },
  { value: "Vegetative Growth", label: "Vegetative Shoot & Foliage Growth", icon: "🍃", desc: "Active stem elongation & lush leaf canopy development" },
  { value: "Branching & Foliage", label: "Branching & Crown Expansion", icon: "🌲", desc: "Secondary lateral branch formation & photosynthetic density" },
  { value: "Canopy Development", label: "Canopy Maturation", icon: "🌳", desc: "Full canopy spread creating ecological understory shade" },
  { value: "Flowering & Blossom", label: "Flowering & Pollination", icon: "🌸", desc: "Blossoming attracting indigenous pollinators & biodiversity" },
  { value: "Fruit Bearing", label: "Fruit & Seed Bearing", icon: "🍎", desc: "Ecological fruit maturation & natural seed propagation" },
  { value: "Mature Protected Canopy", label: "Mature Protected Forest Canopy", icon: "🛡️", desc: "Permanent apex carbon sequestration & watershed defense" },
];

const HEALTH_OPTIONS: { value: TreeHealthStatus; label: string; icon: string; bg: string; text: string; border: string }[] = [
  { value: "Thriving", label: "Thriving (Peak Vigor)", icon: "🌳", bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  { value: "Healthy", label: "Healthy (Robust Growth)", icon: "🌿", bg: "bg-green-50", text: "text-green-800", border: "border-green-200" },
  { value: "Sapling Growing", label: "Sapling Growing (Standard)", icon: "🌱", bg: "bg-teal-50", text: "text-teal-800", border: "border-teal-200" },
  { value: "Needs Attention", label: "Needs Attention (Pruning / Care)", icon: "⚠️", bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  { value: "Critical", label: "Critical (Arborist Action Required)", icon: "🚨", bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
];

export function LogArboristUpdateModal({
  isOpen,
  instance,
  onClose,
  onSaveUpdate,
  onDeleteUpdate,
  onSetPrimaryPhoto,
  isSubmitting = false,
}: LogArboristUpdateModalProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [stageName, setStageName] = useState("Vegetative Growth");
  const [heightCm, setHeightCm] = useState("");
  const [recordedAt, setRecordedAt] = useState(new Date().toISOString().split("T")[0]);
  const [healthStatus, setHealthStatus] = useState<TreeHealthStatus>("Healthy");
  const [notes, setNotes] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewZoomUrl, setPreviewZoomUrl] = useState<string | null>(null);
  const [copiedTag, setCopiedTag] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever selected instance changes
  useEffect(() => {
    if (instance) {
      setHealthStatus(instance.healthStatus || "Healthy");
      setImageUrl("");
      setHeightCm("");
      setNotes("");
      setRecordedAt(new Date().toISOString().split("T")[0]);
      setUploadError(null);
      setPreviewZoomUrl(null);

      // Default stage to appropriate stage based on existing updates
      const pastUpdates = instance.growthUpdates || [];
      if (pastUpdates.length === 0) {
        setStageName("Sapling Planting");
      } else if (pastUpdates.length === 1) {
        setStageName("Early Rooting");
      } else if (pastUpdates.length >= 2 && pastUpdates.length < 5) {
        setStageName("Vegetative Growth");
      } else {
        setStageName("Branching & Foliage");
      }
    }
  }, [instance]);

  const resolveImageUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
    const origin = getBackendOrigin();
    return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  // Find previous height recorded
  const previousHeight = useMemo(() => {
    if (!instance?.growthUpdates || instance.growthUpdates.length === 0) return null;
    const sorted = [...instance.growthUpdates]
      .filter((u) => typeof u.heightCm === "number" && !isNaN(u.heightCm))
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    return sorted[0]?.heightCm ?? null;
  }, [instance]);

  const heightDelta = useMemo(() => {
    const current = Number(heightCm);
    if (!heightCm || isNaN(current) || previousHeight === null) return null;
    return current - previousHeight;
  }, [heightCm, previousHeight]);

  if (!isOpen || !instance) return null;

  const pastUpdates = [...(instance.growthUpdates || [])].sort(
    (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
  );

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }
    setIsUploading(true);
    setUploadError(null);
    try {
      const res = await treeInstanceService.uploadImage(file);
      if (res.data?.imageUrl) {
        setImageUrl(res.data.imageUrl);
      } else {
        throw new Error(res.message || "Failed to upload photo");
      }
    } catch (err: any) {
      console.error("Upload photo error:", err);
      setUploadError(err.message || "Failed to upload photo to forest storage");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setUploadError("A specimen photograph is required to log an arborist field inspection.");
      return;
    }

    const update: TreeGrowthUpdateItem = {
      id: `upd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      imageUrl: imageUrl.trim(),
      stageName: stageName.trim() || "Vegetative Growth",
      notes: notes.trim(),
      recordedAt: recordedAt || new Date().toISOString().split("T")[0],
      heightCm: heightCm ? Number(heightCm) : undefined,
    };

    try {
      await onSaveUpdate(instance.id, update, healthStatus);
      // Clear draft form inputs so the arborist can see the new item in history
      setImageUrl("");
      setHeightCm("");
      setNotes("");
      setUploadError(null);
    } catch (err: any) {
      setUploadError(err.message || "Could not save arborist inspection");
    }
  };

  const handleCopyTag = () => {
    navigator.clipboard.writeText(instance.treeTag);
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 2000);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting && !isUploading) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-[#fcfdfc] rounded-3xl max-w-4xl w-full shadow-2xl border border-[#d2ded7] relative max-h-[94vh] flex flex-col overflow-hidden text-[#173324]">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-[#e2eae5] bg-white flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <span>🌿</span>
                <span>Field Arborist Telemetry Station</span>
              </span>
              <button
                type="button"
                onClick={handleCopyTag}
                className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#0f2419] text-emerald-300 hover:bg-[#173324] cursor-pointer transition-colors flex items-center gap-1.5"
                title="Click to copy Tree ID"
              >
                <span>🏷️</span>
                <span>{instance.treeTag}</span>
                <span className="text-[10px] opacity-75">{copiedTag ? "✓ Copied" : "📋"}</span>
              </button>
            </div>

            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-xl sm:text-2xl font-bold text-[#173324]"
            >
              Log Tree Growth Photo & Field Inspection
            </h2>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#55695d] mt-1 font-medium">
              <span className="font-bold text-[#173324]">
                🌳 {instance.treeVarietyName || "Botanical Specimen"}
              </span>
              <span>•</span>
              <span>📍 {instance.assignedReserve}</span>
              {instance.adopterName && (
                <>
                  <span>•</span>
                  <span>
                    Adopter: <strong className="text-[#173324]">{instance.adopterName}</strong>
                    {instance.orderRef && ` (${instance.orderRef})`}
                  </span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-full bg-[#f2f6f3] hover:bg-[#e2eae5] text-[#55695d] hover:text-[#173324] flex items-center justify-center font-bold text-base cursor-pointer transition-colors shrink-0"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Telemetry Quick Strip */}
        <div className="px-5 sm:px-6 py-2.5 bg-[#f4f8f5] border-b border-[#e2eae5] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-[#73877b] uppercase font-bold block">Planted Date</span>
              <span className="font-semibold text-[#173324]">
                {instance.datePlanted ? new Date(instance.datePlanted).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—"}
              </span>
            </div>
            <div className="h-6 w-px bg-[#dce5df]" />
            <div>
              <span className="text-[10px] text-[#73877b] uppercase font-bold block">Current Health</span>
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {instance.healthStatus}
              </span>
            </div>
            <div className="h-6 w-px bg-[#dce5df]" />
            <div>
              <span className="text-[10px] text-[#73877b] uppercase font-bold block">Growth Logs</span>
              <span className="font-bold text-[#1b7a43]">
                📸 {pastUpdates.length} {pastUpdates.length === 1 ? "Update" : "Updates"} Recorded
              </span>
            </div>
            {previousHeight !== null && (
              <>
                <div className="h-6 w-px bg-[#dce5df]" />
                <div>
                  <span className="text-[10px] text-[#73877b] uppercase font-bold block">Last Recorded Height</span>
                  <span className="font-mono font-bold text-[#173324]">{previousHeight} cm</span>
                </div>
              </>
            )}
          </div>

          <span className="text-[11px] text-[#55695d] italic hidden md:inline">
            Field updates reflect directly on buyer&apos;s living telemetry dossier
          </span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {uploadError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between animate-fadeIn">
              <span className="flex items-center gap-2">
                <span className="text-base">⚠️</span>
                <span>{uploadError}</span>
              </span>
              <button
                type="button"
                onClick={() => setUploadError(null)}
                className="text-rose-600 hover:text-rose-900 font-bold ml-2 text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* Form: Log New Field Update */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 border border-[#e2eae5] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0f4f1]">
              <h3 className="font-bold text-sm text-[#173324] flex items-center gap-2">
                <span className="text-base">📸</span>
                <span>New Arborist Periodic Inspection Entry</span>
              </h3>
              <span className="text-[11px] text-[#73877b]">Stamps photo and health to living ledger</span>
            </div>

            {/* Photo Upload & Preview Box */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-7 space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#3d4f45] block">
                  Specimen Field Photograph *
                </label>

                {/* Drag and Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                    dragActive
                      ? "border-emerald-600 bg-emerald-50/80 scale-[1.01]"
                      : isUploading
                      ? "border-emerald-400 bg-emerald-50/40"
                      : "border-[#ccd9d1] bg-[#f9fbf9] hover:border-emerald-600 hover:bg-[#f2f7f4]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {isUploading ? (
                    <div className="py-3 flex flex-col items-center gap-2">
                      <span className="w-7 h-7 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-bold text-emerald-800">
                        Uploading photo to forest storage...
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg mb-0.5">
                        📷
                      </div>
                      <p className="text-xs font-bold text-[#173324]">
                        Click to Choose or Drag & Drop Specimen Photo
                      </p>
                      <p className="text-[10px] text-[#73877b]">
                        Supports Camera Capture on Mobile, JPG, PNG, WebP (Max 10MB)
                      </p>
                    </>
                  )}
                </div>

                {/* Alternative URL input */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-[#73877b] uppercase font-bold shrink-0">Or URL:</span>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... or /uploads/trees/..."
                    className="flex-1 px-3 py-1.5 text-xs font-mono rounded-xl border border-[#d2ded7] bg-white outline-none focus:border-[#173324]"
                  />
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="text-xs text-rose-600 hover:underline px-2 cursor-pointer font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Photo Preview Pane */}
              <div className="md:col-span-5 flex flex-col">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#3d4f45] block mb-2">
                  Photo Preview
                </label>
                <div className="flex-1 min-h-[160px] rounded-2xl overflow-hidden border border-[#d2ded7] bg-[#f4f7f5] relative flex items-center justify-center group">
                  {imageUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveImageUrl(imageUrl)}
                        alt="Growth update preview"
                        className="w-full h-full object-cover max-h-[190px]"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0f2419]/90 text-emerald-300 border border-emerald-400/40 backdrop-blur-md">
                          {stageName}
                        </span>
                        {heightCm && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/60 text-white backdrop-blur-md">
                            📏 {heightCm} cm
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewZoomUrl(imageUrl)}
                        className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 hover:bg-black text-white text-[10px] font-bold backdrop-blur-md transition-colors cursor-pointer"
                      >
                        🔍 Expand
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4 text-[#8b9c92] space-y-1">
                      <span className="text-3xl block">🌳</span>
                      <span className="text-xs font-medium">Awaiting photo upload</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Growth Stage, Height, Date, Health */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {/* Biological Growth Stage */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#44574c] block mb-1">
                  Biological Growth Stage *
                </label>
                <Select
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d2ded7] bg-white outline-none text-[#173324] font-semibold text-xs cursor-pointer focus:border-[#173324]"
                >
                  {ARBORIST_GROWTH_STAGES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.icon} {s.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Tree Height in cm */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#44574c] block">
                    Height in cm
                  </label>
                  {heightDelta !== null && (
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        heightDelta >= 0 ? "text-emerald-700" : "text-amber-700"
                      }`}
                    >
                      {heightDelta >= 0 ? `+${heightDelta} cm` : `${heightDelta} cm`}
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  step="0.5"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder={previousHeight ? `Last: ${previousHeight} cm` : "e.g. 75"}
                  className="w-full px-3 py-2 rounded-xl border border-[#d2ded7] bg-white outline-none text-[#173324] text-xs font-mono font-bold focus:border-[#173324]"
                />
              </div>

              {/* Inspection Date */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#44574c] block mb-1">
                  Recorded Date *
                </label>
                <input
                  type="date"
                  required
                  value={recordedAt}
                  onChange={(e) => setRecordedAt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d2ded7] bg-white outline-none text-[#173324] text-xs font-semibold focus:border-[#173324]"
                />
              </div>

              {/* Health Status Assessment */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#44574c] block mb-1">
                  Specimen Health *
                </label>
                <Select
                  value={healthStatus}
                  onChange={(e) => setHealthStatus(e.target.value as TreeHealthStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d2ded7] bg-white outline-none text-[#173324] font-semibold text-xs cursor-pointer focus:border-[#173324]"
                >
                  {HEALTH_OPTIONS.map((h) => (
                    <option key={h.value} value={h.value}>
                      {h.icon} {h.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Arborist Observations / Field Notes */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#44574c] block mb-1">
                Arborist Field Observations & Ground Health Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Vigorous crown expansion, new foliage sprouting, drip irrigation verified. Organic neem cake fertilizer applied."
                className="w-full px-3.5 py-2 rounded-xl border border-[#d2ded7] bg-white outline-none text-[#173324] text-xs focus:border-[#173324]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#f0f4f1]">
              <button
                type="submit"
                disabled={isSubmitting || isUploading || !imageUrl}
                className="px-6 py-2.5 rounded-xl bg-[#173324] hover:bg-[#1f4230] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Inspection...</span>
                  </>
                ) : (
                  <>
                    <span>🌿</span>
                    <span>Save Arborist Field Inspection</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Specimen Growth Journey / Previous Updates Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#173324] flex items-center gap-2">
                  <span>📸</span>
                  <span>Specimen Growth Photo Journey ({pastUpdates.length})</span>
                </h3>
                <p className="text-[11px] text-[#73877b]">
                  Chronological photographic record presented to tree adopter in their living dossier.
                </p>
              </div>
            </div>

            {pastUpdates.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-white border border-dashed border-[#ccd9d1] space-y-2">
                <span className="text-3xl block">📷</span>
                <p className="text-xs font-bold text-[#173324]">No Growth Photos Uploaded Yet</p>
                <p className="text-[11px] text-[#73877b] max-w-md mx-auto">
                  Take or upload the first periodic field photograph above to start this tree&apos;s photographic timeline!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {pastUpdates.map((update, idx) => {
                  const isPrimary = instance.imageUrl === update.imageUrl;

                  return (
                    <div
                      key={update.id || `upd-${idx}`}
                      className="bg-white rounded-2xl border border-[#e2eae5] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Photo Container */}
                        <div className="relative h-36 bg-gray-900 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={resolveImageUrl(update.imageUrl)}
                            alt={update.stageName || "Specimen update"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                          {/* Stage Pill */}
                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#0f2419]/90 text-emerald-300 border border-emerald-400/40 backdrop-blur-md">
                              {update.stageName || "Growth Observation"}
                            </span>
                            {update.heightCm && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-black/60 text-white backdrop-blur-md">
                                📏 {update.heightCm} cm
                              </span>
                            )}
                          </div>

                          {/* Primary Badge */}
                          {isPrimary && (
                            <div className="absolute top-2 right-2">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white shadow-xs">
                                ★ Primary Cover
                              </span>
                            </div>
                          )}

                          {/* Zoom Button */}
                          <button
                            type="button"
                            onClick={() => setPreviewZoomUrl(update.imageUrl)}
                            className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white text-xs flex items-center justify-center cursor-pointer backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100"
                            title="Zoom photo"
                          >
                            🔍
                          </button>

                          <div className="absolute bottom-2 left-2 text-[10px] text-white/90 font-mono font-bold">
                            📅 {update.recordedAt ? new Date(update.recordedAt).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—"}
                          </div>
                        </div>

                        {/* Notes */}
                        <div className="p-3">
                          <p className="text-xs text-[#44574c] italic line-clamp-2">
                            {update.notes ? `"${update.notes}"` : "Field inspection completed."}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-2.5 pt-0 flex items-center justify-between gap-2 border-t border-[#f4f7f5] mt-1">
                        {!isPrimary && onSetPrimaryPhoto ? (
                          <button
                            type="button"
                            onClick={() => onSetPrimaryPhoto(instance.id, update.imageUrl)}
                            className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <span>★ Set as Cover</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700">Cover Specimen</span>
                        )}

                        {onDeleteUpdate && update.id && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm("Remove this arborist inspection record and photo?")) {
                                onDeleteUpdate(instance.id, update.id!);
                              }
                            }}
                            className="text-[10px] text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1 rounded-md transition-colors cursor-pointer font-bold"
                            title="Delete this update"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#e2eae5] flex items-center justify-between">
          <span className="text-xs text-[#73877b]">
            Living Tree ID: <strong className="font-mono text-[#173324]">{instance.treeTag}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-[#d2ded7] text-[#55695d] hover:bg-[#f2f6f3] font-bold text-xs cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>

        {/* Full Image Zoom Modal */}
        {previewZoomUrl && (
          <div
            onClick={() => setPreviewZoomUrl(null)}
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          >
            <div className="relative max-w-3xl max-h-[90vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveImageUrl(previewZoomUrl)}
                alt="Full photo"
                className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/20"
              />
              <button
                type="button"
                onClick={() => setPreviewZoomUrl(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
