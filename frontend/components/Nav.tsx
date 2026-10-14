"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Section } from "@/types";
import Image from "next/image";
import Logo from "../public/Screenshot_From_2026-09-17_15-39-39-removebg-preview.png";
import { useAuthStore } from "@/store/auth.store";
import { useHydratedStore } from "@/store/hooks/use-hydrated-store";

interface NavProps {
  active?: Section;
  setActive?: (s: Section) => void;
  openPlant?: () => void;
}

export function Nav({ active = "home", setActive, openPlant }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useHydratedStore(useAuthStore, (s) => s.user);
  const isAuthenticated = useHydratedStore(useAuthStore, (s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAuth =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forgot-password");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links: { label: string; id: Section; href: string }[] = [
    { label: "Home", id: "home", href: "/" },
    { label: "How It Works", id: "how-it-works", href: "/#how-it-works" },
    { label: "Our Trees", id: "trees", href: "/#trees" },
    { label: "Impact", id: "impact", href: "/#impact" },
  ];

  const handleLinkClick = (l: (typeof links)[0]) => {
    if (isHome && setActive) {
      setActive(l.id);
    }
  };

  const isNavSolid = scrolled || !isHome;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: isNavSolid ? "rgba(23,51,36,0.97)" : "transparent",
        backdropFilter: isNavSolid ? "blur(12px)" : "none",
        borderBottom: isNavSolid ? "1px solid rgba(82,183,136,0.15)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        {isHome && setActive ? (
          <button
            onClick={() => setActive("home")}
            className="flex items-center gap-2.5 group *:hover:cursor-pointer duration-200"
          >
            <Image
              src={Logo}
              alt="Logo"
              width={200}
              height={200}
              priority
              className="w-auto h-10 sm:h-12 md:h-14 object-contain"
            />
          </button>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-2.5 group *:hover:cursor-pointer duration-200"
          >
            <Image
              src={Logo}
              alt="Logo"
              width={200}
              height={200}
              priority
              className="w-auto h-10 sm:h-12 md:h-14 object-contain"
            />
          </Link>
        )}

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.id}>
              {isHome && setActive ? (
                <button
                  onClick={() => handleLinkClick(l)}
                  className="text-sm font-medium transition-colors duration-200"
                  style={{ color: active === l.id ? "#52b788" : "rgba(255,255,255,0.8)" }}
                >
                  {l.label}
                </button>
              ) : (
                <Link
                  href={l.href}
                  className="text-sm font-medium transition-colors duration-200 text-white/80 hover:text-[#52b788]"
                >
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2.5">
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>📊</span>
                  <span>Dashboard</span>
                </Link>
              )}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium border border-white/15">
                <span className="w-2 h-2 rounded-full bg-[#52b788] animate-pulse"></span>
                <span className="truncate max-w-[130px] font-semibold">{user.name}</span>
                {user.role === "admin" ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider bg-amber-500/25 text-amber-300 border border-amber-400/30">
                    Admin
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider bg-emerald-500/25 text-emerald-300 border border-emerald-400/30">
                    Planter
                  </span>
                )}
              </div>
              <button
                onClick={() => logout()}
                className="text-xs text-white/70 hover:text-white transition-colors px-2 py-1 cursor-pointer font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium transition-colors px-4 py-2"
              style={{
                color: isAuth ? "#52b788" : "rgba(255,255,255,0.8)",
                fontWeight: isAuth ? 600 : 500,
              }}
            >
              Login
            </Link>
          )}
          {openPlant ? (
            <button
              onClick={openPlant}
              className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-105"
              style={{ background: "linear-gradient(135deg,#52b788,#2d6a4f)", color: "#fff" }}
            >
              Plant a Tree
            </button>
          ) : (
            <Link
              href="/?plant=true"
              className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-105"
              style={{ background: "linear-gradient(135deg,#52b788,#2d6a4f)", color: "#fff" }}
            >
              Plant a Tree
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden" style={{ background: "rgba(23,51,36,0.98)" }}>
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <div key={l.id}>
                {isHome && setActive ? (
                  <button
                    onClick={() => {
                      setActive(l.id);
                      setMenuOpen(false);
                    }}
                    className="text-left text-white/80 hover:text-white font-medium py-1 w-full"
                  >
                    {l.label}
                  </button>
                ) : (
                  <Link
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-left text-white/80 hover:text-white font-medium py-1 block"
                  >
                    {l.label}
                  </Link>
                )}
              </div>
            ))}
            {isAuthenticated && user ? (
              <div className="py-2.5 px-1 flex flex-col gap-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#52b788]"></span>
                    <span className="font-semibold">{user.name}</span>
                    {user.role === "admin" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider bg-amber-500/25 text-amber-300 border border-amber-400/30">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="text-xs text-red-300 hover:text-red-200 font-medium cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="text-xs font-semibold px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-2"
                  >
                    <span>📊</span>
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-left text-white/80 hover:text-white font-medium py-1"
              >
                Login / Sign Up
              </Link>
            )}
            {openPlant ? (
              <button
                onClick={() => {
                  openPlant();
                  setMenuOpen(false);
                }}
                className="mt-2 text-sm font-semibold px-5 py-3 rounded-full text-white text-center"
                style={{ background: "linear-gradient(135deg,#52b788,#2d6a4f)" }}
              >
                Plant a Tree
              </button>
            ) : (
              <Link
                href="/?plant=true"
                onClick={() => setMenuOpen(false)}
                className="mt-2 text-sm font-semibold px-5 py-3 rounded-full text-white text-center block"
                style={{ background: "linear-gradient(135deg,#52b788,#2d6a4f)" }}
              >
                Plant a Tree
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
