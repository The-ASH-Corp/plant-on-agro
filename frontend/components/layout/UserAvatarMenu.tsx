"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth";

export interface UserAvatarMenuProps {
  user: User;
  onLogout: () => void;
  openPlant?: () => void;
}

export function UserAvatarMenu({ user, onLogout, openPlant }: UserAvatarMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const isAdmin = user.role === "admin";
  const dashboardHref = isAdmin ? "/admin" : "/buyer/dashboard";
  const dashboardLabel = isAdmin ? "Admin Dashboard" : "Buyer Dashboard";
  const dashboardDesc = isAdmin ? "Operations & CMS Controls" : "My Trees, GPS & Certificates";
  const dashboardIcon = isAdmin ? "🛡️" : "🌿";

  // Initials for avatar
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const handleDashboardClick = () => {
    setIsOpen(false);
    router.push(dashboardHref);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
    router.push("/");
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Avatar Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2.5 p-1 rounded-full hover:bg-white/10 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#52b788]/60"
        title={`${user.name} (${isAdmin ? "Admin" : "Buyer"}) - Click for Dashboard & Options`}
      >
        <div className="relative">
          {/* Avatar circle */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1b7a43] via-[#2d6a4f] to-[#52b788] text-white font-bold text-sm flex items-center justify-center shadow-md ring-2 ring-[#52b788]/40 hover:ring-[#52b788] transition-all">
            {initials}
          </div>

          {/* Active online status badge */}
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#173324] ring-1 ring-white/20"
            title="Online"
          />
        </div>

        {/* Small chevron */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3.5 h-3.5 text-white/70 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-white" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2.5 w-72 rounded-2xl bg-white shadow-2xl border border-[#cfe1d7] py-2 z-50 animate-fade-in origin-top-right text-left overflow-hidden"
          style={{
            boxShadow: "0 20px 40px -15px rgba(23, 51, 36, 0.25), 0 0 0 1px rgba(82, 183, 136, 0.15)",
          }}
        >
          {/* User Profile Header Card */}
          <div className="px-4 py-3 bg-gradient-to-br from-[#f2f8f4] to-[#e6f4ec] border-b border-[#dbece1] flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#1b7a43] to-[#52b788] text-white font-bold text-base flex items-center justify-center shrink-0 shadow-sm ring-2 ring-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="text-xs font-bold text-[#173324] truncate">{user.name}</p>
                {isAdmin ? (
                  <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    Admin
                  </span>
                ) : (
                  <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Buyer
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#52796f] truncate">{user.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="py-1 px-1.5 space-y-0.5">
            {/* Direct Dashboard Redirection Option */}
            <button
              onClick={handleDashboardClick}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-[#eef7f2] transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#e2f3e9] group-hover:bg-[#d0edd9] text-[#1b7a43] flex items-center justify-center text-base transition-colors shrink-0">
                {dashboardIcon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#173324] group-hover:text-[#1b7a43]">
                    {dashboardLabel}
                  </span>
                  <span className="text-[10px] text-[#1b7a43] opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                    Go →
                  </span>
                </div>
                <p className="text-[10px] text-[#52796f] truncate">{dashboardDesc}</p>
              </div>
            </button>

            {/* If Buyer and openPlant is provided */}
            {!isAdmin && openPlant && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  openPlant();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-[#eef7f2] transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#e2f3e9] group-hover:bg-[#d0edd9] text-[#1b7a43] flex items-center justify-center text-base transition-colors shrink-0">
                  🌱
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-[#173324] group-hover:text-[#1b7a43] block">
                    Plant Another Tree
                  </span>
                  <p className="text-[10px] text-[#52796f] truncate">Choose an adoption plan</p>
                </div>
              </button>
            )}
          </div>

          {/* Logout Section */}
          <div className="pt-1 mt-1 border-t border-[#e8f1eb] px-1.5">
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-red-50 text-red-600 transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100/70 group-hover:bg-red-100 text-red-600 flex items-center justify-center text-sm transition-colors shrink-0">
                🚪
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold block">Sign Out</span>
                <p className="text-[10px] text-red-500/80 truncate">Log out of your account</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
