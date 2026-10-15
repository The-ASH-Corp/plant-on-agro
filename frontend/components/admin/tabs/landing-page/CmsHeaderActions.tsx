"use client";

import { CmsHeaderActionsProps } from "./types";

export function CmsHeaderActions({
  hasUnsavedChanges,
  saving,
  resetting,
  onSave,
  onReset,
  onDiscard,
  onOpenPreview,
}: CmsHeaderActionsProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e2eae5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-xl font-bold text-[#173324]">Landing Page Content Manager</h2>
          {hasUnsavedChanges ? (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 border border-amber-300 flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Unsaved Changes
            </span>
          ) : (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live & Synced
            </span>
          )}
        </div>
        <p className="text-xs text-[#52796f]">
          Turn sections on or off, edit copy, manage live metrics, and configure certificate details across the storefront.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={onOpenPreview}
          className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#cfe1d7] text-[#2d6a4f] bg-[#f4faf6] hover:bg-[#e6f4ed] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>👁️</span> Live Preview
        </button>

        {hasUnsavedChanges && (
          <button
            onClick={onDiscard}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#e2eae5] text-[#52796f] hover:text-[#173324] hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Discard
          </button>
        )}

        <button
          onClick={onReset}
          disabled={resetting}
          className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          {resetting ? "Resetting..." : "Restore Defaults"}
        </button>

        <button
          onClick={onSave}
          disabled={saving || !hasUnsavedChanges}
          className={`px-5 py-2 text-xs font-bold rounded-xl text-white shadow-md transition-all cursor-pointer flex items-center gap-2 ${
            hasUnsavedChanges
              ? "bg-gradient-to-r from-[#1b7a43] to-[#2d6a4f] hover:scale-[1.02] shadow-emerald-900/20"
              : "bg-gray-400 opacity-60 cursor-not-allowed"
          }`}
        >
          {saving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>Publish Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
