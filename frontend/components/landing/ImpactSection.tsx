"use client";

import { Counter } from "@/components/ui/Counter";
import { ImpactSectionContent } from "@/services/landing-page/landing-page.service";

export interface ImpactLiveStats {
  totalTrees: number;
  totalCo2Mt: number;
  canopyAcres: number;
  peopleCount: number;
  varietiesCount: number;
}

export interface ImpactProjectItem {
  title: string;
  trees: string;
  region: string;
  img: string;
}

export interface ImpactSectionProps {
  content?: ImpactSectionContent;
  liveStats?: ImpactLiveStats;
  liveProjects?: ImpactProjectItem[];
}

export function ImpactSection({ content, liveStats, liveProjects }: ImpactSectionProps) {
  const tagline = content?.tagline || "Collective Action";
  const title = content?.title || "Your Impact Is Growing.";
  const description =
    content?.description ||
    "Every tree planted creates a ripple — cleaner air, cooler ground, and a living legacy.";

  const stats =
    content?.stats && content.stats.length > 0
      ? content.stats
      : liveStats
      ? [
          { icon: "🌳", value: liveStats.totalTrees, suffix: liveStats.totalTrees > 0 ? "+" : "", label: "Trees Planted & Geotagged", color: "#52b788" },
          { icon: "🌍", value: liveStats.totalCo2Mt, suffix: " MT", label: "CO₂ Impact Offset / yr", color: "#95d5b2" },
          { icon: "🌱", value: liveStats.canopyAcres, suffix: " acres", label: "Canopy Area Conserved", color: "#52b788" },
          { icon: "👥", value: liveStats.peopleCount, suffix: liveStats.peopleCount > 0 ? "+" : "", label: "Verified Adopters", color: "#95d5b2" },
          { icon: "🌿", value: liveStats.varietiesCount, suffix: " Species", label: "Botanical Varieties", color: "#52b788" },
        ]
      : [
          { icon: "🌳", value: 0, suffix: "", label: "Trees Planted & Geotagged", color: "#52b788" },
          { icon: "🌍", value: 0, suffix: " MT", label: "CO₂ Impact Offset / yr", color: "#95d5b2" },
          { icon: "🌱", value: 0, suffix: " acres", label: "Canopy Area Conserved", color: "#52b788" },
          { icon: "👥", value: 0, suffix: "", label: "Verified Adopters", color: "#95d5b2" },
          { icon: "🌿", value: 0, suffix: " Species", label: "Botanical Varieties", color: "#52b788" },
        ];

  const projects =
    content?.projects && content.projects.length > 0
      ? content.projects
      : liveProjects && liveProjects.length > 0
      ? liveProjects
      : [];

  return (
    <section
      id="impact"
      className="py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #173324 0%, #1e4433 60%, #0f2318 100%)" }}
    >
      {/* Decorative circles */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
        style={{
          background: "radial-gradient(circle, #52b788, transparent)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-5"
        style={{
          background: "radial-gradient(circle, #95d5b2, transparent)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[#52b788] text-sm font-semibold tracking-widest uppercase mb-3">
            {tagline}
          </p>
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-white text-4xl md:text-6xl mb-4"
          >
            {title}
          </h2>
          <p className="text-white/60 max-w-lg mx-auto text-lg">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-20">
          {stats.map((s, idx) => (
            <div
              key={`${s.label}-${idx}`}
              className="text-center p-6 rounded-2xl transition-transform duration-300 hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(82,183,136,0.15)",
              }}
            >
              <div className="text-3xl mb-3">{s.icon}</div>
              <div
                style={{ fontFamily: "var(--font-display)", color: s.color }}
                className="text-3xl md:text-4xl mb-1"
              >
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-white/50 text-xs font-medium leading-snug mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Project highlights */}
        {projects.length === 0 ? (
          <div className="p-8 sm:p-10 rounded-2xl bg-white/[0.04] border border-[#52b788]/20 text-center max-w-xl mx-auto backdrop-blur-xs">
            <span className="text-3xl">🌱</span>
            <h3 className="text-white font-semibold text-base mt-2">Active Plantation Reserves</h3>
            <p className="text-white/60 text-xs mt-1">
              Afforestation projects and reserve sectors will appear here as trees and botanical varieties are registered and planted.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((p, idx) => (
              <div
                key={`${p.title}-${idx}`}
                className="rounded-2xl overflow-hidden group"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(82,183,136,0.1)",
                }}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 50%, rgba(23,51,36,0.85))",
                    }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-white font-semibold mb-1">{p.title}</h3>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#52b788] font-medium">{p.trees}</span>
                    <span className="text-white/50">📍 {p.region}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
