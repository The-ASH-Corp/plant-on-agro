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
  treesCount?: number;
  plansCount: number;
  instancesCount?: number;
  locationsCount: number;
  ordersCount: number;
  unreadOrdersCount?: number;
  certificatesCount?: number;
  usersCount?: number;
  waitlistCount?: number;
  userName?: string;
  onLogout: () => void;
  onOpenAddTree?: () => void;
  onOpenAddPlan: () => void;
  onOpenAddLocation: () => void;
  onOpenAddInstance?: () => void;
  onOpenIssueCertificate?: () => void;
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
  unreadOrdersCount = 0,
  certificatesCount = 0,
  usersCount,
  waitlistCount = 0,
  userName = "Admin User",
  onLogout,
  onOpenAddTree,
  onOpenAddPlan,
  onOpenAddLocation,
  onOpenAddInstance,
  onOpenIssueCertificate,
}: AdminSidebarProps) {
  const navItems: NavItemDef[] = [
    { id: "overview", label: "Overview", icon: "📊", badge: "Live" },
    { id: "plans", label: "Adoption Plans", icon: "🌱", count: plansCount },
    { id: "instances", label: "Tree Instances", icon: "🏷️", count: instancesCount },
    { id: "locations", label: "Reserves & GPS", icon: "📍", count: locationsCount },
    {
      id: "orders",
      label: "Adoption Orders",
      icon: "📦",
      count: ordersCount,
      badge: unreadOrdersCount > 0 ? `${unreadOrdersCount} New` : undefined,
    },
    { id: "certificates", label: "Certificates", icon: "📜", count: certificatesCount },
    { id: "visits", label: "Visits & Tours", icon: "🗺️", badge: "04 They Visit" },
    { id: "users", label: "All Users", icon: "👥", count: usersCount },
    { id: "waitlist", label: "Waitlist Leads", icon: "📋", count: waitlistCount },
    { id: "landing-page", label: "Landing Page CMS", icon: "🎨", badge: "Editor" },
  ];


  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 3xl:w-80 4k:w-96 max-w-[85vw] bg-linear-to-b from-[#0a1c12] via-[#0f291a] to-[#07140c] text-white flex flex-col justify-between border-r border-emerald-900/40 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="p-4 sm:p-5 3xl:p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src={Logo}
                alt="PlantOn Agro Logo"
                width={200}
                height={200}
                priority
                className="w-auto h-10 sm:h-12 3xl:h-14 4k:h-16 object-contain"
              />
              <span className="text-[10px] 3xl:text-xs px-2 py-0.5 rounded font-mono uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
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
          <div className="px-3 3xl:px-4 py-4 3xl:py-6 flex-1 space-y-6 3xl:space-y-8">
            <div>
              <span className="text-[10px] 3xl:text-xs font-bold uppercase tracking-wider text-emerald-400/60 px-3 block mb-2">
                Operations Management
              </span>
              <nav className="space-y-1 3xl:space-y-1.5">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 3xl:px-4 py-2.5 3xl:py-3.5 4k:py-4 rounded-xl text-xs 3xl:text-sm 4k:text-base font-semibold transition-all duration-150 cursor-pointer text-left ${
                        isActive
                          ? "bg-linear-to-r from-[#1b7a43] to-leaf text-white shadow-lg shadow-emerald-900/50 border border-emerald-400/40 font-bold"
                          : "text-white/75 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base 3xl:text-lg 4k:text-xl">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {typeof item.count === "number" && (
                        <span
                          className={`text-[11px] 3xl:text-xs px-2 py-0.5 rounded-full font-mono ${
                            isActive ? "bg-white/20 text-white font-bold" : "bg-white/10 text-white/70"
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                      {item.badge && (
                        <span className="text-[9px] 3xl:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* User Profile Footer Card */}
          <div className="p-4 3xl:p-5 border-t border-white/10 bg-black/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 3xl:w-11 3xl:h-11 rounded-xl bg-linear-to-tr from-[#1b7a43] to-sage text-white flex items-center justify-center font-bold text-xs 3xl:text-sm shadow-inner border border-emerald-300/40">
                  AD
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs 3xl:text-sm font-bold text-white truncate max-w-30 3xl:max-w-37.5">{userName}</span>
                  <span className="text-[10px] 3xl:text-[11px] text-emerald-300/80 uppercase font-semibold">Super Administrator</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Link
                  href="/"
                  title="View Storefront"
                  className="p-1.5 3xl:p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors text-xs 3xl:text-sm"
                >
                  🏪
                </Link>
                <button
                  onClick={onLogout}
                  title="Sign out"
                  className="p-1.5 3xl:p-2 rounded-lg text-red-300 hover:text-red-200 hover:bg-white/10 transition-colors text-xs 3xl:text-sm cursor-pointer"
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
