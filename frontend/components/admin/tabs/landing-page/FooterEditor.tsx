"use client";

import { FooterSectionContent } from "@/services/landing-page/landing-page.service";
import { FooterEditorProps } from "./types";
import { ToggleSwitch } from "./ToggleSwitch";

export function FooterEditor({ footer, onChange, onToggle }: FooterEditorProps) {
  const isCtaBandEnabled = footer.ctaBandEnabled !== false;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e2eae5] shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-[#f0f4f1] pb-4">
        <div>
          <h3 className="text-base font-bold text-[#173324] flex items-center gap-2">
            <span>🌿</span> Call to Action Band & Global Footer
          </h3>
          <p className="text-xs text-[#52796f]">The high-conversion closing banner and company legal sign-offs.</p>
        </div>
        <div className="flex items-center gap-3">
          <ToggleSwitch
            enabled={isCtaBandEnabled}
            onChange={onToggle}
            label={isCtaBandEnabled ? "CTA Band Visible" : "CTA Band Hidden"}
          />
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            Section 05
          </span>
        </div>
      </div>

      {!isCtaBandEnabled && (
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>The CTA Banner ("Plant Today. Grow Tomorrow.") is currently <strong>disabled</strong>. The bottom footer links and copyright remain visible.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">CTA Tagline</label>
          <input
            type="text"
            value={footer.ctaTagline}
            onChange={(e) => onChange({ ...footer, ctaTagline: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">CTA Headline Line 1</label>
          <input
            type="text"
            value={footer.ctaTitlePart1}
            onChange={(e) => onChange({ ...footer, ctaTitlePart1: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">CTA Highlight Line 2</label>
          <input
            type="text"
            value={footer.ctaTitleHighlight}
            onChange={(e) => onChange({ ...footer, ctaTitleHighlight: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">CTA Button Text</label>
          <input
            type="text"
            value={footer.ctaButtonText}
            onChange={(e) => onChange({ ...footer, ctaButtonText: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-[#173324] mb-1.5">CTA Paragraph Description</label>
          <textarea
            rows={2}
            value={footer.ctaDescription}
            onChange={(e) => onChange({ ...footer, ctaDescription: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">Footer Brand Tagline</label>
          <input
            type="text"
            value={footer.footerTagline}
            onChange={(e) => onChange({ ...footer, footerTagline: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#173324] mb-1.5">Footer Copyright Line</label>
          <input
            type="text"
            value={footer.copyrightText}
            onChange={(e) => onChange({ ...footer, copyrightText: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] outline-none"
          />
        </div>
      </div>
    </div>
  );
}
