"use client";

import { useState, useEffect } from "react";
import { Section } from "@/types";
import Image from "next/image";
import Logo from "../public/Screenshot_From_2026-09-17_15-39-39-removebg-preview.png"

interface NavProps {
  active: Section;
  setActive: (s: Section) => void;
  openPlant: () => void;
}

export function Nav({ active, setActive, openPlant }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links: { label: string; id: Section }[] = [
    { label: "Home", id: "home" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Our Trees", id: "trees" },
    { label: "Impact", id: "impact" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(23,51,36,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(82,183,136,0.15)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setActive("home")}
          className="flex items-center gap-2.5 group *:hover:cursor-pointer duration-200"
        >
          <Image
            src={Logo}
            alt="Logo"
            width={200}
            height={200}
            className="w-auto h-10 sm:h-12 md:h-14 object-contain"
          />
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => setActive(l.id)}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: active === l.id ? "#52b788" : "rgba(255,255,255,0.8)" }}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm font-medium text-white/80 hover:text-white transition-colors px-4 py-2">
            Login
          </button>
          <button
            onClick={openPlant}
            className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-105"
            style={{ background: "linear-gradient(135deg,#52b788,#2d6a4f)", color: "#fff" }}
          >
            Plant a Tree
          </button>
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
              <button
                key={l.id}
                onClick={() => {
                  setActive(l.id);
                  setMenuOpen(false);
                }}
                className="text-left text-white/80 hover:text-white font-medium py-1"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => {
                openPlant();
                setMenuOpen(false);
              }}
              className="mt-2 text-sm font-semibold px-5 py-3 rounded-full text-white"
              style={{ background: "linear-gradient(135deg,#52b788,#2d6a4f)" }}
            >
              Plant a Tree
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
