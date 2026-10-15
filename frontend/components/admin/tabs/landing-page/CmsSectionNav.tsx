"use client";

import { CmsSectionNavProps, SectionKey } from "./types";

export function CmsSectionNav({
  activeSection,
  onSelectSection,
  content,
}: CmsSectionNavProps) {
  const isHeroEnabled = content.hero.isEnabled !== false;
  const isHowItWorksEnabled = content.howItWorks.isEnabled !== false;
  const isImpactEnabled = content.impact.isEnabled !== false;
  const isCertificateEnabled = content.certificate.isEnabled !== false;
  const isCtaBandEnabled = content.footer.ctaBandEnabled !== false;

  const tabs: { id: SectionKey; label: string; desc: string; isEnabled?: boolean }[] = [
    { id: "all", label: "🌟 All Sections", desc: "Overview" },
    { id: "hero", label: "🌲 Hero & Intro", desc: "Above-the-fold", isEnabled: isHeroEnabled },
    { id: "howItWorks", label: "📋 How It Works", desc: "3-Step Flow", isEnabled: isHowItWorksEnabled },
    { id: "impact", label: "🌍 Impact & Projects", desc: "Metrics & Sites", isEnabled: isImpactEnabled },
    { id: "certificate", label: "📜 Certificate", desc: "Showcase & Proof", isEnabled: isCertificateEnabled },
    { id: "footer", label: "🌿 CTA & Footer", desc: "Closing Band", isEnabled: isCtaBandEnabled },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-[#e2eae5] pb-3">
      {tabs.map((tab) => {
        const isActive = activeSection === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectSection(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              isActive
                ? "bg-[#173324] text-white shadow-sm"
                : "bg-white text-[#4a6557] hover:bg-emerald-50 hover:text-[#173324] border border-[#e2eae5]"
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.isEnabled === "boolean" && (
              <span
                className={`w-2 h-2 rounded-full ${
                  tab.isEnabled ? "bg-emerald-400" : "bg-gray-300"
                }`}
                title={tab.isEnabled ? "Section Active" : "Section Off"}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
