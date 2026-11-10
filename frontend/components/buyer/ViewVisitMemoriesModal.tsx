"use client";

import { useState } from "react";
import { VisitBookingRecord } from "@/services/visits/visit.service";
import { getMediaUrl, handleImageError } from "@/services/media/media.service";

interface ViewVisitMemoriesModalProps {
  booking: VisitBookingRecord;
  onClose: () => void;
  onAddMorePhotos?: () => void;
}

export function ViewVisitMemoriesModal({
  booking,
  onClose,
  onAddMorePhotos,
}: ViewVisitMemoriesModalProps) {
  const memories = booking.memories || [];
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null || memories.length === 0) return;
    setSelectedPhotoIndex((prev) => (prev! > 0 ? prev! - 1 : memories.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null || memories.length === 0) return;
    setSelectedPhotoIndex((prev) => (prev! < memories.length - 1 ? prev! + 1 : 0));
  };

  const currentPhoto = selectedPhotoIndex !== null ? memories[selectedPhotoIndex] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-[#d4e9dd] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#eaf2ec] bg-[#f8faf8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-xl shadow-xs">
              📸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#173324]" style={{ fontFamily: "var(--font-display)" }}>
                  Visit Memories & Field Album
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {memories.length} {memories.length === 1 ? "Photograph" : "Photographs"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 flex flex-wrap items-center gap-2">
                <span className="font-mono font-semibold text-[#173324]">Pass: {booking.guestPassCode || booking.bookingReference}</span>
                <span>•</span>
                <span>📍 {booking.reserveName}</span>
                <span>•</span>
                <span>{new Date(booking.visitDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Visit Details Context Bar */}
        <div className="px-5 py-3 bg-[#f0f6f2] border-b border-[#e2ece5] text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-700">
              <span className="font-semibold text-[#173324]">{booking.experienceTitle}</span>
              <span className="text-gray-400">({booking.timeSlot})</span>
            </div>
            <div className="hidden sm:inline text-gray-500">
              👥 {booking.numberOfGuests} Guests • {booking.guideName ? `Arborist: ${booking.guideName}` : "Arborist Guided"}
            </div>
          </div>

          {booking.associatedTrees && booking.associatedTrees.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-gray-500 font-medium">Trees on Trail:</span>
              {booking.associatedTrees.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-emerald-800 border border-emerald-200 shadow-2xs"
                >
                  🌱 {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Photos Grid Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {memories.length === 0 ? (
            <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-3">
              <span className="text-4xl">📸</span>
              <h3 className="text-base font-bold text-[#173324]">No memories logged yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Add photos taken during your living forest visit to preserve your grove journey!
              </p>
              {booking.status !== "Cancelled" && onAddMorePhotos && (
                <button
                  onClick={onAddMorePhotos}
                  className="mt-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2d6a4f] hover:bg-[#1b4332] transition-all cursor-pointer shadow-sm"
                >
                  📸 Add Visit Photos
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {memories.map((mem, idx) => {
                const resolvedUrl = getMediaUrl(mem.imageUrl);
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col hover:border-emerald-300"
                  >
                    {/* Image Thumbnail with Overlay */}
                    <div className="relative aspect-4/3 w-full bg-gray-100 overflow-hidden">
                      <img
                        src={resolvedUrl}
                        alt={mem.caption || `Visit photograph ${idx + 1}`}
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-xs flex items-center gap-1.5 shadow-sm">
                          🔍 View Fullscreen
                        </span>
                      </div>
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/50 text-white text-[10px] font-mono backdrop-blur-xs">
                        #{idx + 1}
                      </div>
                    </div>

                    {/* Caption & Metadata */}
                    <div className="p-3 flex-1 flex flex-col justify-between bg-white">
                      <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-relaxed">
                        {mem.caption || `Field memory at ${booking.reserveName}`}
                      </p>
                      <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                        <span>
                          {mem.recordedAt
                            ? new Date(mem.recordedAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : new Date(booking.visitDate).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                        </span>
                        <span className="text-emerald-700 font-semibold group-hover:underline">
                          Enlarge ↗
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#eaf2ec] bg-[#f8faf8] flex items-center justify-between gap-3">
          <span className="text-xs text-gray-500 hidden sm:inline">
            Preserving your living forest journey across time and seasons
          </span>
          <div className="flex items-center gap-2 ml-auto">
            {booking.status !== "Cancelled" && onAddMorePhotos && (
              <button
                onClick={onAddMorePhotos}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#2d6a4f] bg-emerald-100/70 hover:bg-emerald-200 border border-emerald-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span>📸 Add More Photos</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox / Fullscreen Overlay */}
      {selectedPhotoIndex !== null && currentPhoto && (
        <div
          onClick={() => setSelectedPhotoIndex(null)}
          className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-lg flex flex-col items-center justify-between p-4 sm:p-6 animate-fade-in"
          style={{ zIndex: 70 }}
        >
          {/* Lightbox Topbar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl flex items-center justify-between text-white pb-3 border-b border-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-white/10 border border-white/20">
                Photo {selectedPhotoIndex + 1} of {memories.length}
              </span>
              <span className="text-xs text-gray-300 truncate max-w-xs sm:max-w-md">
                {currentPhoto.caption || `Field memory at ${booking.reserveName}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={getMediaUrl(currentPhoto.imageUrl)}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all flex items-center gap-1.5"
                title="Open original high-res image"
              >
                <span>↗ Open Original</span>
              </a>
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-all cursor-pointer"
                title="Close Lightbox"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Lightbox Center Image with Navigation Arrows */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex-1 w-full max-w-5xl flex items-center justify-center py-4"
          >
            {memories.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 z-10 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-xl transition-all cursor-pointer border border-white/20 backdrop-blur-xs shadow-lg"
                title="Previous Photograph"
              >
                ‹
              </button>
            )}

            <div className="max-h-[72vh] max-w-full flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={getMediaUrl(currentPhoto.imageUrl)}
                alt={currentPhoto.caption || "Visit Memory"}
                onError={handleImageError}
                className="max-h-[72vh] max-w-full object-contain rounded-xl select-none"
              />
            </div>

            {memories.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 z-10 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-xl transition-all cursor-pointer border border-white/20 backdrop-blur-xs shadow-lg"
                title="Next Photograph"
              >
                ›
              </button>
            )}
          </div>

          {/* Lightbox Bottom Caption Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-black/60 border border-white/10 rounded-xl p-3 text-center text-white backdrop-blur-xs"
          >
            <p className="text-sm font-medium">
              {currentPhoto.caption || `Field memory at ${booking.reserveName}`}
            </p>
            <div className="mt-1 flex items-center justify-center gap-3 text-xs text-gray-400">
              <span>📍 {booking.reserveName}</span>
              <span>•</span>
              <span>Pass: {booking.guestPassCode}</span>
              {currentPhoto.recordedAt && (
                <>
                  <span>•</span>
                  <span>
                    Recorded:{" "}
                    {new Date(currentPhoto.recordedAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
