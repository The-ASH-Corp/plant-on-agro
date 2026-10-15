"use client";

import { BuyerKpiData } from "./types";

interface BuyerKpiGridProps {
  kpi: BuyerKpiData;
}

export function BuyerKpiGrid({ kpi }: BuyerKpiGridProps) {
  const cards = [
    {
      title: "Active Living Trees",
      value: kpi.totalTrees,
      unit: "Trees",
      badge: "100% Thriving",
      badgeColor: "bg-emerald-500/15 text-emerald-700 border-emerald-300",
      description: "Alive and verified through drone telemetry",
      icon: "🌳",
      iconBg: "bg-gradient-to-tr from-emerald-500/20 to-emerald-500/10 text-emerald-700",
      accentBorder: "border-emerald-500/30",
      topGlow: "from-emerald-500/40 via-emerald-400/20 to-transparent",
    },
    {
      title: "Annual CO₂ Offset",
      value: `${kpi.estimatedCO2}`,
      unit: "kg / yr",
      badge: "Lifetime Sequestration",
      badgeColor: "bg-teal-500/15 text-teal-700 border-teal-300",
      description: "Direct mitigation of greenhouse emissions",
      icon: "🌍",
      iconBg: "bg-gradient-to-tr from-teal-500/20 to-teal-500/10 text-teal-700",
      accentBorder: "border-teal-500/30",
      topGlow: "from-teal-500/40 via-teal-400/20 to-transparent",
    },
    {
      title: "Restored Bio-Canopy",
      value: `${kpi.greenAreaSqFt}`,
      unit: "sq. ft",
      badge: "Native Biodiversity",
      badgeColor: "bg-amber-500/15 text-amber-700 border-amber-300",
      description: "Soil moisture recharge & pollinator habitat",
      icon: "🍃",
      iconBg: "bg-gradient-to-tr from-amber-500/20 to-amber-500/10 text-amber-700",
      accentBorder: "border-amber-500/30",
      topGlow: "from-amber-500/40 via-amber-400/20 to-transparent",
    },
    {
      title: "Cryptographic Deeds",
      value: kpi.certificatesCount,
      unit: "Official Deeds",
      badge: "Tamper-Proof",
      badgeColor: "bg-purple-500/15 text-purple-700 border-purple-300",
      description: "GPS-bound certified ownership records",
      icon: "📜",
      iconBg: "bg-gradient-to-tr from-purple-500/20 to-purple-500/10 text-purple-700",
      accentBorder: "border-purple-500/30",
      topGlow: "from-purple-500/40 via-purple-400/20 to-transparent",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`relative rounded-xl bg-white p-3.5 sm:p-4 border ${card.accentBorder} shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group`}
        >
          {/* Top subtle glow highlight line */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.topGlow} opacity-80 group-hover:opacity-100 transition-opacity`}
          />

          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#52796f]">
              {card.title}
            </span>
            <div
              className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center text-base shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
            >
              {card.icon}
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#173324] tracking-tight">
                {card.value}
              </span>
              <span className="text-xs font-semibold text-[#52796f]">{card.unit}</span>
            </div>

            <div className="pt-1">
              <span
                className={`inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${card.badgeColor}`}
              >
                {card.badge}
              </span>
            </div>

            <p className="text-[10px] text-[#52796f] pt-0.5 leading-snug">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
