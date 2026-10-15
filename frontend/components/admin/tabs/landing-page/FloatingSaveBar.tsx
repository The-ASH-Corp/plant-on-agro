"use client";

import { FloatingSaveBarProps } from "./types";

export function FloatingSaveBar({
  hasUnsavedChanges,
  saving,
  onDiscard,
  onSave,
}: FloatingSaveBarProps) {
  if (!hasUnsavedChanges) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 bg-[#173324]/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
        <span className="text-xs font-semibold">You have unpublished edits</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onDiscard}
          className="px-3 py-1.5 text-xs text-white/70 hover:text-white cursor-pointer"
        >
          Discard
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#1b7a43] to-[#52b788] text-white hover:scale-105 shadow-md cursor-pointer transition-transform disabled:opacity-50"
        >
          {saving ? "Publishing..." : "Publish Now"}
        </button>
      </div>
    </div>
  );
}
