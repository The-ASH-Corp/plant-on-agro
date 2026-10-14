"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/Screenshot_From_2026-09-17_15-39-39-removebg-preview.png";
import { AdminTabType } from "./types";

interface AdminHeaderProps {
  onOpenSidebar: () => void;
  activeTab: AdminTabType;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAddTree: () => void;
}

const TAB_META: Record<AdminTabType, { label: string; icon: string }> = {
  overview: { label: "Overview", icon: "📊" },
  trees: { label: "Tree Varieties", icon: "🌳" },
  plans: { label: "Adoption Plans", icon: "🌱" },
  locations: { label: "Reserves & GPS", icon: "📍" },
  orders: { label: "Adoption Orders", icon: "📦" },
};

export function AdminHeader({
  onOpenSidebar,
  activeTab,
  searchQuery,
  setSearchQuery,
  onOpenAddTree,
}: AdminHeaderProps) {
  const currentTab = TAB_META[activeTab];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#e5ebe7] px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl border border-[#e5ebe7] text-[#1c2e24] text-lg hover:bg-[#f4f7f5] cursor-pointer"
          aria-label="Open sidebar"
        >
          ☰
        </button>

        {/* Landing page logo icon in dashboard navbar */}
        <Link
          href="/"
          className="flex items-center gap-2 group px-2.5 py-1 rounded-xl bg-[#173324] hover:bg-[#1b432e] border border-[#2d6a4f]/40 shadow-xs transition-all"
          title="Return to PlantOn Agro Landing Page"
        >
          <Image
            src={Logo}
            alt="PlantOn Agro Logo"
            width={140}
            height={45}
            priority
            className="w-auto h-7 sm:h-8 object-contain"
          />
        </Link>
        <span className="text-[#cbd5ce] hidden sm:inline">/</span>
        <span className="font-bold text-[#173324] capitalize flex items-center gap-1.5 text-xs sm:text-sm">
          <span>{currentTab.icon}</span>
          <span>{currentTab.label}</span>
        </span>
      </div>

      {/* Quick Search & Actions */}
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog, orders, reserves..."
            className="w-64 lg:w-80 pl-9 pr-10 py-1.5 text-xs rounded-xl border border-[#e2eae5] bg-[#f9faf8] text-[#173324] placeholder-[#8a9990] outline-none focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] transition-all"
          />
          <span className="absolute left-3 top-2 text-xs text-[#8a9990]">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1.5 text-xs text-[#8a9990] hover:text-[#173324] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddTree}
            className="flex items-center gap-1.5 bg-[#173324] hover:bg-[#1f4230] text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <span>+</span>
            <span className="hidden sm:inline">New Species</span>
          </button>

          <Link
            href="/"
            className="hidden sm:flex items-center gap-1 text-xs font-medium text-[#1b7a43] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors"
          >
            <span>🏪</span>
            <span>Live Storefront</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
