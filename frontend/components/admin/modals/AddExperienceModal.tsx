"use client";

import { useState } from "react";
import { CreateExperiencePayload, experienceService, ExperienceItem } from "@/services/experiences/experience.service";
import { uploadService } from "@/services/upload/upload.service";

interface AddExperienceModalProps {
  onClose: () => void;
  onSuccess: () => void;
  experienceToEdit?: ExperienceItem | null;
}

const CATEGORIES = [
  "Forest Walk",
  "Harvesting",
  "Wellness",
  "Heritage Stay",
  "Farm Experience",
  "Adventure",
];

export function AddExperienceModal({
  onClose,
  onSuccess,
  experienceToEdit,
}: AddExperienceModalProps) {
  const isEditing = Boolean(experienceToEdit);

  const [title, setTitle] = useState(experienceToEdit?.title || "");
  const [category, setCategory] = useState(experienceToEdit?.category || "Forest Walk");
  const [tagline, setTagline] = useState(experienceToEdit?.tagline || "");
  const [description, setDescription] = useState(experienceToEdit?.description || "");
  const [location, setLocation] = useState(
    experienceToEdit?.location || "Flagship Living Forest — Wayanad, Kerala"
  );
  const [duration, setDuration] = useState(experienceToEdit?.duration || "3 Hours");
  const [price, setPrice] = useState(experienceToEdit?.price ?? 0);
  const [maxGroupSize, setMaxGroupSize] = useState(experienceToEdit?.maxGroupSize ?? 15);

  // Inclusions
  const [inclusions, setInclusions] = useState<string[]>(
    experienceToEdit?.included || [
      "Guided Arborist Walk",
      "Locate Your Adopted Trees",
      "Herbal Refreshments",
    ]
  );
  const [newInclusion, setNewInclusion] = useState("");

  // Multiple Gallery Images
  const [galleryImages, setGalleryImages] = useState<string[]>(
    experienceToEdit?.galleryImages || []
  );
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle uploading multiple image files from disk
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      setError(null);
      const fileList = Array.from(files);
      const uploadedUrls = await uploadService.uploadMultiple(fileList, true);
      setGalleryImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      setError(err?.message || "Failed to upload images.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    setGalleryImages((prev) => [...prev, urlInput.trim()]);
    setUrlInput("");
  };

  const removeImage = (idx: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const addInclusion = () => {
    if (!newInclusion.trim()) return;
    setInclusions([...inclusions, newInclusion.trim()]);
    setNewInclusion("");
  };

  const removeInclusion = (idx: number) => {
    setInclusions(inclusions.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    const payload: CreateExperiencePayload = {
      title: title.trim(),
      category,
      tagline: tagline.trim(),
      description: description.trim(),
      location: location.trim(),
      duration: duration.trim(),
      price: Number(price) || 0,
      maxGroupSize: Number(maxGroupSize) || 15,
      included: inclusions,
      galleryImages,
      featuredImage: galleryImages[0] || "",
    };

    try {
      setIsSubmitting(true);
      setError(null);

      if (isEditing && experienceToEdit) {
        await experienceService.update(experienceToEdit.id, payload);
      } else {
        await experienceService.create(payload);
      }

      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to save experience.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <h2 className="text-lg font-bold text-[#173324]">
              {isEditing ? "Edit Destination Experience" : "Add New Destination Experience"}
            </h2>
            <p className="text-xs text-gray-500">Agroforestry trails, wellness therapies, and heritage stays</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              ⚠️ {error}
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Experience Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sacred Forest Canopy Walk & Arborist Trail"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2d6a4f] bg-white"

              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Short Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Connect deeply with living indigenous trees guided by expert botanists."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2d6a4f]"
            />
          </div>

          {/* Location & Duration & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Wayanad, Kerala"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 3 Hours, Half Day, 2D/1N"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Price (₹) (0 = Free)
              </label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Full Overview & Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed overview of the experience, arborist guidance, what patrons will see and do..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2d6a4f]"
            />
          </div>

          {/* Multiple Gallery Images Upload */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#173324] uppercase tracking-wider">
                Photo Gallery (Multiple Images Allowed)
              </label>
              <span className="text-[11px] text-gray-500">{galleryImages.length} photos added</span>
            </div>

            {/* File Upload Trigger */}
            <div className="flex items-center gap-2">
              <label className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs">
                <span>📤 Upload Multiple Photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
              {isUploading && (
                <span className="text-xs text-emerald-700 animate-pulse font-medium">
                  Uploading files...
                </span>
              )}
            </div>

            {/* Direct URL input */}
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Or paste image URL (https://...)"
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#2d6a4f] bg-white"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer"
              >
                + Add URL
              </button>
            </div>

            {/* Thumbnails preview */}
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                {galleryImages.map((url, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden aspect-square border border-gray-300 bg-black">
                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-emerald-700 text-white text-[9px] text-center font-bold py-0.5">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inclusions List */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Included Amenities & Activities
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newInclusion}
                onChange={(e) => setNewInclusion(e.target.value)}
                placeholder="e.g. Farm-to-Table Lunch, Shinrin-yoku session"
                className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
              <button
                type="button"
                onClick={addInclusion}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#2d6a4f] text-white hover:bg-[#1b4332] cursor-pointer"
              >
                + Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {inclusions.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-gray-100 text-gray-700 border border-gray-200"
                >
                  <span>✓ {item}</span>
                  <button
                    type="button"
                    onClick={() => removeInclusion(idx)}
                    className="text-gray-400 hover:text-red-500 font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
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
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update Experience" : "Create Experience"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
