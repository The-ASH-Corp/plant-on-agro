"use client";

import { HowItWorksSectionContent, HowItWorksStepItem } from "@/services/landing-page/landing-page.service";
import { HowItWorksEditorProps } from "./types";
import { ToggleSwitch } from "./ToggleSwitch";

export function HowItWorksEditor({ howItWorks, onChange, onToggle }: HowItWorksEditorProps) {
  const isEnabled = howItWorks.isEnabled !== false;

  const updateStep = (index: number, field: keyof HowItWorksStepItem, val: string) => {
    const updated = [...howItWorks.steps];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...howItWorks, steps: updated });
  };

  const addStep = () => {
    const nextNum = String(howItWorks.steps.length + 1).padStart(2, "0");
    const updated = [
      ...howItWorks.steps,
      { num: nextNum, icon: "🌿", title: "New Step", desc: "Step description goes here..." },
    ];
    onChange({ ...howItWorks, steps: updated });
  };

  const removeStep = (index: number) => {
    const updated = howItWorks.steps.filter((_, i) => i !== index);
    onChange({ ...howItWorks, steps: updated });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e2eae5] shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-[#f0f4f1] pb-4">
        <div>
          <h3 className="text-base font-bold text-[#173324] flex items-center gap-2">
            <span>📋</span> How PlantOn agro Works (Step Cards)
          </h3>
          <p className="text-xs text-[#52796f]">Explaining the 3-step planting journey to prospective tree adopters.</p>
        </div>
        <div className="flex items-center gap-3">
          <ToggleSwitch
            enabled={isEnabled}
            onChange={onToggle}
            label={isEnabled ? "Section Visible" : "Section Hidden"}
          />
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            Section 02
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
          <label className="block text-xs font-bold text-[#173324] mb-1.5">Section Tagline</label>
          <input
            type="text"
            value={howItWorks.tagline}
            onChange={(e) => onChange({ ...howItWorks, tagline: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">Section Title</label>
          <input
            type="text"
            value={howItWorks.title}
            onChange={(e) => onChange({ ...howItWorks, title: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-[#173324]">Step Flow Cards</label>
          <button
            type="button"
            onClick={addStep}
            className="text-xs font-bold text-[#1b7a43] hover:text-[#145c32] cursor-pointer flex items-center gap-1"
          >
            + Add Step
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {howItWorks.steps.map((step, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-[#e2eae5] bg-[#fafcfb] space-y-3 relative group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#52b788]">STEP {step.num}</span>
                <button
                  type="button"
                  onClick={() => removeStep(idx)}
                  className="text-gray-400 hover:text-red-500 text-xs cursor-pointer"
                  title="Delete Step"
                >
                  ✕
                </button>
              </div>

              <div className="flex gap-2">
                <div className="w-16">
                  <span className="text-[10px] text-gray-500 font-semibold">Icon</span>
                  <input
                    type="text"
                    value={step.icon}
                    onChange={(e) => updateStep(idx, "icon", e.target.value)}
                    className="w-full px-2 py-1 text-center text-base rounded-lg border border-[#d2ded7]"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-gray-500 font-semibold">Title</span>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(idx, "title", e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded-lg border border-[#d2ded7] font-semibold text-[#173324]"
                  />
                </div>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 font-semibold">Description</span>
                <textarea
                  rows={2}
                  value={step.desc}
                  onChange={(e) => updateStep(idx, "desc", e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded-lg border border-[#d2ded7]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
