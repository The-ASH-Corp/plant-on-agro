"use client";

import { Certificate } from "@/services/certificates/certificate.service";

interface DeedPreviewCanvasProps {
  certificate: Certificate;
}

export function DeedPreviewCanvas({ certificate }: DeedPreviewCanvasProps) {
  const isRevoked = certificate.status === "Revoked";

  return (
    <div
      id="certificate-print-area"
      className="bg-[#fcfaf4] p-8 sm:p-12 rounded-3xl border-8 border-double border-[#1b4332] relative shadow-inner overflow-hidden select-text text-[#1b4332]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.03) 0%, rgba(20, 83, 45, 0.06) 100%)",
      }}
    >
      {/* Decorative Ornate Corner Flourishes */}
      <div className="absolute top-2 left-2 text-[#2d6a4f] text-2xl opacity-60">
        ❧
      </div>
      <div className="absolute top-2 right-2 text-[#2d6a4f] text-2xl opacity-60 scale-x-[-1]">
        ❧
      </div>
      <div className="absolute bottom-2 left-2 text-[#2d6a4f] text-2xl opacity-60 scale-y-[-1]">
        ❧
      </div>
      <div className="absolute bottom-2 right-2 text-[#2d6a4f] text-2xl opacity-60 scale-[-1]">
        ❧
      </div>

      {/* Revoked Watermark Overlay */}
      {isRevoked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-rose-600/20 text-6xl sm:text-8xl font-black uppercase tracking-widest -rotate-25 border-8 border-rose-600/20 py-4 px-12 rounded-3xl">
            REVOKED
          </div>
        </div>
      )}

      {/* Header Organization Branding */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-300/60 text-[10px] uppercase font-bold tracking-widest text-[#1b4332] mb-3">
          🌱 PlantOn Agro Bio-Ledger Deed
        </div>
        <h2
          className="text-2xl sm:text-4xl font-extrabold uppercase tracking-wide text-[#12372a]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Certificate of Green Stewardship
        </h2>
        <p className="text-xs sm:text-sm text-[#40534c] tracking-wider uppercase mt-1">
          Cryptographic Title of Living Botanical Adoption
        </p>
      </div>

      {/* Recipient Honor Section */}
      <div className="text-center my-6 space-y-2">
        <div className="text-xs uppercase tracking-widest text-[#527853] font-semibold">
          This deed proudly certifies that
        </div>
        <div
          className="text-2xl sm:text-4xl font-extrabold text-[#0d2818] tracking-tight pb-1 border-b border-[#2d6a4f]/30 inline-block px-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {certificate.recipientName}
        </div>
        <div className="text-xs text-[#40534c] pt-2">
          has sponsored and protected perpetual living canopy via{" "}
          <strong className="text-[#12372a]">
            {certificate.adopterName || "Eco Champion"}
          </strong>
        </div>
      </div>

      {/* Dedication Message */}
      {certificate.dedicatedMessage && (
        <div className="my-6 px-6 py-4 rounded-2xl bg-white/70 border border-emerald-900/10 text-center max-w-xl mx-auto shadow-xs">
          <p className="text-xs sm:text-sm text-[#2d6a4f] italic font-serif leading-relaxed">
            &ldquo;{certificate.dedicatedMessage}&rdquo;
          </p>
        </div>
      )}

      {/* Botanical Specimen & Location Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto my-6 text-xs bg-white/60 p-4 rounded-2xl border border-emerald-900/10">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#527853] font-bold block">
            Botanical Species
          </span>
          <span className="font-semibold text-sm text-[#12372a]">
            {certificate.treeSpecies || "Native Agroforestry Specimen"}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#527853] font-bold block">
            Protected Sanctuary Reserve
          </span>
          <span className="font-semibold text-sm text-[#12372a]">
            {certificate.reserveName || "Western Ghats, Maharashtra"}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#527853] font-bold block">
            Adoption Order Ref
          </span>
          <span className="font-mono text-xs text-[#12372a]">
            {certificate.orderRef}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#527853] font-bold block">
            Living Sapling Tag ID
          </span>
          <span className="font-mono text-xs text-[#12372a]">
            {certificate.treeTag || "POA-LIVE-ROOT"}
          </span>
        </div>
      </div>

      {/* SHA-256 Ledger Footprint & Holographic Seal */}
      <div className="pt-6 border-t-2 border-[#1b4332]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs">🔐</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#1b4332]">
              Cryptographic Integrity Proof (SHA-256)
            </span>
          </div>
          <div className="font-mono text-[10px] sm:text-[11px] text-[#2d6a4f] break-all bg-emerald-50/80 p-2 rounded-xl border border-emerald-200/60 max-w-md">
            {certificate.certificateHash || "Pending Hash Generation"}
          </div>
          <div className="text-[9px] text-[#527853] mt-1">
            Serial Ledger ID:{" "}
            <strong className="font-mono text-[#1b4332]">
              {certificate.certificateNumber}
            </strong>{" "}
            • Issued:{" "}
            {certificate.issueDate
              ? new Date(certificate.issueDate).toLocaleDateString("en-IN", {
                  dateStyle: "long",
                })
              : "Date pending"}
          </div>
        </div>

        {/* Verification Hologram Seal */}
        <div className="w-20 h-20 rounded-full border-4 border-double border-emerald-800 bg-linear-to-tr from-emerald-100 via-amber-50 to-emerald-200 flex flex-col items-center justify-center text-center p-1 shadow-md shrink-0">
          <span className="text-base">🌳</span>
          <span className="text-[8px] font-black uppercase tracking-wider text-[#12372a]">
            Certified
          </span>
          <span className="text-[7px] text-emerald-800 font-mono">SEAL</span>
        </div>
      </div>
    </div>
  );
}
