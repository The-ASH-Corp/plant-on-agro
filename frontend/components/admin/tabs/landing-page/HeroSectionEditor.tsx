"use client";

import { HeroSectionContent, HeroStatItem } from "@/services/landing-page/landing-page.service";
import { HeroSectionEditorProps } from "./types";
import { ToggleSwitch } from "./ToggleSwitch";

const BG_PRESETS = [
  {
    name: "Aerial Canopy",
    url: "https://images.unsplash.com/photo-1568241640298-1adf2974314c?w=1920&h=1080&fit=crop&auto=format",
  },
  {
    name: "Misty Pine Forest",
    url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1920&h=1080&fit=crop&auto=format",
  },
  {
    name: "Sunlit Woodland",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&h=1080&fit=crop&auto=format",
  },
  {
    name: "Tropical Grove",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop&auto=format",
  },
];

export function HeroSectionEditor({ hero, onChange, onToggle }: HeroSectionEditorProps) {
  const isHeroEnabled = hero.isEnabled !== false;

  const updateStat = (index: number, field: keyof HeroStatItem, val: string | number) => {
    const updated = [...hero.stats];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...hero, stats: updated });
  };

  const addStat = () => {
    const updated = [...hero.stats, { target: 1000, suffix: "+", label: "New Metric" }];
    onChange({ ...hero, stats: updated });
  };

  const removeStat = (index: number) => {
    const updated = hero.stats.filter((_, i) => i !== index);
    onChange({ ...hero, stats: updated });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e2eae5] shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-[#f0f4f1] pb-4">
        <div>
          <h3 className="text-base font-bold text-[#173324] flex items-center gap-2">
            <span>🌲</span> Hero Banner & Above-The-Fold
          </h3>
          <p className="text-xs text-[#52796f]">The first impression visitors experience upon arriving on the site.</p>
        </div>
        <div className="flex items-center gap-3">
          <ToggleSwitch
            enabled={isHeroEnabled}
            onChange={onToggle}
            label={isHeroEnabled ? "Section Visible" : "Section Hidden"}
          />
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            Section 01
          </span>
        </div>
      </div>

      {!isHeroEnabled && (
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>This section is currently <strong>disabled</strong> and hidden from visitors on the live storefront.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">Hero Pill Badge</label>
          <input
            type="text"
            value={hero.badge}
            onChange={(e) => onChange({ ...hero, badge: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
            placeholder="🌱 You Plant. We Grow."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">Headline Part 1</label>
          <input
            type="text"
            value={hero.headlinePart1}
            onChange={(e) => onChange({ ...hero, headlinePart1: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
            placeholder="Plant a Tree."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">Headline Highlight (Italicized/Colored)</label>
          <input
            type="text"
            value={hero.headlineHighlight}
            onChange={(e) => onChange({ ...hero, headlineHighlight: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
            placeholder="Create a Future."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">Hero Background Image URL</label>
          <input
            type="text"
            value={hero.bgImageUrl}
            onChange={(e) => onChange({ ...hero, bgImageUrl: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none font-mono"
          />
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-[#52796f]">Presets:</span>
            {BG_PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => onChange({ ...hero, bgImageUrl: p.url })}
                className="text-[10px] px-2 py-0.5 rounded bg-[#eef7f2] text-[#2d6a4f] hover:bg-[#d8efe2] transition-colors cursor-pointer"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-[#173324] mb-1.5">Hero Subtitle / Description</label>
          <textarea
            rows={2}
            value={hero.description}
            onChange={(e) => onChange({ ...hero, description: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">Primary CTA Button Label</label>
          <input
            type="text"
            value={hero.primaryCtaText}
            onChange={(e) => onChange({ ...hero, primaryCtaText: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">Secondary CTA Button Label</label>
          <input
            type="text"
            value={hero.secondaryCtaText}
            onChange={(e) => onChange({ ...hero, secondaryCtaText: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>
      </div>

      {/* Hero Live Counter Stats */}
      <div className="pt-4 border-t border-[#f0f4f1]">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-[#173324]">Hero Animated Stats Counters</label>
          <button
            type="button"
            onClick={addStat}
            className="text-xs font-bold text-[#1b7a43] hover:text-[#145c32] cursor-pointer flex items-center gap-1"
          >
            + Add Metric
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {hero.stats.map((stat, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-[#e2eae5] bg-[#fafcfb] relative group">
              <button
                type="button"
                onClick={() => removeStat(idx)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xs cursor-pointer"
                title="Remove Metric"
              >
                ✕
              </button>
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] text-gray-500 font-semibold">Target Value & Suffix</span>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={stat.target}
                      onChange={(e) => updateStat(idx, "target", Number(e.target.value))}
                      className="w-2/3 px-2 py-1 text-xs rounded-lg border border-[#d2ded7] font-bold text-[#173324]"
                    />
                    <input
                      type="text"
                      value={stat.suffix}
                      onChange={(e) => updateStat(idx, "suffix", e.target.value)}
                      className="w-1/3 px-2 py-1 text-xs rounded-lg border border-[#d2ded7] font-bold text-[#173324]"
                      placeholder="+"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-semibold">Label</span>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(idx, "label", e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded-lg border border-[#d2ded7]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
