import { CertificateSectionContent } from "@/services/landing-page/landing-page.service";

interface CertificateSectionProps {
  content?: CertificateSectionContent;
}

export function CertificateSection({ content }: CertificateSectionProps) {
  const tagline = content?.tagline || "Your Legacy";
  const titlePart1 = content?.titlePart1 || "A Certificate That";
  const titleHighlight = content?.titleHighlight || "Actually Grows";
  const description =
    content?.description ||
    "Every tree you plant comes with a premium digital certificate — personalised, shareable, and backed by real plantation data.";

  const features =
    content?.features && content.features.length > 0
      ? content.features
      : [
          "Your name on every certificate",
          "GPS coordinates of your tree",
          "Linked to live growth tracking",
          "Shareable on LinkedIn & social",
        ];

  const recipient = content?.sampleRecipientName || "Priya Sharma";
  const treeName = content?.sampleTreeName || "Indian Mango";
  const treeId = content?.sampleTreeId || "POA-MG-2847";
  const location = content?.sampleLocation || "Nashik, MH";
  const date = content?.sampleDate || "14 Sep 2026";
  const quote =
    content?.sampleQuote ||
    "has planted an Indian Mango tree through PlantOn agro, contributing to a greener, healthier planet.";

  return (
    <section className="py-28" style={{ background: "#fff" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#2d6a4f] text-sm font-semibold tracking-widest uppercase mb-3">
              {tagline}
            </p>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-[#173324] text-4xl md:text-5xl mb-6"
            >
              {titlePart1}
              <br />
              <em className="not-italic text-[#2d6a4f]">{titleHighlight}</em>
            </h2>
            <p className="text-[#4a6557] text-lg leading-relaxed mb-8">
              {description}
            </p>
            <div className="space-y-3">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-3 text-[#4a6557]">
                  <div className="w-5 h-5 rounded-full bg-[#d8f3e8] flex items-center justify-center text-[#2d6a4f] text-xs shrink-0">
                    ✓
                  </div>
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certificate mockup */}
          <div className="relative">
            <div
              className="rounded-3xl p-8 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #173324 0%, #1e4433 100%)",
                boxShadow: "0 24px 64px rgba(23,51,36,0.3)",
              }}
            >
              {/* Decorative corner */}
              <div
                className="absolute top-0 right-0 w-40 h-40 opacity-10"
                style={{
                  background:
                    "radial-gradient(circle at 100% 0%, #52b788, transparent)",
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-32 h-32 opacity-10"
                style={{
                  background:
                    "radial-gradient(circle at 0% 100%, #95d5b2, transparent)",
                }}
              />

              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#52b788] to-[#2d6a4f] flex items-center justify-center text-xs">
                    🌿
                  </div>
                  <span
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-white/80 text-sm"
                  >
                    PlantOn agro
                  </span>
                </div>
                <div className="text-[#95d5b2] text-xs tracking-widest uppercase mb-3">
                  Certificate of Plantation
                </div>
                <h3
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-white text-2xl mb-2"
                >
                  {recipient}
                </h3>
                <p className="text-white/60 text-xs mb-6 leading-relaxed">
                  {quote}
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: "Tree", value: treeName },
                    { label: "Tree ID", value: treeId },
                    { label: "Location", value: location },
                    { label: "Date", value: date },
                  ].map((d) => (
                    <div
                      key={d.label}
                      className="p-3 rounded-xl text-left"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <div className="text-[10px] text-[#52b788] uppercase tracking-wider mb-0.5">
                        {d.label}
                      </div>
                      <div className="text-white text-xs font-semibold">
                        {d.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white"
                    style={{
                      background: "rgba(82,183,136,0.25)",
                      border: "1px solid rgba(82,183,136,0.4)",
                    }}
                  >
                    Download
                  </button>
                  <button
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white"
                    style={{
                      background: "linear-gradient(135deg,#52b788,#2d6a4f)",
                    }}
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
