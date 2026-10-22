"use client";

import { useState, useEffect } from "react";
import { VisitBookingRecord, visitService } from "@/services/visits/visit.service";
import { ExperienceItem, experienceService } from "@/services/experiences/experience.service";
import { AddExperienceModal } from "../modals/AddExperienceModal";

export function VisitsTab() {
  const [subTab, setSubTab] = useState<"bookings" | "experiences">("bookings");

  // Bookings state
  const [bookings, setBookings] = useState<VisitBookingRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Experiences state
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loadingExperiences, setLoadingExperiences] = useState(true);
  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null);

  // Guide assignment state
  const [assigningGuideBookingId, setAssigningGuideBookingId] = useState<string | null>(null);
  const [guideNameInput, setGuideNameInput] = useState("");

  const loadBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await visitService.getAll({
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: search.trim() || undefined,
      });
      if (res.data?.items) {
        setBookings(res.data.items);
      }
    } catch (err) {
      console.error("Error loading visit bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const loadExperiences = async () => {
    try {
      setLoadingExperiences(true);
      const res = await experienceService.getAll();
      if (res.data?.items) {
        setExperiences(res.data.items);
      }
    } catch (err) {
      console.error("Error loading experiences:", err);
    } finally {
      setLoadingExperiences(false);
    }
  };

  useEffect(() => {
    if (subTab === "bookings") {
      loadBookings();
    } else {
      loadExperiences();
    }
  }, [subTab, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadBookings();
  };

  const handleUpdateStatus = async (id: string, status: "Confirmed" | "Completed" | "Cancelled") => {
    try {
      await visitService.updateStatus(id, { status });
      loadBookings();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleAssignGuide = async (id: string) => {
    if (!guideNameInput.trim()) return;
    try {
      const current = bookings.find((b) => b.id === id);
      await visitService.updateStatus(id, {
        status: (current?.status as any) || "Confirmed",
        guideName: guideNameInput.trim(),
      });
      setAssigningGuideBookingId(null);
      setGuideNameInput("");
      loadBookings();
    } catch (err) {
      console.error("Error assigning guide:", err);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to remove this experience?")) return;
    try {
      await experienceService.delete(id);
      loadExperiences();
    } catch (err) {
      console.error("Error deleting experience:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>🗺️</span>
            <span>PlantOn Experiences & Visit Bookings</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Phase 04 "They Visit" • Manage plantation trails, visitor passes, and RAC Realty experience offerings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xl bg-gray-100 flex items-center gap-1 border border-gray-200">
            <button
              onClick={() => setSubTab("bookings")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                subTab === "bookings"
                  ? "bg-white text-[#173324] shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              📅 Scheduled Bookings ({bookings.length})
            </button>
            <button
              onClick={() => setSubTab("experiences")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                subTab === "experiences"
                  ? "bg-white text-[#173324] shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              🌿 Experience Catalog ({experiences.length})
            </button>
          </div>

          {subTab === "experiences" && (
            <button
              onClick={() => {
                setEditingExperience(null);
                setExperienceModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#2d6a4f] hover:bg-[#1b4332] transition-all cursor-pointer shadow-sm flex items-center gap-1"
            >
              <span>+ Add Experience</span>
            </button>
          )}
        </div>
      </div>

      {/* SUBTAB 1: BOOKINGS */}
      {subTab === "bookings" && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {["all", "Confirmed", "Completed", "Pending", "Cancelled"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer capitalize ${
                    statusFilter === st
                      ? "bg-[#2d6a4f] text-white font-bold"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {st === "all" ? "All Visits" : st}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by adopter, ref, reserve..."
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#2d6a4f] w-64"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase font-semibold text-[11px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Ref / Pass</th>
                    <th className="p-3.5">Adopter Details</th>
                    <th className="p-3.5">Experience & Reserve</th>
                    <th className="p-3.5">Date & Slot</th>
                    <th className="p-3.5">Assigned Guide</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loadingBookings ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400">
                        Loading visit bookings...
                      </td>
                    </tr>
                  ) : bookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400">
                        No visit bookings found matching the current filters.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-3.5 font-mono">
                          <span className="font-bold text-gray-900">{b.bookingReference}</span>
                          <span className="block text-[10px] text-gray-400 font-sans">Pass: {b.guestPassCode}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-gray-900 block">{b.adopterName}</span>
                          <span className="text-[11px] text-gray-500 block truncate max-w-[160px]">{b.adopterEmail}</span>
                          {b.adopterPhone && (
                            <span className="text-[10px] text-gray-400 block">{b.adopterPhone}</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className="font-medium text-gray-800 block truncate max-w-[200px]">{b.experienceTitle}</span>
                          <span className="text-[11px] text-emerald-700 block truncate max-w-[200px]">📍 {b.reserveName}</span>
                          {b.associatedTrees.length > 0 && (
                            <span className="text-[10px] text-gray-400 block mt-0.5">
                              Trees ({b.associatedTrees.length}): {b.associatedTrees.join(", ")}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-gray-900 block">
                            {new Date(b.visitDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-[11px] text-gray-500 block truncate max-w-[160px]">{b.timeSlot}</span>
                          <span className="text-[10px] text-gray-400 block">{b.numberOfGuests} Guests</span>
                        </td>
                        <td className="p-3.5">
                          {assigningGuideBookingId === b.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={guideNameInput}
                                onChange={(e) => setGuideNameInput(e.target.value)}
                                placeholder="Guide name"
                                className="w-28 px-2 py-1 rounded text-xs border border-gray-300 focus:outline-none focus:border-[#2d6a4f]"
                              />
                              <button
                                onClick={() => handleAssignGuide(b.id)}
                                className="px-2 py-1 rounded bg-[#2d6a4f] text-white text-[11px] font-bold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setAssigningGuideBookingId(null)}
                                className="text-xs text-gray-400 hover:text-gray-600"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-gray-700">
                                {b.guideName || "Unassigned"}
                              </span>
                              <button
                                onClick={() => {
                                  setAssigningGuideBookingId(b.id);
                                  setGuideNameInput(b.guideName || "");
                                }}
                                className="text-[11px] text-[#2d6a4f] hover:underline cursor-pointer"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            b.status === "Confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : b.status === "Completed"
                              ? "bg-blue-100 text-blue-800"
                              : b.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {b.status !== "Confirmed" && (
                              <button
                                onClick={() => handleUpdateStatus(b.id, "Confirmed")}
                                className="px-2 py-1 rounded text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 cursor-pointer"
                              >
                                Confirm
                              </button>
                            )}
                            {b.status !== "Completed" && (
                              <button
                                onClick={() => handleUpdateStatus(b.id, "Completed")}
                                className="px-2 py-1 rounded text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                              >
                                Complete
                              </button>
                            )}
                            {b.status !== "Cancelled" && (
                              <button
                                onClick={() => handleUpdateStatus(b.id, "Cancelled")}
                                className="px-2 py-1 rounded text-[11px] font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: EXPERIENCES */}
      {subTab === "experiences" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loadingExperiences ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-72 rounded-2xl bg-white border border-gray-200 animate-pulse" />
              ))
            ) : experiences.length === 0 ? (
              <div className="col-span-3 p-8 text-center bg-white rounded-xl border border-gray-200 text-gray-400">
                No experiences found. Click "+ Add Experience" above to create one.
              </div>
            ) : (
              experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Multi-Image Gallery Strip Preview */}
                    <div className="relative h-44 w-full bg-black overflow-hidden">
                      <img
                        src={exp.featuredImage || exp.galleryImages[0]}
                        alt={exp.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white">
                        {exp.category}
                      </span>
                      {exp.galleryImages.length > 1 && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 text-[#173324]">
                          📷 {exp.galleryImages.length} Photos
                        </span>
                      )}
                      <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs flex justify-between">
                        <span>⏱️ {exp.duration}</span>
                        <span>⭐ {exp.rating}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-1.5">
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{exp.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{exp.tagline || exp.description}</p>
                      <div className="text-[11px] text-emerald-800 font-medium pt-1 truncate">
                        📍 {exp.location}
                      </div>

                      {/* Mini thumbnail preview */}
                      {exp.galleryImages.length > 0 && (
                        <div className="flex gap-1 pt-1.5 overflow-x-auto">
                          {exp.galleryImages.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt="thumb"
                              className="w-8 h-8 rounded object-cover border border-gray-200 shrink-0"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">Price</span>
                      <span className="text-xs font-bold text-gray-900">
                        {exp.price === 0 ? "Complimentary" : `₹${exp.price.toLocaleString("en-IN")}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingExperience(exp);
                          setExperienceModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded text-xs font-semibold text-[#2d6a4f] bg-emerald-50 hover:bg-emerald-100 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="px-2.5 py-1 rounded text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Experience Modal with Multiple Images Upload */}
      {experienceModalOpen && (
        <AddExperienceModal
          onClose={() => setExperienceModalOpen(false)}
          onSuccess={() => {
            setExperienceModalOpen(false);
            loadExperiences();
          }}
          experienceToEdit={editingExperience}
        />
      )}
    </div>
  );
}
