"use client";

import { useState, useEffect } from "react";
import { waitlistService } from "@/services/waitlist/waitlist.service";

interface JoinWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

export function JoinWaitlistModal({
  isOpen,
  onClose,
  source = "adoption_packages_section",
}: JoinWaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPhoneNumber("");
      setName("");
      setError(null);
      setIsSuccess(false);
      setSuccessMessage("");
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    const cleanPhone = phoneNumber.trim();

    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError("Please provide a valid email address.");
      return;
    }

    if (!cleanPhone || cleanPhone.replace(/\D/g, "").length < 7) {
      setError("Please enter a valid phone number (at least 7 digits).");
      return;
    }

    try {
      setLoading(true);
      const res = await waitlistService.joinWaitlist({
        email: cleanEmail,
        phoneNumber: cleanPhone,
        name: name.trim() || undefined,
        source,
      });

      setIsSuccess(true);
      setSuccessMessage(
        res.message ||
          "🎉 You're on the waitlist! We will notify you directly via phone and email as soon as adoption packages open."
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to register for waitlist. Please check your network and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-[#e2eae5] shadow-2xl p-6 sm:p-8 z-10 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#1b7a43] text-3xl flex items-center justify-center mx-auto shadow-sm">
              ✓
            </div>
            <h3
              style={{ fontFamily: "var(--font-display)" }}
              className="text-2xl sm:text-3xl font-bold text-[#173324]"
            >
              You&apos;re on the Priority List!
            </h3>
            <p className="text-sm text-[#4a6557] leading-relaxed max-w-md mx-auto">
              {successMessage}
            </p>
            <div className="pt-2 p-3.5 rounded-2xl bg-[#f4f8f5] border border-emerald-100 text-xs text-[#2d6a4f] font-mono">
              Registered Phone: <strong>{phoneNumber}</strong>
              <br />
              Registered Email: <strong>{email}</strong>
            </div>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-[#1b7a43] hover:bg-[#155d34] shadow-md transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-[#2d6a4f] text-xs font-bold uppercase tracking-wider border border-emerald-200">
                <span>✨ Priority Waitlist</span>
              </div>
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="text-2xl sm:text-3xl font-bold text-[#173324] leading-tight"
              >
                Join the Exclusive Waitlist
              </h3>
              <p className="text-xs sm:text-sm text-[#4a6557] leading-relaxed">
                Be the first to access our verified agroforestry allocations, ground GPS deeds, and private adopter groves when packages unlock.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <span className="font-bold">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#173324] mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    📞
                  </span>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-2 focus:ring-[#1b7a43]/20 text-sm font-medium outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  We will send allocation SMS / WhatsApp notifications here.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173324] mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    ✉️
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-2 focus:ring-[#1b7a43]/20 text-sm font-medium outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Your digital reservation invitation will be sent here.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173324] mb-1.5">
                  Your Name <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    👤
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-2 focus:ring-[#1b7a43]/20 text-sm font-medium outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#1b7a43] to-[#2d6a4f] hover:from-[#155d34] hover:to-[#22533e] shadow-lg shadow-emerald-900/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Securing your spot...</span>
                    </>
                  ) : (
                    <>
                      <span>✨ Join in Waitlist</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <span className="text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
                  <span>🔒</span>
                  <span>Zero spam. Strict arborist & plantation privacy guarantee.</span>
                </span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

