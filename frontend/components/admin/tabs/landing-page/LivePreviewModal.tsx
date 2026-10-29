"use client";

import { LivePreviewModalProps } from "./types";

const formatStatSuffix = (suffix?: string) =>
  suffix ? (/^[a-zA-Z]/.test(suffix) ? ` ${suffix}` : suffix) : "";

export function LivePreviewModal({
  isOpen,
  content,
  hasUnsavedChanges,
  onClose,
  onSave,
}: LivePreviewModalProps) {
  if (!isOpen) return null;

  const isHeroEnabled = content.hero.isEnabled !== false;
  const isHowItWorksEnabled = content.howItWorks.isEnabled !== false;
  const isImpactEnabled = content.impact.isEnabled !== false;
  const isCertificateEnabled = content.certificate.isEnabled !== false;
  const isCtaBandEnabled = content.footer.ctaBandEnabled !== false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#f8faf9] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-emerald-900/40">
        <div className="bg-[#173324] px-6 py-4 flex items-center justify-between text-white border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">👁️</span>
            <div>
              <h3 className="text-sm font-bold">Interactive Landing Page Preview</h3>
              <p className="text-[11px] text-emerald-300">
                Sections will render exactly according to your ON/OFF visibility toggles.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8">
          {/* Hero Preview Card */}
          {isHeroEnabled ? (
            <div
              className="relative rounded-2xl overflow-hidden p-8 text-center text-white"
              style={{
                backgroundImage: `linear-gradient(rgba(23,51,36,0.85), rgba(23,51,36,0.92)), url(${content.hero.bgImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="inline-block px-4 py-1 rounded-full text-xs font-semibold mb-4 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {content.hero.badge}
              </div>
              <h1 className="text-3xl md:text-5xl font-serif mb-4 leading-tight">
                {content.hero.headlinePart1} <em className="text-[#95d5b2] not-italic">{content.hero.headlineHighlight}</em>
              </h1>
              <p className="text-white/80 max-w-xl mx-auto text-sm mb-6 leading-relaxed">
                {content.hero.description}
              </p>
              <div className="flex justify-center gap-3 mb-8">
                <span className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#52b788] text-white shadow-lg">
                  {content.hero.primaryCtaText}
                </span>
                <span className="px-6 py-2.5 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                  {content.hero.secondaryCtaText}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t border-white/15 pt-6 max-w-lg mx-auto">
                {content.hero.stats.map((s, i) => (
                  <div key={i}>
                    <div className="text-xl font-serif text-[#95d5b2] font-bold">
                      {s.target.toLocaleString()}{formatStatSuffix(s.suffix)}
                    </div>
                    <div className="text-[11px] text-white/70">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 text-xs">
              🌲 Hero Section (Hidden via CMS)
            </div>
          )}

          {/* Steps Preview */}
          {isHowItWorksEnabled ? (
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="text-center mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#2d6a4f]">{content.howItWorks.tagline}</p>
                <h3 className="text-xl font-bold text-[#173324]">{content.howItWorks.title}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {content.howItWorks.steps.map((st, i) => (
                  <div key={i} className="text-center p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <div className="text-3xl mb-2">{st.icon}</div>
                    <span className="text-[10px] font-bold text-[#52b788]">STEP {st.num}</span>
                    <h4 className="text-xs font-bold text-[#173324] mt-1 mb-1">{st.title}</h4>
                    <p className="text-[11px] text-[#4a6557]">{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 text-xs">
              📋 How It Works Section (Hidden via CMS)
            </div>
          )}

          {/* Impact Preview */}
          {isImpactEnabled ? (
            <div className="bg-[#173324] p-6 rounded-2xl text-white">
              <div className="text-center mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#52b788]">{content.impact.tagline}</p>
                <h3 className="text-xl font-bold">{content.impact.title}</h3>
                <p className="text-xs text-white/70 mt-1">{content.impact.description}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {content.impact.stats.map((s, i) => (
                  <div key={i} className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xl mb-1">{s.icon}</div>
                    <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}{formatStatSuffix(s.suffix)}</div>
                    <div className="text-[10px] text-white/60">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 text-xs">
              🌍 Collective Impact Section (Hidden via CMS)
            </div>
          )}

          {/* Certificate Mockup Preview */}
          {isCertificateEnabled ? (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#2d6a4f]">{content.certificate.tagline}</p>
                <h3 className="text-xl font-bold text-[#173324] mb-2">
                  {content.certificate.titlePart1} <em className="text-[#2d6a4f] not-italic">{content.certificate.titleHighlight}</em>
                </h3>
                <p className="text-xs text-gray-600 mb-4">{content.certificate.description}</p>
                <div className="space-y-1.5">
                  {content.certificate.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                      <span className="text-[#2d6a4f] font-bold">✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-72 bg-gradient-to-br from-[#173324] to-[#1e4433] p-5 rounded-2xl text-white text-center shadow-lg">
                <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest block mb-1">
                  Certificate of Plantation
                </span>
                <h4 className="text-base font-serif font-bold mb-1">{content.certificate.sampleRecipientName}</h4>
                <p className="text-[10px] text-white/60 mb-3">{content.certificate.sampleQuote}</p>
                <div className="grid grid-cols-2 gap-2 text-left bg-white/10 p-2.5 rounded-xl text-[10px]">
                  <div>
                    <span className="text-emerald-300 block text-[9px]">Tree</span>
                    <strong>{content.certificate.sampleTreeName}</strong>
                  </div>
                  <div>
                    <span className="text-emerald-300 block text-[9px]">Tree ID</span>
                    <strong className="font-mono">{content.certificate.sampleTreeId}</strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 text-xs">
              📜 Certificate Section (Hidden via CMS)
            </div>
          )}

          {/* CTA Band Preview */}
          {isCtaBandEnabled ? (
            <div className="rounded-2xl bg-gradient-to-r from-[#173324] to-[#1e4433] p-6 text-center text-white">
              <span className="text-xs font-bold uppercase text-[#52b788] tracking-widest">{content.footer.ctaTagline}</span>
              <h3 className="text-xl font-bold mt-1 mb-2">
                {content.footer.ctaTitlePart1} <em className="text-[#95d5b2] not-italic">{content.footer.ctaTitleHighlight}</em>
              </h3>
              <p className="text-xs text-white/70 max-w-md mx-auto mb-4">{content.footer.ctaDescription}</p>
              <button className="px-6 py-2 rounded-full text-xs font-bold bg-[#52b788] text-white">
                {content.footer.ctaButtonText}
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 text-xs">
              🌿 Closing CTA Banner Band (Hidden via CMS)
            </div>
          )}
        </div>

        <div className="bg-gray-100 px-6 py-3.5 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-200 cursor-pointer"
          >
            Close Preview
          </button>
          {hasUnsavedChanges && (
            <button
              onClick={() => {
                onClose();
                onSave();
              }}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#1b7a43] to-[#2d6a4f] text-white hover:scale-[1.02] cursor-pointer"
            >
              Save & Publish Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
