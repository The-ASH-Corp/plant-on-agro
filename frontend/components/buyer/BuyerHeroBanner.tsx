"use client";

import { User } from "@/types/auth";
import { BuyerDashboardTab } from "./types";

interface BuyerHeroBannerProps {
  user?: User | null;
  totalTrees: number;
  ordersCount?: number;
  onOpenPlantFlow: () => void;
  onSelectTab: (tab: BuyerDashboardTab) => void;
}

export function BuyerHeroBanner({
  user,
  totalTrees,
  ordersCount = 0,
  onOpenPlantFlow,
  onSelectTab,
}: BuyerHeroBannerProps) {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c2417] via-[#143926] to-[#081810] text-white p-5 sm:p-6 md:p-7 border border-emerald-500/25 shadow-xl">
      {/* Decorative ambient light orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Grid overlay for tech look */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Column: Greeting & Title */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Verified Tree Adopter</span>
            </span>

            {ordersCount > 0 && (
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/30">
                📦 {ordersCount} Verified Orders
              </span>
            )}
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight leading-snug">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-emerald-200 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                {user?.name || "Tree Planter"}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-white/75 mt-1 leading-relaxed max-w-xl font-light">
              Your living environmental legacy is nurtured and protected by verified field arborists. Inspect verified GPS coordinates, health logs, and legal plantation deeds.
            </p>
          </div>

          {/* Clean Forest Summary Card */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md max-w-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌳</span>
              <div>
                <span className="text-[11px] text-white/60 uppercase font-semibold block">Active Living Trees</span>
                <span className="text-sm font-bold text-white">
                  {totalTrees} {totalTrees === 1 ? "Tree Planted" : "Trees Planted & Geotagged"}
                </span>
              </div>
            </div>
            <button
              onClick={() => onSelectTab("trees")}
              className="text-xs text-emerald-300 hover:text-emerald-200 font-semibold cursor-pointer underline"
            >
              View Trees →
            </button>
          </div>
        </div>

        {/* Right Column: Fast Action Hub */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
          <button
            onClick={onOpenPlantFlow}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#1b7a43] to-[#52b788] text-white hover:scale-105 transition-all shadow-md shadow-emerald-950/50 hover:shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/30"
          >
            <span>🌱</span>
            <span>Adopt Another Tree</span>
          </button>

          <button
            onClick={() => onSelectTab("certificates")}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
          >
            <span>📜</span>
            <span>Official Certificates</span>
          </button>

          <button
            onClick={() => onSelectTab("orders")}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
          >
            <span>📦</span>
            <span>Orders & Tax Invoices</span>
          </button>

          <button
            onClick={() => onSelectTab("impact")}
            className="px-4 py-1.5 rounded-lg text-xs font-medium text-emerald-300 hover:text-white hover:bg-emerald-500/10 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>📊</span>
            <span>View CO₂ Sequestration Graph →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
