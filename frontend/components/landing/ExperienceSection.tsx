"use client";

import { useState, useEffect } from "react";
import { ExperienceItem, experienceService } from "@/services/experiences/experience.service";
import { ExperienceDetailModal } from "../buyer/ExperienceDetailModal";

interface ExperienceSectionProps {
  onScheduleVisit: () => void;
}

export function ExperienceSection({ onScheduleVisit }: ExperienceSectionProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExp, setSelectedExp] = useState<ExperienceItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchExperiences() {
      try {
        setLoading(true);
        const res = await experienceService.getAll();
        if (isMounted && res.data?.items) {
          setExperiences(res.data.items);
        }
      } catch (err) {
        console.warn("Could not load storefront experiences:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchExperiences();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="experiences" className="py-20 bg-[#f4f8f5] relative overflow-hidden">
      {/* Decorative background canopy blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2d6a4f]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-[#2d6a4f] text-xs font-bold uppercase tracking-wider mb-3">
            <span>🌿 Phase 04 • They Visit</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#173324] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Plant a Story. Grow a Legacy. <br />
            <span className="text-[#2d6a4f]">Now Walk Among Your Trees.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#52796f] leading-relaxed">
            PlantOn is more than tree planting. Our flagship 30-acre Kerala destination connects living forests with productive fruit harvesting, heritage stays, and rejuvenating RAC Realty wellness experiences.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#173324]">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-100 shadow-2xs">
              🌲 20 Acres PlantOn Living Forest
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-100 shadow-2xs">
              🧖 10 Acres RAC Realty Wellness & Stays
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-100 shadow-2xs">
              📍 Flagship Project — Kerala | 2026
            </span>
          </div>
        </div>

        {/* Experience Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-white border border-gray-100 shadow-xs animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((exp) => {
              const galleryCount = exp.galleryImages.length;
              return (
                <div
                  key={exp.id}
                  className="bg-white rounded-2xl border border-[#d4e9dd] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Hero Thumbnail with multi-image badge */}
                    <div
                      className="relative h-56 w-full bg-gray-100 overflow-hidden cursor-pointer"
                      onClick={() => setSelectedExp(exp)}
                    >
                      <img
                        src={exp.featuredImage || exp.galleryImages[0]}
                        alt={exp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      {/* Category Tag */}
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white">
                        {exp.category}
                      </span>

                      {/* Multi-Photo Count */}
                      {galleryCount > 1 && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-[#173324] shadow-xs flex items-center gap-1">
                          📸 {galleryCount} Photos
                        </span>
                      )}

                      {/* Bottom Image Info */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="font-semibold flex items-center gap-1">
                          ⏱️ {exp.duration}
                        </span>
                        <span className="font-bold flex items-center gap-1">
                          ⭐ {exp.rating}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-2.5">
                      <h3
                        className="text-lg font-bold text-[#173324] hover:text-[#2d6a4f] transition-colors cursor-pointer line-clamp-1"
                        onClick={() => setSelectedExp(exp)}
                      >
                        {exp.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {exp.tagline || exp.description}
                      </p>

                      {/* Location pill */}
                      <div className="text-xs text-emerald-800 font-medium flex items-center gap-1 pt-1">
                        <span>📍</span>
                        <span className="truncate">{exp.location}</span>
                      </div>

                      {/* Inclusions */}
                      {exp.included.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {exp.included.slice(0, 3).map((item, idx) => (
                            <span key={idx} className="text-[11px] text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 truncate max-w-[170px]">
                              ✓ {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-3 border-t border-gray-100 flex items-center justify-between bg-[#fafdfa]">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Adopter Pass</span>
                      <span className="text-sm font-bold text-[#173324]">
                        {exp.price === 0 ? (
                          <span className="text-emerald-700 font-extrabold">Complimentary</span>
                        ) : (
                          `₹${exp.price.toLocaleString("en-IN")}`
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedExp(exp)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        View Gallery
                      </button>
                      <button
                        onClick={onScheduleVisit}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        Book Visit 🎫
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* RAC Realty Partnership Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#173324] via-[#1b4332] to-[#2d6a4f] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <span>PlantOn × RAC Realty × RAC Global Consortium</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Nature Becomes The Destination
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              PlantOn creates the living forest. RAC Realty transforms the adjoining 10 acres into an experiential haven featuring heritage stays, farm-to-table dining, lotus ponds, mud therapy, and an Ayurvedic wellness spa.
            </p>
          </div>

          <button
            onClick={onScheduleVisit}
            className="px-6 py-3 rounded-2xl text-sm font-bold text-[#173324] bg-white hover:bg-emerald-50 transition-all shadow-lg shrink-0 cursor-pointer"
          >
            Plan Your Plantation Experience 🗺️
          </button>
        </div>
      </div>

      {/* Experience Multi-Image Lightbox Modal */}
      {selectedExp && (
        <ExperienceDetailModal
          experience={selectedExp}
          onClose={() => setSelectedExp(null)}
          onBook={() => {
            setSelectedExp(null);
            onScheduleVisit();
          }}
        />
      )}
    </section>
  );
}
