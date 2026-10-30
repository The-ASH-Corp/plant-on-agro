"use client";

import { useState } from "react";
import { Select, PhoneInput, validatePhoneNumber } from "@/components/ui";
import { BackendTreeInstance } from "@/services/tree-instances/tree-instance.service";
import { ExperienceItem } from "@/services/experiences/experience.service";
import { visitService, CreateVisitBookingPayload } from "@/services/visits/visit.service";

interface BookVisitModalProps {
  onClose: () => void;
  onSuccess: () => void;
  userTrees: BackendTreeInstance[];
  experiences: ExperienceItem[];
  userEmail?: string;
  userName?: string;
  preselectedExperience?: ExperienceItem | null;
}

const TIME_SLOTS = [
  "Morning Dew Walk (08:30 AM – 12:00 PM)",
  "Afternoon Canopy Trail (02:00 PM – 05:30 PM)",
  "Sunset Agro & Stargazing (04:30 PM – 08:00 PM)",
];

export function BookVisitModal({
  onClose,
  onSuccess,
  userTrees,
  experiences,
  userEmail = "",
  userName = "",
  preselectedExperience,
}: BookVisitModalProps) {
  const [adopterName, setAdopterName] = useState(userName);
  const [adopterEmail, setAdopterEmail] = useState(userEmail);
  const [adopterPhone, setAdopterPhone] = useState("");
  const [selectedExpId, setSelectedExpId] = useState<string>(preselectedExperience?.id || "");
  const [reserveName, setReserveName] = useState("Flagship Living Forest — Wayanad, Kerala");
  const [visitDate, setVisitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [selectedTrees, setSelectedTrees] = useState<string[]>(
    userTrees.slice(0, 3).map((t) => t.treeTag)
  );
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTree = (tag: string) => {
    if (selectedTrees.includes(tag)) {
      setSelectedTrees(selectedTrees.filter((t) => t !== tag));
    } else {
      setSelectedTrees([...selectedTrees, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adopterName.trim() || !adopterEmail.trim() || !visitDate) {
      setError("Please fill in your name, email, and preferred visit date.");
      return;
    }

    const phoneValidation = validatePhoneNumber(adopterPhone, false);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.error || "Please enter a valid mobile number.");
      return;
    }

    const matchedExp = experiences.find((exp) => exp.id === selectedExpId);

    const payload: CreateVisitBookingPayload = {
      adopterName: adopterName.trim(),
      adopterEmail: adopterEmail.trim(),
      adopterPhone: adopterPhone.trim(),
      experienceId: selectedExpId || undefined,
      experienceTitle: matchedExp ? matchedExp.title : "General Plantation & Living Forest Visit",
      reserveName,
      visitDate,
      timeSlot,
      numberOfGuests,
      associatedTrees: selectedTrees,
      specialRequests: specialRequests.trim(),
    };

    try {
      setIsSubmitting(true);
      setError(null);
      await visitService.book(payload);
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to schedule visit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#d4e9dd]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#eaf2ec] sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-xl bg-emerald-50 border border-emerald-100">🌿</span>
            <div>
              <h2 className="text-xl font-bold text-[#173324]" style={{ fontFamily: "var(--font-display)" }}>
                Book Your Plantation Visit
              </h2>
              <p className="text-xs text-[#52796f]">04 They Visit • Meet your trees and explore the living ecosystem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
              ⚠️ {error}
            </div>
          )}

          {/* Experience Picker */}
          <div>
            <label className="block text-xs font-semibold text-[#173324] uppercase tracking-wider mb-2">
              Choose Experience / Tour Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedExpId("")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  !selectedExpId
                    ? "border-[#2d6a4f] bg-emerald-50/70 text-[#173324] font-medium ring-1 ring-[#2d6a4f]"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="text-sm font-semibold flex items-center justify-between">
                  <span>🌲 General Plantation Visit</span>
                  <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">Free</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Guided arborist walk to locate your adopted trees.</div>
              </button>

              {experiences.map((exp) => (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => setSelectedExpId(exp.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedExpId === exp.id
                      ? "border-[#2d6a4f] bg-emerald-50/70 text-[#173324] font-medium ring-1 ring-[#2d6a4f]"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="text-sm font-semibold flex items-center justify-between">
                    <span className="truncate pr-2">{exp.title}</span>
                    <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                      {exp.price === 0 ? "Free" : `₹${exp.price.toLocaleString("en-IN")}`}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-1">{exp.tagline || exp.duration}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Reserve & Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#173324] uppercase tracking-wider mb-1.5">
                Plantation Destination
              </label>
              <Select
                value={reserveName}
                onChange={(e) => setReserveName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] bg-white"
              >
                <option value="Flagship Living Forest — Wayanad, Kerala">Flagship Living Forest — Wayanad, Kerala (30 Acres)</option>
                <option value="Western Ghats Ecological Reserve, Maharashtra">Western Ghats Reserve, Maharashtra</option>
                <option value="Satara Agroforestry Belt, Maharashtra">Satara Agroforestry Belt, Maharashtra</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173324] uppercase tracking-wider mb-1.5">
                Preferred Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f]"
              />
            </div>
          </div>

          {/* Time Slot & Guests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#173324] uppercase tracking-wider mb-1.5">
                Time Slot
              </label>
              <Select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] bg-white"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173324] uppercase tracking-wider mb-1.5">
                Number of Guests
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNumberOfGuests(Math.max(1, numberOfGuests - 1))}
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 flex items-center justify-center cursor-pointer"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-[#173324] text-base">{numberOfGuests}</span>
                <button
                  type="button"
                  onClick={() => setNumberOfGuests(Math.min(10, numberOfGuests + 1))}
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
                <span className="text-xs text-gray-500">Guests included</span>
              </div>
            </div>
          </div>

          {/* Select Adopted Trees to Visit */}
          {userTrees.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#173324] uppercase tracking-wider mb-1.5">
                Select Your Adopted Trees to Inspect in Person
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Our arborists will map your walking trail directly to these GPS tags so you can touch and measure them!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-[#f9fbf9] rounded-xl border border-emerald-100">
                {userTrees.map((tree) => {
                  const isChecked = selectedTrees.includes(tree.treeTag);
                  return (
                    <div
                      key={tree.id || tree.treeTag}
                      onClick={() => toggleTree(tree.treeTag)}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                        isChecked ? "bg-emerald-100/80 border border-emerald-300" : "bg-white border border-gray-200 hover:border-emerald-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded text-[#2d6a4f] focus:ring-[#2d6a4f]"
                      />
                      <div className="text-xs truncate">
                        <span className="font-semibold text-[#173324]">{tree.treeTag}</span>
                        <span className="text-gray-500 ml-1">({tree.treeVarietyName || "Indigenous Tree"})</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#173324] uppercase tracking-wider mb-1">
                Adopter Name
              </label>
              <input
                type="text"
                required
                value={adopterName}
                onChange={(e) => setAdopterName(e.target.value)}
                placeholder="Full name"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#173324] uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={adopterEmail}
                onChange={(e) => setAdopterEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#173324] uppercase tracking-wider mb-1">
                Mobile Number
              </label>
              <PhoneInput
                id="visit-mobile-phone"
                value={adopterPhone}
                onChange={setAdopterPhone}
                size="sm"
              />
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-xs font-semibold text-[#173324] uppercase tracking-wider mb-1">
              Special Requests or Dietary Requirements (Optional)
            </label>
            <input
              type="text"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. Bringing children, vegetarian farm lunch, mobility assistance..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2d6a4f]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Generating Visitor Pass..." : "Confirm & Generate Pass 🎫"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
