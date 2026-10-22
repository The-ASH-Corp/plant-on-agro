"use client";

import { useState, useEffect } from "react";
import { BackendTreeInstance } from "@/services/tree-instances/tree-instance.service";
import { ExperienceItem, experienceService } from "@/services/experiences/experience.service";
import { VisitBookingRecord, visitService } from "@/services/visits/visit.service";
import { BookVisitModal } from "./BookVisitModal";
import { AddVisitMemoryModal } from "./AddVisitMemoryModal";
import { ExperienceDetailModal } from "./ExperienceDetailModal";
import { User } from "@/types/auth";

interface BuyerVisitsTabProps {
  user: User | null;
  instances: BackendTreeInstance[];
}

export function BuyerVisitsTab({ user, instances }: BuyerVisitsTabProps) {
  const [visits, setVisits] = useState<VisitBookingRecord[]>([]);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Modals state
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [selectedExpForBooking, setSelectedExpForBooking] = useState<ExperienceItem | null>(null);
  const [detailExp, setDetailExp] = useState<ExperienceItem | null>(null);
  const [memoryBooking, setMemoryBooking] = useState<VisitBookingRecord | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [visitsRes, expRes] = await Promise.allSettled([
        visitService.getMyVisits(user?.email),
        experienceService.getAll(),
      ]);

      if (visitsRes.status === "fulfilled" && visitsRes.value.data) {
        setVisits(visitsRes.value.data);
      }
      if (expRes.status === "fulfilled" && expRes.value.data?.items) {
        setExperiences(expRes.value.data.items);
      }
    } catch (err) {
      console.error("Error loading visit data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.email]);

  const categories = ["All", "Forest Walk", "Harvesting", "Wellness", "Heritage Stay", "Adventure"];

  const filteredExperiences = selectedCategory === "All"
    ? experiences
    : experiences.filter((e) => e.category === selectedCategory);

  // Collect all memories across visits
  const allMemories = visits.flatMap((v) =>
    (v.memories || []).map((m) => ({
      ...m,
      bookingRef: v.bookingReference,
      reserve: v.reserveName,
      date: v.visitDate,
    }))
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#173324] via-[#1b4332] to-[#2d6a4f] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>✨ Phase 04 of the PlantOn Journey</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2" style={{ fontFamily: "var(--font-display)" }}>
            04 They Visit: Experience Your Living Forest
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            You plant. We grow. You track. <strong>Now, walk among your living legacy.</strong> Visit your dedicated trees in Kerala, pick fresh harvest produce, and unwind at the RAC Realty wellness sanctuary.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setSelectedExpForBooking(null);
                setBookModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#173324] bg-white hover:bg-emerald-50 transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>🎫 Schedule Plantation Visit</span>
            </button>
            <span className="text-xs text-emerald-200">
              Complimentary arborist-guided visits for all tree guardians
            </span>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Section 1: Active & Upcoming Visitor Passes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#173324]" style={{ fontFamily: "var(--font-display)" }}>
              My Scheduled Visits & Visitor Passes
            </h2>
            <p className="text-xs text-gray-500">Show your digital visitor pass at the plantation reception gate</p>
          </div>
          <button
            onClick={() => {
              setSelectedExpForBooking(null);
              setBookModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#2d6a4f] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>+ Book New Date</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-5 bg-white rounded-2xl border border-gray-100 animate-pulse h-44" />
            ))}
          </div>
        ) : visits.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[#d4e9dd] space-y-3">
            <span className="text-4xl">🌿</span>
            <h3 className="text-base font-bold text-[#173324]">No visits scheduled yet</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Your trees are waiting! Book a complimentary guided trail with our certified arborists to inspect your saplings in person.
            </p>
            <button
              onClick={() => {
                setSelectedExpForBooking(null);
                setBookModalOpen(true);
              }}
              className="mt-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#2d6a4f] hover:bg-[#1b4332] shadow-sm transition-all cursor-pointer"
            >
              Schedule Your First Visit 🎫
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visits.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-[#d4e9dd] shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Reference & Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#173324] px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100">
                        {booking.bookingReference}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        booking.status === "Confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : booking.status === "Completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    {/* QR Code thumbnail */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span>Pass:</span>
                      <span className="font-mono font-semibold text-[#173324]">{booking.guestPassCode}</span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="mt-3.5 space-y-2">
                    <h3 className="text-base font-bold text-[#173324] leading-snug">
                      {booking.experienceTitle}
                    </h3>
                    <div className="text-xs text-gray-600 flex items-center gap-1.5">
                      <span>📍</span>
                      <span className="font-medium">{booking.reserveName}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                      <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                        <span className="text-gray-400 block text-[10px] uppercase">Date & Slot</span>
                        <span className="font-semibold text-[#173324]">
                          {new Date(booking.visitDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="block text-[11px] text-gray-500 truncate">{booking.timeSlot}</span>
                      </div>

                      <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                        <span className="text-gray-400 block text-[10px] uppercase">Visiting Party</span>
                        <span className="font-semibold text-[#173324]">{booking.numberOfGuests} Guests</span>
                        <span className="block text-[11px] text-gray-500 truncate">
                          {booking.guideName ? `Guide: ${booking.guideName}` : "Arborist Assigned"}
                        </span>
                      </div>
                    </div>

                    {/* Trees associated */}
                    {booking.associatedTrees.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                          Trees on Your Trail ({booking.associatedTrees.length}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {booking.associatedTrees.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"
                            >
                              🌱 {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">
                    {booking.memories?.length || 0} Photos Recorded
                  </span>
                  <button
                    onClick={() => setMemoryBooking(booking)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2d6a4f] bg-emerald-50 hover:bg-emerald-100 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>📸 Add Visit Photos</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Explore Plantation & RAC Realty Experiences */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#173324]" style={{ fontFamily: "var(--font-display)" }}>
              Explore Experiences & Nature Tourism
            </h2>
            <p className="text-xs text-gray-500">
              Agroforestry walks, seasonal harvests, and RAC Realty wellness therapies
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#2d6a4f] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExperiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-2xl border border-[#d4e9dd] shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Photo with multi-image badge */}
                <div
                  className="relative h-48 w-full bg-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => setDetailExp(exp)}
                >
                  <img
                    src={exp.featuredImage || exp.galleryImages[0]}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white">
                    {exp.category}
                  </span>

                  {/* Multi-Image count badge */}
                  {exp.galleryImages.length > 1 && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md text-[#173324] flex items-center gap-1">
                      📸 {exp.galleryImages.length} Photos
                    </span>
                  )}

                  {/* Bottom overlay: Duration & Rating */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-medium">⏱️ {exp.duration}</span>
                    <span className="font-bold flex items-center gap-1">⭐ {exp.rating}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-2">
                  <h3
                    className="text-base font-bold text-[#173324] hover:text-[#2d6a4f] transition-colors cursor-pointer line-clamp-1"
                    onClick={() => setDetailExp(exp)}
                  >
                    {exp.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {exp.tagline || exp.description}
                  </p>

                  {/* Inclusions preview */}
                  {exp.included.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1">
                      {exp.included.slice(0, 2).map((item, idx) => (
                        <span key={idx} className="text-[10px] text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 truncate max-w-[140px]">
                          ✓ {item}
                        </span>
                      ))}
                      {exp.included.length > 2 && (
                        <span className="text-[10px] text-[#2d6a4f] font-semibold self-center">
                          +{exp.included.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between bg-[#fafdfa]">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">Adopter Rate</span>
                  <span className="text-sm font-bold text-[#173324]">
                    {exp.price === 0 ? (
                      <span className="text-emerald-700">Free Pass</span>
                    ) : (
                      `₹${exp.price.toLocaleString("en-IN")}`
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDetailExp(exp)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    Gallery
                  </button>
                  <button
                    onClick={() => {
                      setSelectedExpForBooking(exp);
                      setBookModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#2d6a4f] hover:bg-[#1b4332] transition-all cursor-pointer shadow-sm"
                  >
                    Book Slot
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Visit Memories Gallery (Photos recorded from visits) */}
      {allMemories.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#d4e9dd] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#173324]" style={{ fontFamily: "var(--font-display)" }}>
                Field Album & Visit Memories
              </h2>
              <p className="text-xs text-gray-500">Live photographs logged from physical visits to the reserve</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800">
              {allMemories.length} Photographs
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allMemories.map((mem, idx) => (
              <div key={idx} className="group relative rounded-xl overflow-hidden aspect-square border border-gray-100 shadow-xs">
                <img src={mem.imageUrl} alt={mem.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end text-white text-xs">
                  <p className="font-medium line-clamp-2">{mem.caption}</p>
                  <span className="text-[10px] text-emerald-200 mt-1">{mem.reserve}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {bookModalOpen && (
        <BookVisitModal
          onClose={() => setBookModalOpen(false)}
          onSuccess={() => {
            setBookModalOpen(false);
            loadData();
          }}
          userTrees={instances}
          experiences={experiences}
          userEmail={user?.email}
          userName={user?.name}
          preselectedExperience={selectedExpForBooking}
        />
      )}

      {detailExp && (
        <ExperienceDetailModal
          experience={detailExp}
          onClose={() => setDetailExp(null)}
          onBook={(exp) => {
            setSelectedExpForBooking(exp);
            setBookModalOpen(true);
          }}
        />
      )}

      {memoryBooking && (
        <AddVisitMemoryModal
          booking={memoryBooking}
          onClose={() => setMemoryBooking(null)}
          onSuccess={() => {
            setMemoryBooking(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}
