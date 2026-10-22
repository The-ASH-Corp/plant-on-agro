"use client";

import { useState } from "react";
import { ExperienceItem } from "@/services/experiences/experience.service";

interface ExperienceDetailModalProps {
  experience: ExperienceItem;
  onClose: () => void;
  onBook: (exp: ExperienceItem) => void;
}

export function ExperienceDetailModal({
  experience,
  onClose,
  onBook,
}: ExperienceDetailModalProps) {
  const images = experience.galleryImages.length > 0
    ? experience.galleryImages
    : [experience.featuredImage || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format"];

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl border border-[#d4e9dd]">
        {/* Main Photo Gallery Hero */}
        <div className="relative h-64 sm:h-80 w-full bg-black overflow-hidden group">
          <img
            src={images[activeImageIdx]}
            alt={experience.title}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-all cursor-pointer z-10"
          >
            ✕
          </button>

          {/* Category & Rating Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600/90 text-white backdrop-blur-sm">
              {experience.category}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-[#173324] backdrop-blur-sm flex items-center gap-1">
              ⭐ {experience.rating} ({experience.reviewsCount} reviews)
            </span>
          </div>

          {/* Title & Tagline overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>
              {experience.title}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 line-clamp-1">{experience.tagline}</p>
          </div>

          {/* Gallery navigation controls */}
          {images.length > 1 && (
            <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between pointer-events-none">
              <button
                type="button"
                onClick={() => setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                className="w-8 h-8 rounded-full bg-black/60 text-white pointer-events-auto flex items-center justify-center hover:bg-black/90 cursor-pointer"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                className="w-8 h-8 rounded-full bg-black/60 text-white pointer-events-auto flex items-center justify-center hover:bg-black/90 cursor-pointer"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* Thumbnail Selector Strip (Multi-Image Gallery) */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 border-b border-gray-100 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIdx === idx ? "border-[#2d6a4f] ring-2 ring-[#2d6a4f]/30 scale-105" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
            <span className="text-[11px] text-gray-400 ml-auto whitespace-nowrap pl-2">
              Photo {activeImageIdx + 1} of {images.length}
            </span>
          </div>
        )}

        {/* Details Section */}
        <div className="p-6 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-500">Duration</div>
              <div className="text-sm font-bold text-[#173324] mt-0.5">{experience.duration}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-500">Max Group</div>
              <div className="text-sm font-bold text-[#173324] mt-0.5">{experience.maxGroupSize} Guests</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-500">Adopter Pass</div>
              <div className="text-sm font-bold text-[#2d6a4f] mt-0.5">
                {experience.price === 0 ? "Complimentary" : `₹${experience.price.toLocaleString("en-IN")}`}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-[#173324] uppercase tracking-wider mb-2">Overview</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{experience.description}</p>
          </div>

          {/* Inclusions */}
          {experience.included.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-[#173324] uppercase tracking-wider mb-2">What is Included</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {experience.included.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Destination & Synergy */}
          <div className="p-4 rounded-xl bg-[#f9fbf9] border border-[#d4e9dd] flex items-start gap-3">
            <span className="text-2xl mt-0.5">📍</span>
            <div>
              <div className="text-xs font-bold text-[#173324]">{experience.location}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                Integrated Agro-Forestry & RAC Realty Destination. Arborist guides escort adopters to their exact tree coordinates.
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <div className="text-xs text-gray-500">Booking Rate</div>
              <div className="text-lg font-bold text-[#173324]">
                {experience.price === 0 ? (
                  <span className="text-emerald-700">Free for Adopters</span>
                ) : (
                  <span>₹{experience.price.toLocaleString("en-IN")} <span className="text-xs text-gray-500 font-normal">/ person</span></span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBook(experience);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] shadow-md hover:shadow-lg cursor-pointer"
              >
                Book This Experience 🌿
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
