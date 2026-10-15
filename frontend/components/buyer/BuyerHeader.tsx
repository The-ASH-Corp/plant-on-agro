"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/Screenshot_From_2026-09-17_15-39-39-removebg-preview.png";
import { User } from "@/types/auth";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";

interface BuyerHeaderProps {
  user?: User | null;
  onLogout: () => void;
  onOpenPlantFlow: () => void;
}

export function BuyerHeader({ user, onLogout, onOpenPlantFlow }: BuyerHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#0b1e13]/90 backdrop-blur-xl border-b border-emerald-500/20 text-white shadow-xl transition-all">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Portal Badge */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <Image
              src={Logo}
              alt="PlantOn Agro Logo"
              width={160}
              height={160}
              className="w-auto h-9 sm:h-11 object-contain drop-shadow"
              priority
            />
          </Link>

          <span className="hidden sm:inline-block h-5 w-px bg-white/15" />

          <div className="hidden sm:flex items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
              Adopter Portal
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Telemetry
            </span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span>←</span>
            <span>Storefront</span>
          </Link>

          {/* Adopt Tree CTA */}
          <button
            onClick={onOpenPlantFlow}
            className="text-xs font-bold px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-[#1b7a43] via-[#2d6a4f] to-[#52b788] text-white hover:scale-105 transition-all shadow-lg shadow-emerald-950/40 hover:shadow-emerald-500/25 cursor-pointer flex items-center gap-2 border border-emerald-400/30"
          >
            <span className="text-sm">🌱</span>
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
