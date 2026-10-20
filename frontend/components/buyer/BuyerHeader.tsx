"use client";

import Link from "next/link";
import { User } from "@/types/auth";
import { UserAvatarMenu } from "@/components/layout";
import { BuyerDashboardTab } from "./types";

interface BuyerHeaderProps {
  user?: User | null;
  activeTab: BuyerDashboardTab;
  onLogout: () => void;
  onOpenPlantFlow: () => void;
  onToggleSidebar: () => void;
}

const TAB_TITLES: Record<BuyerDashboardTab, { title: string; subtitle: string; icon: string }> = {
  trees: {
    title: "My Living Forest",
    subtitle: "Verified growth monitoring, arborist care & satellite GPS coordinates",
    icon: "🌲",
  },
  certificates: {
    title: "Official Deeds Registry",
    subtitle: "Permanent cryptographic certificates & legal afforestation proof",
    icon: "📜",
  },
  impact: {
    title: "Carbon Sequestration & Impact",
    subtitle: "Scientific telemetry, water recharge & biodiversity metrics",
    icon: "📊",
  },
  orders: {
    title: "Adoption Orders & Invoices",
    subtitle: "Verified payment history, tax receipts & transaction ledger",
    icon: "📦",
  },
};

export function BuyerHeader({
  user,
  activeTab,
  onLogout,
  onOpenPlantFlow,
  onToggleSidebar,
}: BuyerHeaderProps) {
  const currentTabInfo = TAB_TITLES[activeTab] || TAB_TITLES.trees;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-[#e2eae5] text-[#173324] shadow-xs transition-all">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Sidebar Trigger & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden w-9 h-9 rounded-xl bg-[#f4f7f5] hover:bg-emerald-50 text-[#173324] border border-[#d2ded7] flex items-center justify-center text-base cursor-pointer transition-colors"
            aria-label="Toggle Navigation Sidebar"
          >
            ☰
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">{currentTabInfo.icon}</span>
              <h1 className="text-base sm:text-lg font-bold text-[#173324] leading-tight font-serif">
                {currentTabInfo.title}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-[#52796f]">
              {currentTabInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl text-[#52796f] hover:text-[#173324] hover:bg-[#f4f7f5] transition-colors"
          >
            <span>←</span>
            <span>Storefront</span>
          </Link>

          {/* Plant a Tree CTA */}
          <button
            onClick={onOpenPlantFlow}
            className="text-xs font-bold px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#1b7a43] via-[#2d6a4f] to-[#52b788] text-white hover:scale-105 active:scale-95 transition-all shadow-sm shadow-emerald-950/30 hover:shadow-emerald-500/25 cursor-pointer flex items-center gap-1.5 border border-emerald-400/30"
          >
            <span>🌱</span>
            <span className="hidden sm:inline">Plant a Tree</span>
            <span className="sm:hidden">Plant</span>
          </button>

          {/* User Avatar Menu Dropdown */}
          {user && (
            <UserAvatarMenu
              user={user}
              onLogout={onLogout}
              openPlant={onOpenPlantFlow}
            />
          )}
        </div>
      </div>
    </header>
  );
}
