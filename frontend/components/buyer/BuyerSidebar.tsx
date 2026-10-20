"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/Screenshot_From_2026-09-17_15-39-39-removebg-preview.png";
import { User } from "@/types/auth";
import { BuyerDashboardTab } from "./types";

interface NavItemDef {
  id: BuyerDashboardTab;
  label: string;
  icon: string;
  count?: number;
  badge?: string;
  desc: string;
}

interface BuyerSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: BuyerDashboardTab;
  setActiveTab: (tab: BuyerDashboardTab) => void;
  totalTrees: number;
  certificatesCount: number;
  ordersCount: number;
  user?: User | null;
  onLogout: () => void;
  onOpenPlantFlow: () => void;
}

export function BuyerSidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  totalTrees,
  certificatesCount,
  ordersCount,
  user,
  onLogout,
  onOpenPlantFlow,
}: BuyerSidebarProps) {
  const navItems: NavItemDef[] = [
    {
      id: "trees",
      label: "My Forest",
      icon: "🌲",
      count: totalTrees,
      desc: "Living specimens & GPS",
    },
    {
      id: "certificates",
      label: "Official Deeds",
      icon: "📜",
      count: certificatesCount,
      desc: "Certified ownership",
    },
    {
      id: "impact",
      label: "Carbon & Impact",
      icon: "📊",
      badge: "Live",
      desc: "Scientific telemetry",
    },
    {
      id: "orders",
      label: "Orders & Invoices",
      icon: "📦",
      count: ordersCount,
      desc: "Receipts & ledger",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#081810] via-[#0d261a] to-[#06120b] text-white flex flex-col justify-between border-r border-emerald-900/40 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto scrollbar-none">
          {/* Header Brand */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src={Logo}
                alt="PlantOn Agro Logo"
                width={180}
                height={180}
                priority
                className="w-auto h-10 object-contain drop-shadow"
              />
              <span className="text-[10px] px-2 py-0.5 rounded font-mono uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Portal
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

          {/* User Profile Card */}
          <div className="p-4 mx-4 mt-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-emerald-950/40 border border-white/20 shrink-0">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {user?.name || "Tree Adopter"}
                </p>
                <p className="text-[10px] text-emerald-400/90 font-mono truncate">
                  {user?.email || "verified@plantonagro.com"}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                    Eco Guardian
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Plant CTA */}
          <div className="px-4 mt-4">
            <button
              onClick={() => {
                onOpenPlantFlow();
                setSidebarOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-[#1b7a43] via-[#2d6a4f] to-[#52b788] text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/30"
            >
              <span className="text-sm">🌱</span>
              <span>Adopt Another Tree</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/70 px-3 mb-2 font-mono">
              Command Modules
            </p>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500/25 to-emerald-500/10 text-white font-bold border border-emerald-500/40 shadow-sm shadow-emerald-950/40"
                      : "text-white/70 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <div className="text-left">
                      <span className="block leading-tight">{item.label}</span>
                      <span className="text-[10px] text-white/40 block font-normal">
                        {item.desc}
                      </span>
                    </div>
                  </div>

                  {typeof item.count === "number" && (
                    <span
                      className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-emerald-400 text-emerald-950"
                          : "bg-white/10 text-white/80"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}

                  {item.badge && !item.count && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Footer Actions */}
          <div className="p-4 pb-8 border-t border-white/10 space-y-2">
            <Link
              href="/"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span>←</span>
              <span>Back to Storefront</span>
            </Link>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
