"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Section } from "@/types";
import Image from "next/image";
import Logo from "../public/Screenshot_From_2026-09-17_15-39-39-removebg-preview.png";

interface NavProps {
  active?: Section;
  setActive?: (s: Section) => void;
  openPlant?: () => void;
  openAuth?: (m: "login" | "register") => void;
}

export function Nav({ active = "home", setActive, openPlant, openAuth }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

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
          {openAuth ? (
            <button
              onClick={() => openAuth("login")}
              className="text-sm font-medium transition-colors px-4 py-2 cursor-pointer"
              style={{
                color:
                  pathname === "/login" || pathname === "/register"
                    ? "#52b788"
                    : "rgba(255,255,255,0.8)",
                fontWeight:
                  pathname === "/login" || pathname === "/register" ? 600 : 500,
              }}
            >
              Login
            </button>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium transition-colors px-4 py-2"
              style={{
                color:
                  pathname === "/login" || pathname === "/register"
                    ? "#52b788"
                    : "rgba(255,255,255,0.8)",
                fontWeight:
                  pathname === "/login" || pathname === "/register" ? 600 : 500,
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
            {openAuth ? (
              <button
                onClick={() => {
                  openAuth("login");
                  setMenuOpen(false);
                }}
                className="text-left text-white/80 hover:text-white font-medium py-1 w-full cursor-pointer"
              >
                Login / Sign Up
              </button>
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
