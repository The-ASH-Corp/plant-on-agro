"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface SignOutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string | null;
  userEmail?: string | null;
  userRole?: "admin" | "buyer" | "user" | string | null;
}

export function SignOutConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  userEmail,
  userRole,
}: SignOutConfirmationModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const isAdmin = userRole === "admin";
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : isAdmin
    ? "AD"
    : "U";

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#0f2419]/65 backdrop-blur-xs transition-opacity animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signout-dialog-title"
    >
      <div className="bg-[#fcfdfb] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#cfe1d7] relative animate-fadeIn text-center overflow-hidden">
        {/* Top Botanical Gradient Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#173324] via-[#2d6a4f] to-[#52b788]" />

        {/* Close "✕" Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#7a8a80] hover:text-[#173324] hover:bg-[#eef7f2] transition-colors cursor-pointer"
          aria-label="Close sign out dialog"
        >
          ✕
        </button>

        {/* Botanical Sign Out Icon Header */}
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#eef7f2] to-[#dcf0e4] border border-[#b7dcc6] text-[#173324] flex items-center justify-center mx-auto mb-4 mt-1 shadow-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-7 h-7 text-[#1b7a43]"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#173324] text-white text-xs flex items-center justify-center shadow-xs border-2 border-white">
            🌿
          </span>
        </div>

        {/* Title */}
        <h3
          id="signout-dialog-title"
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-bold text-[#173324] mb-1.5"
        >
          Sign Out of PlantOn?
        </h3>

        {/* Description */}
        <p className="text-xs text-[#55695d] mb-5 leading-relaxed max-w-xs mx-auto">
          {isAdmin
            ? "You are about to end your administrator session. You can sign back in anytime to manage trees, orders, and plantation deeds."
            : "You are about to sign out of your account. Your living forest and adoption deeds remain safely synced."}
        </p>

        {/* Active Account Card */}
        {(userName || userEmail || userRole) && (
          <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-br from-[#f2f8f4] to-[#e6f4ec] border border-[#cfe1d7] text-left flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1b7a43] to-[#52b788] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs ring-2 ring-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-bold text-[#173324] truncate">
                  {userName || (isAdmin ? "Administrator" : "PlantOn Member")}
                </span>
                {isAdmin ? (
                  <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                    Admin
                  </span>
                ) : (
                  <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                    Buyer
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#52796f] truncate block">
                {userEmail || "Active authenticated session"}
              </span>
            </div>
          </div>
        )}

        {/* Confirmation Actions */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl border border-[#cfe1d7] bg-white text-[#173324] hover:bg-[#eef7f2] hover:border-[#52b788] text-xs font-bold transition-all cursor-pointer"
          >
            Stay Signed In
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#173324] via-[#1e4433] to-[#2d6a4f] hover:from-[#1f4230] hover:to-[#1b7a43] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Yes, Sign Out</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

