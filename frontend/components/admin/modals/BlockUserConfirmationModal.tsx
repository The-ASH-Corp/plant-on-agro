"use client";

import { useEffect } from "react";
import { User } from "@/types/auth";

interface BlockUserConfirmationModalProps {
  isOpen: boolean;
  user: User | null;
  isProcessing?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export function BlockUserConfirmationModal({
  isOpen,
  user,
  isProcessing = false,
  onClose,
  onConfirm,
}: BlockUserConfirmationModalProps) {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen || !user) return null;

  // If user is currently active, action is to BLOCK.
  // If user is currently inactive (blocked), action is to UNBLOCK.
  const isBlocking = user.isActive !== false;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="block-user-dialog-title"
    >
      <div
        className={`bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border relative animate-fadeIn text-center ${
          isBlocking ? "border-rose-200" : "border-emerald-200"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#7a8a80] hover:text-[#173324] hover:bg-[#f0f4f1] transition-colors cursor-pointer disabled:opacity-40"
          aria-label="Close dialog"
        >
          ✕
        </button>

        {/* Dynamic Icon Header */}
        <div
          className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto mb-4 shadow-xs text-3xl ${
            isBlocking
              ? "bg-rose-50 border-rose-200 text-rose-600"
              : "bg-emerald-50 border-emerald-200 text-emerald-600"
          }`}
        >
          <span>{isBlocking ? "🚫" : "🔓"}</span>
        </div>

        {/* Modal Title */}
        <h3
          id="block-user-dialog-title"
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-bold text-[#173324] mb-2"
        >
          {isBlocking ? "Block User Account?" : "Unblock User Account?"}
        </h3>

        {/* Modal Description */}
        <p className="text-xs text-[#5c7064] mb-5 leading-relaxed">
          {isBlocking
            ? "Are you sure you want to block this user? While blocked, they will be strictly prevented from logging into their dashboard, making new tree adoptions, or modifying account details."
            : "Are you sure you want to unblock this user? This will restore their active authorization, allowing them to log in, view their adopted trees, and place new orders."}
        </p>

        {/* User Card */}
        <div
          className={`mb-6 p-4 rounded-2xl border text-left flex items-center gap-3.5 ${
            isBlocking
              ? "bg-rose-50/60 border-rose-200/80"
              : "bg-emerald-50/60 border-emerald-200/80"
          }`}
        >
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-xs ${
              isBlocking
                ? "bg-gradient-to-tr from-rose-600 to-rose-400"
                : "bg-gradient-to-tr from-emerald-600 to-emerald-400"
            }`}
          >
            {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 justify-between">
              <span className="text-sm font-bold text-[#173324] truncate block">
                {user.name}
              </span>
              <span
                className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${
                  isBlocking
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : "bg-rose-100 text-rose-800 border-rose-300"
                }`}
              >
                Currently {isBlocking ? "Active" : "Blocked"}
              </span>
            </div>
            <span className="text-xs text-[#62776c] truncate block mt-0.5">
              {user.email}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 justify-center">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-[#55695d] hover:bg-[#edf4f0] border border-[#d2ded7] transition-all cursor-pointer disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 ${
              isBlocking
                ? "bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800"
                : "bg-gradient-to-r from-[#173324] to-[#1b7a43] hover:from-[#132c1e] hover:to-[#176a3a]"
            }`}
          >
            {isProcessing ? (
              <span>Processing...</span>
            ) : isBlocking ? (
              <>
                <span>Confirm Block</span>
              </>
            ) : (
              <>
                <span>Confirm Unblock</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
