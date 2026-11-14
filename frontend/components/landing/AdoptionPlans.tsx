"use client";

import { useState } from "react";
import { JoinWaitlistModal } from "./JoinWaitlistModal";

export interface AdoptionPlansProps {
  openPlant?: (planId?: string) => void;
}

export function AdoptionPlans({ openPlant: _openPlant }: AdoptionPlansProps) {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const perks = [
    {
      icon: "🌲",
      title: "Lifetime Arborist Custody",
      desc: "One-time adoption with multi-decade care, organic nourishment, and regular canopy monitoring.",
    },
    {
      icon: "🛰️",
      title: "Ground GPS & Telemetry",
      desc: "Exact coordinates, individual tree identity tags, and verified periodic photographic growth logs.",
    },
    {
      icon: "📜",
      title: "Legal Digital Deed",
      desc: "Tamper-evident ownership proof, verified QR code authentication, and shareable ESG certification.",
    },
    {
      icon: "🏡",
      title: "Plantation Heritage Visits",
      desc: "Walk your personal grove, harvest fruits, stay at eco-reserves, and experience Ayurvedic wellness.",
    },
  ];

  return (
    <section id="plans" className="py-24 sm:py-32 scroll-mt-20 relative overflow-hidden" style={{ background: "var(--color-cream)" }}>
      {/* Background ambient lighting synced with cream/sage palette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-emerald-200/30 to-[#95d5b2]/20 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/90 border border-emerald-200 text-[#2d6a4f] text-xs font-bold uppercase tracking-wider shadow-2xs">
            <span>🌿 Priority Allocation • Exclusive Access</span>
          </div>

          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[#173324] text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            Adoption Packages & Living Forests
          </h2>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Public retail packages for our flagship 30-acre Kerala reserve are currently locked while arborist survey teams finalize GPS telemetry grids. Join our exclusive waitlist for priority reservation access.
          </p>
        </div>

        {/* Exclusive Waitlist Showcase Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#173324] via-[#1f4a33] to-[#122b1d] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-emerald-900/40">
          {/* Decorative glowing background elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#52b788]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#1b7a43]/30 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Phase 1 Allocations: 1,00,000 Trees Under Survey</span>
            </div>

            <div className="space-y-3">
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight"
              >
                Be the First to Adopt a Living Forest
              </h3>
              <p className="text-emerald-100/85 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Adopter allocations are strictly released in regulated tranches to protect biodiversity biomes. Secure your spot on the waitlist to receive priority access before public release.
              </p>
            </div>

            {/* Prominent CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setWaitlistOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-sm sm:text-base text-[#173324] bg-gradient-to-r from-emerald-300 via-[#95d5b2] to-amber-200 hover:from-white hover:to-emerald-100 shadow-xl shadow-black/30 hover:shadow-2xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 group transform hover:-translate-y-0.5"
              >
                <span>✨ Join in Waitlist</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            <div className="text-xs text-emerald-200/70 flex items-center justify-center gap-2">
              <span>🔒 Direct SMS & Email notification</span>
              <span>•</span>
              <span>No payment required to join waitlist</span>
            </div>
          </div>

          {/* 4 Foundation Perks Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-10 border-t border-emerald-500/20">
            {perks.map((p, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left space-y-1.5"
              >
                <div className="text-2xl">{p.icon}</div>
                <h4 className="text-sm font-bold text-white">{p.title}</h4>
                <p className="text-xs text-emerald-100/75 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pop-up Waitlist Modal */}
      <JoinWaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
        source="adoption_packages_section"
      />
    </section>
  );
}
