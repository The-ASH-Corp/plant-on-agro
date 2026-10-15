"use client";

import { useEffect } from "react";
import { TrashIcon } from "@/components/ui/TrashIcon";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  itemType?: string;
  itemName?: string;
  description?: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmationModal({
  isOpen,
  title,
  itemType = "Item",
  itemName,
  description,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  const modalTitle = title || `Delete ${itemType}`;
  const modalDescription =
    description ||
    `Are you sure you want to permanently delete this ${itemType.toLowerCase()}? This action cannot be reversed.`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 relative animate-fadeIn text-center">
        {/* Close "✕" Button */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#7a8a80] hover:text-[#173324] hover:bg-[#f0f4f1] transition-colors cursor-pointer disabled:opacity-40"
          aria-label="Close dialog"
        >
          ✕
        </button>

        {/* Warning Trash Icon Header */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <TrashIcon className="w-8 h-8" />
        </div>

        {/* Title */}
        <h3
          id="delete-dialog-title"
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-bold text-[#173324] mb-2"
        >
          {modalTitle}
        </h3>

        {/* Description */}
        <p className="text-xs text-[#5c7064] mb-5 leading-relaxed">
          {modalDescription}
        </p>

        {/* Item Identification Card */}
        {itemName && (
          <div className="mb-6 p-3.5 rounded-2xl bg-[#fff7f7] border border-rose-200/80 text-left flex items-center gap-3">
            <span className="text-xl shrink-0">⚠️</span>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                Target {itemType}
              </span>
              <span className="text-sm font-bold text-[#173324] truncate block">
                {itemName}
              </span>
            </div>
          </div>
        )}

        {/* Confirmation Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Cancel button: Does NOT delete */}
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="py-3 px-4 rounded-xl border border-[#d8e2dc] text-[#4a5e52] hover:bg-[#f2f6f4] hover:text-[#173324] text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
          >
            Cancel
          </button>

          {/* Delete button: Only clicking this triggers the deletion */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <TrashIcon className="w-4 h-4" />
                <span>Yes, Delete</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
