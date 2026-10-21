"use client";

import { CertificateStatsCardsProps } from "./types";

export function CertificateStatsCards({
  stats,
  selectedStatus,
  onSelectStatus,
}: CertificateStatsCardsProps) {
  const cards = [
    {
      id: "All",
      label: "Total Deeds",
      count: stats.total,
      subtext: "Archived & Ledger",
      icon: "📜",
      bgGradient: "from-emerald-950 to-[#122e1f]",
      textColor: "text-white",
      subtextColor: "text-emerald-300/70",
      iconBg: "bg-white/10 text-emerald-300",
      accentBorder: "border-emerald-800/40",
      badge: "Cryptographic",
    },
    {
      id: "Issued",
      label: "Valid & Active",
      count: stats.issuedCount,
      subtext: `${stats.total > 0 ? Math.round((stats.issuedCount / stats.total) * 100) : 0}% of all deeds`,
      icon: "✓",
      bgGradient: "from-white to-[#f4faf6]",
      textColor: "text-[#173324]",
      subtextColor: "text-emerald-700",
      iconBg: "bg-emerald-100 text-emerald-800",
      accentBorder: "border-emerald-200",
      badge: "Active Deeds",
    },
    {
      id: "Pending Generation",
      label: "Pending Generation",
      count: stats.pendingCount,
      subtext: "Awaiting tree planting",
      icon: "⏳",
      bgGradient: "from-white to-[#fffcf4]",
      textColor: "text-[#173324]",
      subtextColor: "text-amber-700",
      iconBg: "bg-amber-100 text-amber-800",
      accentBorder: "border-amber-200",
      badge: "In Queue",
    },
    {
      id: "Revoked",
      label: "Revoked Deeds",
      count: stats.revokedCount,
      subtext: "Invalidated / Reissued",
      icon: "🚫",
      bgGradient: "from-white to-[#fdf6f6]",
      textColor: "text-[#173324]",
      subtextColor: "text-rose-700",
      iconBg: "bg-rose-100 text-rose-800",
      accentBorder: "border-rose-200",
      badge: "Voided",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const isSelected = selectedStatus === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectStatus(c.id)}
            className={`text-left rounded-3xl p-5 border bg-linear-to-br ${c.bgGradient} ${
              c.accentBorder
            } shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group ${
              isSelected ? "ring-2 ring-emerald-500 scale-[1.01]" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-bold ${c.iconBg} group-hover:scale-110 transition-transform`}
              >
                {c.icon}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  c.id === "All"
                    ? "bg-white/10 text-emerald-200"
                    : "bg-[#173324]/5 text-[#173324]"
                }`}
              >
                {c.badge}
              </span>
            </div>
            <div
              className={`text-3xl font-extrabold tracking-tight mb-1 ${c.textColor}`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {c.count.toLocaleString()}
            </div>
            <div className={`text-xs font-semibold ${c.textColor} opacity-90`}>
              {c.label}
            </div>
            <div className={`text-[11px] mt-1 ${c.subtextColor}`}>
              {c.subtext}
            </div>
          </button>
        );
      })}
    </div>
  );
}
