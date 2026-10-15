"use client";

import { AdminTabType } from "./types";

interface AdminHeaderProps {
  onOpenSidebar: () => void;
  activeTab: AdminTabType;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const TAB_META: Record<AdminTabType, { label: string }> = {
  overview: { label: "Overview" },
  trees: { label: "Tree Varieties" },
  plans: { label: "Adoption Plans" },
  instances: { label: "Tree Instances" },
  locations: { label: "Reserves & GPS" },
  orders: { label: "Adoption Orders" },
  "landing-page": { label: "Landing Page CMS" },
};

export function AdminHeader({
  onOpenSidebar,
  activeTab,
  searchQuery,
  setSearchQuery,
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

        <span className="font-bold text-[#173324] capitalize text-sm sm:text-base">
          {currentTab.label}
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
      </div>
    </header>
  );
}
