"use client";

import { VisionMissionEditorProps } from "./types";
import { ToggleSwitch } from "./ToggleSwitch";

export function VisionMissionEditor({ visionMission, onChange, onToggle }: VisionMissionEditorProps) {
  const isEnabled = visionMission.isEnabled !== false;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e2eae5] shadow-xs space-y-6">
      {/* SECTION HEADER & VISIBILITY TOGGLE */}
      <div className="flex items-center justify-between border-b border-[#f0f4f1] pb-4">
        <div>
          <h3 className="text-base font-bold text-[#173324] flex items-center gap-2">
            <span>🔭</span> Vision & Mission Section (Agro-Forestry & Ecosystem)
          </h3>
          <p className="text-xs text-[#52796f]">
            Flagship 30-acre reserve, 1 Lakh to 20 Lakh tree targets, 4 ecosystem layers & nature tourism vision.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ToggleSwitch
            enabled={isEnabled}
            onChange={onToggle}
            label={isEnabled ? "Section Visible" : "Section Hidden"}
          />
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            Section 01B
          </span>
        </div>
      </div>

      {!isEnabled && (
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>
            This section is currently <strong>disabled</strong> and hidden from visitors on the live storefront.
          </span>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION HEADER COPY */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#52796f]">
          1. Header & Tagline
        </h4>

        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">
            Top Badge / Ecosystem Tagline
          </label>
          <input
            type="text"
            value={visionMission.badge}
            onChange={(e) => onChange({ ...visionMission, badge: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#173324] mb-1.5">
              Main Headline (First Part)
            </label>
            <input
              type="text"
              value={visionMission.headline}
              onChange={(e) => onChange({ ...visionMission, headline: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#173324] mb-1.5">
              Headline Highlight (Green Accent)
            </label>
            <input
              type="text"
              value={visionMission.headlineHighlight}
              onChange={(e) => onChange({ ...visionMission, headlineHighlight: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">
            Overview & Partnership Description
          </label>
          <textarea
            rows={3}
            value={visionMission.description}
            onChange={(e) => onChange({ ...visionMission, description: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none resize-none"
          />
        </div>

        {/* 3 Header Tag Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#173324] mb-1.5">
              Location Tag
            </label>
            <input
              type="text"
              value={visionMission.locationTag}
              onChange={(e) => onChange({ ...visionMission, locationTag: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#d2ded7] focus:border-[#1b7a43] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#173324] mb-1.5">
              Reserve Size Tag
            </label>
            <input
              type="text"
              value={visionMission.reserveTag}
              onChange={(e) => onChange({ ...visionMission, reserveTag: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#d2ded7] focus:border-[#1b7a43] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#173324] mb-1.5">
              Initial Trees Tag
            </label>
            <input
              type="text"
              value={visionMission.initialTreesTag}
              onChange={(e) => onChange({ ...visionMission, initialTreesTag: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#d2ded7] focus:border-[#1b7a43] outline-none"
            />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VISION & MISSION PILLARS */}
      {/* ========================================================= */}
      <div className="pt-2 border-t border-[#f0f4f1] space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#52796f]">
          2. Vision & Mission Pillars
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Vision Editor */}
          <div className="p-4 rounded-xl bg-[#fdfefe] border border-[#d2ded7] space-y-3">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <span>🔭</span> Vision Statement
            </span>
            <div>
              <label className="block text-[11px] font-bold text-[#173324] mb-1">
                Vision Headline
              </label>
              <input
                type="text"
                value={visionMission.visionTitle}
                onChange={(e) => onChange({ ...visionMission, visionTitle: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#d2ded7] focus:border-[#1b7a43] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#173324] mb-1">
                Vision Paragraph
              </label>
              <textarea
                rows={3}
                value={visionMission.visionDescription}
                onChange={(e) => onChange({ ...visionMission, visionDescription: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#d2ded7] focus:border-[#1b7a43] outline-none resize-none"
              />
            </div>
          </div>

          {/* Mission Editor */}
          <div className="p-4 rounded-xl bg-[#fdfefe] border border-[#d2ded7] space-y-3">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <span>🎯</span> Mission Statement
            </span>
            <div>
              <label className="block text-[11px] font-bold text-[#173324] mb-1">
                Mission Headline
              </label>
              <input
                type="text"
                value={visionMission.missionTitle}
                onChange={(e) => onChange({ ...visionMission, missionTitle: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#d2ded7] focus:border-[#1b7a43] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#173324] mb-1">
                Mission Subtitle
              </label>
              <textarea
                rows={3}
                value={visionMission.missionSubtitle}
                onChange={(e) => onChange({ ...visionMission, missionSubtitle: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#d2ded7] focus:border-[#1b7a43] outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MILESTONE TARGET METRICS */}
      {/* ========================================================= */}
      <div className="pt-2 border-t border-[#f0f4f1] space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#52796f]">
          3. Target Metrics (Initial vs 5-Year)
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-[#173324] mb-1">
              Initial Trees
            </label>
            <input
              type="text"
              value={visionMission.initialTrees}
              onChange={(e) => onChange({ ...visionMission, initialTrees: e.target.value })}
              className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-[#d2ded7] focus:border-[#1b7a43] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#173324] mb-1">
              Initial Acres
            </label>
            <input
              type="text"
              value={visionMission.initialAcres}
              onChange={(e) => onChange({ ...visionMission, initialAcres: e.target.value })}
              className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-[#d2ded7] focus:border-[#1b7a43] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#173324] mb-1">
              5-Year Trees
            </label>
            <input
              type="text"
              value={visionMission.fiveYearTrees}
              onChange={(e) => onChange({ ...visionMission, fiveYearTrees: e.target.value })}
              className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-[#d2ded7] focus:border-[#1b7a43] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#173324] mb-1">
              5-Year Locations
            </label>
            <input
              type="text"
              value={visionMission.fiveYearLocations}
              onChange={(e) => onChange({ ...visionMission, fiveYearLocations: e.target.value })}
              className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-[#d2ded7] focus:border-[#1b7a43] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#173324] mb-1">
              5-Year Total Acres
            </label>
            <input
              type="text"
              value={visionMission.fiveYearTotalAcres}
              onChange={(e) => onChange({ ...visionMission, fiveYearTotalAcres: e.target.value })}
              className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-[#d2ded7] focus:border-[#1b7a43] outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
