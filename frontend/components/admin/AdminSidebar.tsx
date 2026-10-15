"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/Screenshot_From_2026-09-17_15-39-39-removebg-preview.png";
import { AdminTabType } from "./types";

interface NavItemDef {
  id: AdminTabType;
  label: string;
  icon: string;
  count?: number;
  badge?: string;
}

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  treesCount: number;
  plansCount: number;
  instancesCount?: number;
  locationsCount: number;
  ordersCount: number;
  userName?: string;
  onLogout: () => void;
  onOpenAddTree: () => void;
  onOpenAddPlan: () => void;
  onOpenAddLocation: () => void;
  onOpenAddInstance?: () => void;
}

export function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  treesCount,
  plansCount,
  instancesCount = 0,
  locationsCount,
  ordersCount,
  userName = "Admin User",
  onLogout,
  onOpenAddTree,
  onOpenAddPlan,
  onOpenAddLocation,
  onOpenAddInstance,
}: AdminSidebarProps) {
  const navItems: NavItemDef[] = [
    { id: "overview", label: "Overview", icon: "📊", badge: "Live" },
    { id: "trees", label: "Tree Varieties", icon: "🌳", count: treesCount },
    { id: "plans", label: "Adoption Plans", icon: "🌱", count: plansCount },
    { id: "instances", label: "Tree Instances", icon: "🏷️", count: instancesCount },
    { id: "locations", label: "Reserves & GPS", icon: "📍", count: locationsCount },
    { id: "orders", label: "Adoption Orders", icon: "📦", count: ordersCount },
    { id: "landing-page", label: "Landing Page CMS", icon: "🎨", badge: "Editor" },
  ];

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#0a1c12] via-[#0f291a] to-[#07140c] text-white flex flex-col justify-between border-r border-emerald-900/40 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src={Logo}
                alt="PlantOn Agro Logo"
                width={200}
                height={200}
                priority
                className="w-auto h-10 sm:h-12 object-contain"
              />
              <span className="text-[10px] px-2 py-0.5 rounded font-mono uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Admin
              </span>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white p-1 text-lg cursor-pointer"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          {/* Navigation Section */}
          <div className="px-3 py-4 flex-1 space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 px-3 block mb-2">
                Operations Management
              </span>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left ${
                        isActive
                          ? "bg-gradient-to-r from-[#1b7a43] to-[#2d6a4f] text-white shadow-lg shadow-emerald-900/50 border border-emerald-400/40 font-bold"
                          : "text-white/75 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {typeof item.count === "number" && (
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                            isActive ? "bg-white/20 text-white font-bold" : "bg-white/10 text-white/70"
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                      {item.badge && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Actions in Sidebar */}
            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 px-3 block mb-2">
                Fast Configuration
              </span>
              <div className="space-y-1 px-1">
                <button
                  onClick={onOpenAddTree}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
                >
                  <span className="text-emerald-400">+</span> Add Tree Species
                </button>
                <button
                  onClick={onOpenAddPlan}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
                >
                  <span className="text-emerald-400">+</span> Add Adoption Plan
                </button>
                <button
                  onClick={onOpenAddLocation}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
                >
                  <span className="text-emerald-400">+</span> Geotag Reserve
                </button>
                {onOpenAddInstance && (
                  <button
                    onClick={onOpenAddInstance}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
                  >
                    <span className="text-emerald-400">+</span> Tag & Plant Sapling
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* User Profile Footer Card */}
          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1b7a43] to-[#52b788] text-white flex items-center justify-center font-bold text-xs shadow-inner border border-emerald-300/40">
                  AD
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white truncate max-w-[120px]">{userName}</span>
                  <span className="text-[10px] text-emerald-300/80 uppercase font-semibold">Super Administrator</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Link
                  href="/"
                  title="View Storefront"
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors text-xs"
                >
                  🏪
                </Link>
                <button
                  onClick={onLogout}
                  title="Sign out"
                  className="p-1.5 rounded-lg text-red-300 hover:text-red-200 hover:bg-white/10 transition-colors text-xs cursor-pointer"
                >
                  ⎋
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}
    </>
  );
}
