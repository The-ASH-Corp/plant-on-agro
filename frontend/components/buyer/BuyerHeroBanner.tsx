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
  const targetMilestone = 5;
  const progressPercent = Math.min(Math.round((totalTrees / targetMilestone) * 100), 100);

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

            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-300/30">
              🌿 Tier 1 • Carbon Guardian
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
              Your living environmental legacy is monitored 24/7. Inspect real-time drone telemetry, geotagged satellite coordinates, and legal plantation deed certificates.
            </p>
          </div>

          {/* Gamified Milestone Progress Bar */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md max-w-lg space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/80 font-medium">
                Milestone: <strong className="text-emerald-300">Carbon Neutral Hero</strong>
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {totalTrees} / {targetMilestone} Trees ({progressPercent}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#1b7a43] via-[#52b788] to-[#95d5b2] transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-white/50">
              Plant {Math.max(0, targetMilestone - totalTrees)} more trees to unlock the Gold Tier Adopter Certificate and commemorative seed pack.
            </p>
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
