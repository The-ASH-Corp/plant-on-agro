"use client";

import { ImpactSectionContent, ImpactStatItem, ImpactProjectItem } from "@/services/landing-page/landing-page.service";
import { ImpactEditorProps } from "./types";
import { ToggleSwitch } from "./ToggleSwitch";

export function ImpactEditor({ impact, onChange, onToggle }: ImpactEditorProps) {
  const isEnabled = impact.isEnabled !== false;

  const updateStat = (index: number, field: keyof ImpactStatItem, val: string | number) => {
    const updated = [...impact.stats];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...impact, stats: updated });
  };

  const addStat = () => {
    const updated = [
      ...impact.stats,
      { icon: "🍃", value: 500, suffix: "+", label: "New Stat", color: "#52b788" },
    ];
    onChange({ ...impact, stats: updated });
  };

  const removeStat = (index: number) => {
    const updated = impact.stats.filter((_, i) => i !== index);
    onChange({ ...impact, stats: updated });
  };

  const updateProject = (index: number, field: keyof ImpactProjectItem, val: string) => {
    const updated = [...impact.projects];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...impact, projects: updated });
  };

  const addProject = () => {
    const updated = [
      ...impact.projects,
      {
        title: "New Forest Project",
        trees: "1,000 trees",
        region: "State/City",
        img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
      },
    ];
    onChange({ ...impact, projects: updated });
  };

  const removeProject = (index: number) => {
    const updated = impact.projects.filter((_, i) => i !== index);
    onChange({ ...impact, projects: updated });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e2eae5] shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-[#f0f4f1] pb-4">
        <div>
          <h3 className="text-base font-bold text-[#173324] flex items-center gap-2">
            <span>🌍</span> Collective Impact & Featured Projects
          </h3>
          <p className="text-xs text-[#52796f]">High-impact statistics and geotagged verified reserve highlights.</p>
        </div>
        <div className="flex items-center gap-3">
          <ToggleSwitch
            enabled={isEnabled}
            onChange={onToggle}
            label={isEnabled ? "Section Visible" : "Section Hidden"}
          />
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            Section 03
          </span>
        </div>
      </div>

      {!isEnabled && (
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>This section is currently <strong>disabled</strong> and hidden from visitors on the live storefront.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">Tagline</label>
          <input
            type="text"
            value={impact.tagline}
            onChange={(e) => onChange({ ...impact, tagline: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">Title</label>
          <input
            type="text"
            value={impact.title}
            onChange={(e) => onChange({ ...impact, title: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-[#173324] mb-1.5">Impact Narrative / Subtitle</label>
          <input
            type="text"
            value={impact.description}
            onChange={(e) => onChange({ ...impact, description: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>
      </div>

      {/* Impact Stats */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-[#173324]">5-Point Environmental Impact Metrics</label>
          <button
            type="button"
            onClick={addStat}
            className="text-xs font-bold text-[#1b7a43] hover:text-[#145c32] cursor-pointer flex items-center gap-1"
          >
            + Add Metric
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {impact.stats.map((s, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-[#e2eae5] bg-[#fafcfb] space-y-2 relative group">
              <button
                type="button"
                onClick={() => removeStat(idx)}
                className="absolute top-1.5 right-1.5 text-gray-400 hover:text-red-500 text-xs cursor-pointer"
              >
                ✕
              </button>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={s.icon}
                  onChange={(e) => updateStat(idx, "icon", e.target.value)}
                  className="w-8 text-center text-lg px-1 py-0.5 rounded border border-[#d2ded7]"
                />
                <input
                  type="color"
                  value={s.color}
                  onChange={(e) => updateStat(idx, "color", e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                  title="Accent Color"
                />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-semibold">Value & Unit</span>
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={s.value}
                    onChange={(e) => updateStat(idx, "value", Number(e.target.value))}
                    className="w-16 px-1.5 py-1 text-xs rounded border border-[#d2ded7] font-bold"
                  />
                  <input
                    type="text"
                    value={s.suffix}
                    onChange={(e) => updateStat(idx, "suffix", e.target.value)}
                    className="w-12 px-1.5 py-1 text-xs rounded border border-[#d2ded7]"
                  />
                </div>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-semibold">Label</span>
                <input
                  type="text"
                  value={s.label}
                  onChange={(e) => updateStat(idx, "label", e.target.value)}
                  className="w-full px-1.5 py-1 text-xs rounded border border-[#d2ded7]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Projects */}
      <div className="pt-4 border-t border-[#f0f4f1]">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-[#173324]">Featured Plantation Projects</label>
          <button
            type="button"
            onClick={addProject}
            className="text-xs font-bold text-[#1b7a43] hover:text-[#145c32] cursor-pointer flex items-center gap-1"
          >
            + Add Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {impact.projects.map((proj, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-[#e2eae5] bg-[#fafcfb] space-y-2 relative group">
              <button
                type="button"
                onClick={() => removeProject(idx)}
                className="absolute top-2 right-2 text-white bg-black/50 hover:bg-red-500 px-1.5 py-0.5 rounded-full text-xs cursor-pointer z-10"
              >
                ✕
              </button>
              <div className="h-24 w-full rounded-lg overflow-hidden relative">
                <img src={proj.img} alt={proj.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-semibold">Image URL</span>
                <input
                  type="text"
                  value={proj.img}
                  onChange={(e) => updateProject(idx, "img", e.target.value)}
                  className="w-full px-2 py-1 text-[11px] rounded border border-[#d2ded7] font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-semibold">Project Title</span>
                <input
                  type="text"
                  value={proj.title}
                  onChange={(e) => updateProject(idx, "title", e.target.value)}
                  className="w-full px-2 py-1 text-xs font-bold text-[#173324] rounded border border-[#d2ded7]"
                />
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <span className="text-[10px] text-gray-500 font-semibold">Trees Metric</span>
                  <input
                    type="text"
                    value={proj.trees}
                    onChange={(e) => updateProject(idx, "trees", e.target.value)}
                    className="w-full px-2 py-1 text-xs text-[#2d6a4f] font-semibold rounded border border-[#d2ded7]"
                  />
                </div>
                <div className="w-1/2">
                  <span className="text-[10px] text-gray-500 font-semibold">Region</span>
                  <input
                    type="text"
                    value={proj.region}
                    onChange={(e) => updateProject(idx, "region", e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded border border-[#d2ded7]"
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
