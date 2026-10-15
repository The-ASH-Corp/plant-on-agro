"use client";

import { SectionVisibilityMasterProps, SectionKey } from "./types";
import { ToggleSwitch } from "./ToggleSwitch";

export function SectionVisibilityMaster({
  content,
  onToggleSection,
  onSelectSection,
}: SectionVisibilityMasterProps) {
  const isHeroEnabled = content.hero.isEnabled !== false;
  const isHowItWorksEnabled = content.howItWorks.isEnabled !== false;
  const isImpactEnabled = content.impact.isEnabled !== false;
  const isCertificateEnabled = content.certificate.isEnabled !== false;
  const isCtaBandEnabled = content.footer.ctaBandEnabled !== false;

  const sections = [
    {
      id: "hero" as const,
      title: "Hero & Intro",
      icon: "🌲",
      enabled: isHeroEnabled,
      desc: "Hero banner, title, counter stats",
    },
    {
      id: "howItWorks" as const,
      title: "How It Works",
      icon: "📋",
      enabled: isHowItWorksEnabled,
      desc: "3-step planting journey cards",
    },
    {
      id: "impact" as const,
      title: "Impact & Projects",
      icon: "🌍",
      enabled: isImpactEnabled,
      desc: "Impact counters & featured reserves",
    },
    {
      id: "certificate" as const,
      title: "Certificate",
      icon: "📜",
      enabled: isCertificateEnabled,
      desc: "Digital certificate showcase & mockup",
    },
    {
      id: "footer" as const,
      title: "Closing CTA Band",
      icon: "🌿",
      enabled: isCtaBandEnabled,
      desc: "High-conversion 'Plant Today' banner",
    },
  ];

  const activeCount = [
    isHeroEnabled,
    isHowItWorksEnabled,
    isImpactEnabled,
    isCertificateEnabled,
    isCtaBandEnabled,
  ].filter(Boolean).length;

  return (
    <div className="bg-gradient-to-br from-[#f2f8f4] via-[#e8f5ee] to-[#f9fbf9] rounded-2xl p-6 border border-[#cbe3d4] shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#173324] flex items-center gap-2">
            <span>🎛️</span> Section Visibility Master Controls
          </h3>
          <p className="text-xs text-[#52796f]">
            Turn landing page sections on or off with a single click. Disabled sections will be instantly hidden from visitors.
          </p>
        </div>
        <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-white border border-[#cbe3d4] text-[#1b7a43]">
          {activeCount} / 5 Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-2">
        {sections.map((sec) => (
          <div
            key={sec.id}
            className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
              sec.enabled
                ? "bg-white border-[#b7dec6] shadow-xs"
                : "bg-gray-50/80 border-gray-200 opacity-75"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{sec.icon}</span>
                <ToggleSwitch
                  enabled={sec.enabled}
                  onChange={() => onToggleSection(sec.id)}
                />
              </div>
              <h4 className="text-xs font-bold text-[#173324]">{sec.title}</h4>
              <p className="text-[11px] text-[#52796f] mt-1 leading-snug">{sec.desc}</p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  sec.enabled
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {sec.enabled ? "Active" : "Off"}
              </span>
              <button
                onClick={() => onSelectSection(sec.id as SectionKey)}
                className="text-[10px] font-bold text-[#1b7a43] hover:underline cursor-pointer"
              >
                Edit →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
