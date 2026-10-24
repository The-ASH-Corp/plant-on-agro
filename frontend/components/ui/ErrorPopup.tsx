"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ErrorPopupProps {
  title?: string;
  message: string | null;
  onClose: () => void;
  type?: "error" | "warning" | "success" | "info";
  duration?: number; // auto-dismiss in ms (default: 6000, 0 to disable)
}

export function ErrorPopup({
  title,
  message,
  onClose,
  type = "error",
  duration = 6000,
}: ErrorPopupProps) {
  useEffect(() => {
    if (!message || duration <= 0) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  const config = {
    error: {
      badgeBg: "bg-red-50",
      badgeBorder: "border-red-200",
      accentBar: "bg-red-600",
      defaultTitle: "Action Failed",
      icon: (
        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 7.5h.01"
          />
        </svg>
      ),
    },
    warning: {
      badgeBg: "bg-amber-50",
      badgeBorder: "border-amber-200",
      accentBar: "bg-amber-500",
      defaultTitle: "Attention Needed",
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    success: {
      badgeBg: "bg-emerald-50",
      badgeBorder: "border-emerald-200",
      accentBar: "bg-emerald-600",
      defaultTitle: "Success",
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    info: {
      badgeBg: "bg-blue-50",
      badgeBorder: "border-blue-200",
      accentBar: "bg-blue-600",
      defaultTitle: "Notice",
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      ),
    },
  }[type];

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key="error-popup-modal"
          initial={{ opacity: 0, y: -25, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-[9999] max-w-[92vw] sm:max-w-md w-full pointer-events-auto"
        >
          <div
            className={`relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md border ${config.badgeBorder} shadow-2xl p-4 sm:p-4.5 flex items-start gap-3.5`}
            style={{
              boxShadow:
                "0 20px 40px -15px rgba(23, 51, 36, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Left accent color bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${config.accentBar}`} />

            {/* Icon Bubble */}
            <div
              className={`shrink-0 w-10 h-10 rounded-xl ${config.badgeBg} border ${config.badgeBorder} flex items-center justify-center`}
            >
              {config.icon}
            </div>

            {/* Message Body */}
            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-sm font-bold text-[#173324] tracking-tight">
                {title || config.defaultTitle}
              </h4>
              <p className="text-xs sm:text-[13px] text-[#4d5e53] mt-0.5 leading-relaxed break-words">
                {message}
              </p>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[#7e8f84] hover:text-[#173324] hover:bg-black/5 transition-colors cursor-pointer text-sm font-semibold"
              aria-label="Close error popup"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
