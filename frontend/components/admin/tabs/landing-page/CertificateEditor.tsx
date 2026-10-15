"use client";

import { CertificateSectionContent } from "@/services/landing-page/landing-page.service";
import { CertificateEditorProps } from "./types";
import { ToggleSwitch } from "./ToggleSwitch";

export function CertificateEditor({ certificate, onChange, onToggle }: CertificateEditorProps) {
  const isEnabled = certificate.isEnabled !== false;

  const updateFeature = (index: number, val: string) => {
    const updated = [...certificate.features];
    updated[index] = val;
    onChange({ ...certificate, features: updated });
  };

  const addFeature = () => {
    const updated = [...certificate.features, "New certificate feature highlight"];
    onChange({ ...certificate, features: updated });
  };

  const removeFeature = (index: number) => {
    const updated = certificate.features.filter((_, i) => i !== index);
    onChange({ ...certificate, features: updated });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e2eae5] shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-[#f0f4f1] pb-4">
        <div>
          <h3 className="text-base font-bold text-[#173324] flex items-center gap-2">
            <span>📜</span> Certificate of Plantation Section & Sample Mockup
          </h3>
          <p className="text-xs text-[#52796f]">Highlighting tamper-proof digital certificates, GPS links, and live mockup data.</p>
        </div>
        <div className="flex items-center gap-3">
          <ToggleSwitch
            enabled={isEnabled}
            onChange={onToggle}
            label={isEnabled ? "Section Visible" : "Section Hidden"}
          />
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            Section 04
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
            value={certificate.tagline}
            onChange={(e) => onChange({ ...certificate, tagline: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">Title Line 1</label>
          <input
            type="text"
            value={certificate.titlePart1}
            onChange={(e) => onChange({ ...certificate, titlePart1: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">Title Highlight (Emphasized text)</label>
          <input
            type="text"
            value={certificate.titleHighlight}
            onChange={(e) => onChange({ ...certificate, titleHighlight: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">Section Description</label>
          <input
            type="text"
            value={certificate.description}
            onChange={(e) => onChange({ ...certificate, description: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>
      </div>

      {/* Feature Bullet Points */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-[#173324]">Checklist / Feature Highlights</label>
          <button
            type="button"
            onClick={addFeature}
            className="text-xs font-bold text-[#1b7a43] hover:text-[#145c32] cursor-pointer flex items-center gap-1"
          >
            + Add Bullet
          </button>
        </div>

        <div className="space-y-2">
          {certificate.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#d8f3e8] text-[#2d6a4f] text-xs flex items-center justify-center shrink-0">✓</span>
              <input
                type="text"
                value={feat}
                onChange={(e) => updateFeature(idx, e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#d2ded7]"
              />
              <button
                type="button"
                onClick={() => removeFeature(idx)}
                className="text-gray-400 hover:text-red-500 text-xs px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Certificate Mockup Settings */}
      <div className="pt-4 border-t border-[#f0f4f1]">
        <h4 className="text-xs font-bold text-[#173324] mb-3">Live Certificate Mockup Data (Visual Preview Card)</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <span className="text-[10px] text-gray-500 font-semibold">Recipient Name</span>
            <input
              type="text"
              value={certificate.sampleRecipientName}
              onChange={(e) => onChange({ ...certificate, sampleRecipientName: e.target.value })}
              className="w-full px-2.5 py-1 text-xs rounded border border-[#d2ded7]"
            />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-semibold">Tree Name</span>
            <input
              type="text"
              value={certificate.sampleTreeName}
              onChange={(e) => onChange({ ...certificate, sampleTreeName: e.target.value })}
              className="w-full px-2.5 py-1 text-xs rounded border border-[#d2ded7]"
            />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-semibold">Tree Tag ID</span>
            <input
              type="text"
              value={certificate.sampleTreeId}
              onChange={(e) => onChange({ ...certificate, sampleTreeId: e.target.value })}
              className="w-full px-2.5 py-1 text-xs rounded border border-[#d2ded7] font-mono"
            />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-semibold">Location Badge</span>
            <input
              type="text"
              value={certificate.sampleLocation}
              onChange={(e) => onChange({ ...certificate, sampleLocation: e.target.value })}
              className="w-full px-2.5 py-1 text-xs rounded border border-[#d2ded7]"
            />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-semibold">Date</span>
            <input
              type="text"
              value={certificate.sampleDate}
              onChange={(e) => onChange({ ...certificate, sampleDate: e.target.value })}
              className="w-full px-2.5 py-1 text-xs rounded border border-[#d2ded7]"
            />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-semibold">Certificate Quote / Statement</span>
            <input
              type="text"
              value={certificate.sampleQuote}
              onChange={(e) => onChange({ ...certificate, sampleQuote: e.target.value })}
              className="w-full px-2.5 py-1 text-xs rounded border border-[#d2ded7]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
