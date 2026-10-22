"use client";

import { useState } from "react";
import { VisitBookingRecord, visitService } from "@/services/visits/visit.service";
import { uploadService } from "@/services/upload/upload.service";

interface AddVisitMemoryModalProps {
  booking: VisitBookingRecord;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddVisitMemoryModal({
  booking,
  onClose,
  onSuccess,
}: AddVisitMemoryModalProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle uploading multiple image files at once
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      setError(null);
      const fileList = Array.from(files);
      const uploadedUrls = await uploadService.uploadMultiple(fileList);
      setImageUrls((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      setError(err?.message || "Failed to upload photographs.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    setImageUrls((prev) => [...prev, urlInput.trim()]);
    setUrlInput("");
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrls.length === 0) {
      setError("Please add at least one photograph from your visit.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const memories = imageUrls.map((url) => ({
        imageUrl: url,
        caption: caption.trim() || `Field memory at ${booking.reserveName}`,
      }));

      await visitService.addMemories(booking.id, memories);
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to save visit memories.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#d4e9dd]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#eaf2ec]">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-emerald-50">📸</span>
            <div>
              <h2 className="text-lg font-bold text-[#173324]">Add Visit Memories & Photos</h2>
              <p className="text-xs text-gray-500">Pass: {booking.bookingReference} • {booking.reserveName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              ⚠️ {error}
            </div>
          )}

          {/* Multiple File Upload Button */}
          <div>
            <label className="block text-xs font-semibold text-[#173324] uppercase tracking-wider mb-2">
              Upload Photographs (Multiple Images Allowed)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 rounded-xl p-4 bg-emerald-50/50 hover:bg-emerald-50 cursor-pointer transition-all">
                <span className="text-2xl mb-1">🖼️</span>
                <span className="text-xs font-semibold text-[#2d6a4f]">
                  {isUploading ? "Uploading Photographs..." : "Click to select multiple photos"}
                </span>
                <span className="text-[11px] text-gray-500 mt-0.5">JPEG, PNG, WEBP up to 15MB each</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Or Paste Direct URL */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Or paste image URL:</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Preview of Uploaded Multiple Images */}
          {imageUrls.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#173324]">
                  Selected Photographs ({imageUrls.length})
                </span>
                <button
                  type="button"
                  onClick={() => setImageUrls([])}
                  className="text-xs text-red-500 hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 bg-[#f9fbf9] rounded-xl border border-gray-200">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden aspect-square border border-gray-200">
                    <img src={url} alt={`Memory ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Caption */}
          <div>
            <label className="block text-xs font-semibold text-[#173324] uppercase tracking-wider mb-1">
              Memory Story or Caption
            </label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Visited our Teak sapling POA-TK-1002 with our family! It's growing strong."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2d6a4f]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || imageUrls.length === 0}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Saving Memories..." : `Save ${imageUrls.length} Photographs`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
