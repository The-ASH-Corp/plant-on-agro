"use client";

import { useEffect, useState } from "react";
import { isMissingProductionApiUrl } from "@/services/api/api-client";


export function ProductionEnvWarning() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (isMissingProductionApiUrl()) {
      setShowWarning(true);
    }
  }, []);

  if (!showWarning) return null;

  return (
    <div
      role="alert"
      className="sticky top-0 z-[9999] bg-rose-600 text-white px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-lg"
    >
      <div className="flex items-center gap-2 max-w-7xl mx-auto flex-1">
        <span className="text-base sm:text-lg shrink-0">⚠️</span>
        <span className="leading-snug">
          <strong>Configuration Error:</strong> The production backend API URL (
          <code className="bg-rose-800/90 px-1.5 py-0.5 rounded text-[11px] font-mono">
            NEXT_PUBLIC_API_URL
          </code>
          ) is not set in this environment. API requests will fail until it is configured in your hosting provider settings.
        </span>
      </div>
      <button
        onClick={() => setShowWarning(false)}
        className="shrink-0 p-1 hover:bg-rose-700 rounded-md transition-colors text-white/90 cursor-pointer"
        aria-label="Dismiss warning"
      >
        ✕
      </button>
    </div>
  );
}
