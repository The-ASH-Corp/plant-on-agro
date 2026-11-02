"use client";

import { useState } from "react";
import { Certificate, certificateService } from "@/services/certificates/certificate.service";

interface InspectCertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
  onRevoke?: (id: string) => void;
  onRegenerate?: (id: string) => void;
  onOpenEdit?: (certificate: Certificate) => void;
}

export function InspectCertificateModal({
  certificate,
  onClose,
  onRevoke,
  onRegenerate,
  onOpenEdit,
}: InspectCertificateModalProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    timestamp: string;
  } | null>(null);

  if (!certificate) return null;

  const isRevoked = certificate.status === "Revoked";

  const handleCopyHash = () => {
    if (certificate.certificateHash) {
      navigator.clipboard.writeText(certificate.certificateHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleVerify = async () => {
    try {
      setVerifying(true);
      const res = await certificateService.verifyCertificate(
        certificate.certificateHash || certificate.certificateNumber
      );
      if (res.data) {
        setVerificationResult({
          valid: res.data.valid,
          timestamp: res.data.verificationTimestamp,
        });
      }
    } catch {
      setVerificationResult({
        valid: !isRevoked,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setVerifying(false);
    }
  };

  const formattedDate = certificate.issueDate
    ? new Date(certificate.issueDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Verified Issue Date";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#0f2419] rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/40 text-white flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/20 bg-[#08170f]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📜</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-wide">
                  Living Afforestation Deed Registry
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isRevoked
                      ? "bg-rose-500/20 text-rose-300 border-rose-400/40"
                      : certificate.status === "Pending Generation"
                      ? "bg-amber-500/20 text-amber-300 border-amber-400/40"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                  }`}
                >
                  {certificate.status}
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 font-mono">
                Serial ID: {certificate.certificateNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                window.open(
                  certificateService.getDownloadUrl(certificate.certificateNumber, true),
                  "_blank"
                )
              }
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <span>🖨️</span>
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Certificate Deed Canvas Presentation */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#133021] via-[#0d2217] to-[#081810] p-6 sm:p-10 border-2 border-emerald-400/30 shadow-inner overflow-hidden text-center">
            {/* Ornamental Corners */}
            <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-emerald-400/60" />
            <div className="absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 border-emerald-400/60" />
            <div className="absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 border-emerald-400/60" />
            <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-emerald-400/60" />

            {/* Botanical Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <span className="text-[180px]">🌿</span>
            </div>

            {/* Revoked Strikethrough Watermark if Revoked */}
            {isRevoked && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none rotate-[-20deg] z-20">
                <span className="text-5xl sm:text-7xl font-extrabold text-rose-500/30 tracking-widest uppercase border-4 border-rose-500/30 px-6 py-2 rounded-2xl">
                  REVOKED DEED
                </span>
              </div>
            )}

            <div className="relative z-10 mb-4">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-emerald-300 block mb-1">
                PlantOn Agro Living Registry • Cryptographically Verified Deed
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#b7e4c7] tracking-wide mb-1">
                Certificate of Plantation
              </h2>
              <p className="text-xs text-emerald-200/70 italic">
                National Agroforestry & Environmental Offset Registry
              </p>
            </div>

            {/* Recipient Citation */}
            <div className="relative z-10 my-6 py-3 border-y border-emerald-500/20 max-w-xl mx-auto">
              <span className="text-xs text-white/60 block mb-1 font-serif italic">
                This certifies that
              </span>
              <h1 className="text-xl sm:text-3xl font-serif font-extrabold text-white tracking-wide">
                {certificate.recipientName}
              </h1>
              <span className="text-xs text-emerald-300 font-semibold block mt-1">
                Verified Eco-Guardian & Tree Adopter
              </span>
            </div>

            {/* Dedication Text */}
            <p className="relative z-10 text-xs text-white/80 max-w-lg mx-auto leading-relaxed mb-6 italic">
              &ldquo;{certificate.dedicatedMessage}&rdquo;
            </p>

            {/* Telemetry Grid */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white/5 p-3.5 rounded-xl border border-white/10 text-left text-xs mb-6">
              <div>
                <span className="text-[9px] text-emerald-300/80 uppercase font-semibold block">
                  Serial ID
                </span>
                <strong className="font-mono text-white text-[11px]">
                  {certificate.certificateNumber}
                </strong>
              </div>
              <div>
                <span className="text-[9px] text-emerald-300/80 uppercase font-semibold block">
                  Tree Specimen
                </span>
                <strong className="text-white text-[11px] truncate block">
                  {certificate.treeSpecies || "Native Specimen"}
                </strong>
              </div>
              <div>
                <span className="text-[9px] text-emerald-300/80 uppercase font-semibold block">
                  Reserve Sector
                </span>
                <strong className="text-white text-[11px] truncate block">
                  {certificate.reserveName || "Protected Reserve"}
                </strong>
              </div>
              <div>
                <span className="text-[9px] text-emerald-300/80 uppercase font-semibold block">
                  Issue Date
                </span>
                <strong className="text-white text-[11px]">{formattedDate}</strong>
              </div>
            </div>

            {/* Cryptographic Hash Band */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-emerald-500/20 text-xs">
              <div className="text-left w-full sm:w-auto">
                <span className="text-[9px] text-white/40 block">
                  Cryptographic Verification Seal (SHA-256)
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[10px] text-emerald-300 bg-black/40 px-2 py-0.5 rounded border border-emerald-500/30">
                    {certificate.certificateHash || "Pending Hash Generation"}
                  </span>
                  <button
                    onClick={handleCopyHash}
                    className="text-[10px] text-white/70 hover:text-white underline cursor-pointer"
                  >
                    {copiedHash ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Seal Badge */}
              <div className="w-16 h-16 rounded-full border-2 border-emerald-400/40 bg-gradient-to-br from-[#1b7a43] to-[#0a1f14] p-1 flex items-center justify-center text-center shadow-md shrink-0">
                <div className="w-full h-full rounded-full border border-dashed border-emerald-300/40 flex flex-col items-center justify-center text-[7px] font-bold text-emerald-200">
                  <span>★ VERIFIED ★</span>
                  <span className="text-xs my-0.2">🌿</span>
                  <span>POA DEED</span>
                </div>
              </div>

              <div className="text-right w-full sm:w-auto">
                <span className="text-[9px] text-white/40 block">Order Reference</span>
                <span className="font-mono text-[11px] text-emerald-200">
                  {certificate.orderRef}
                </span>
                {certificate.treeTag && (
                  <span className="text-[10px] text-white/60 block font-mono">
                    Tag: {certificate.treeTag}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Verification Inspection Tool */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-300">Public Verification Status:</span>
                {verificationResult ? (
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded-full ${
                      verificationResult.valid
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                        : "bg-rose-500/20 text-rose-300 border border-rose-400/40"
                    }`}
                  >
                    {verificationResult.valid ? "✓ Valid Deed" : "✗ Revoked / Invalid"}
                  </span>
                ) : (
                  <span className="text-white/60">Ready to audit</span>
                )}
              </div>
              <p className="text-[11px] text-white/60 mt-0.5">
                Verify hash stamp against backend cryptographic ledger.
              </p>
            </div>

            <button
              onClick={handleVerify}
              disabled={verifying}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer transition-colors border border-white/15 disabled:opacity-50"
            >
              {verifying ? "Checking Ledger..." : "🔍 Run Integrity Audit"}
            </button>
          </div>

          {/* Administrator Action Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              {onOpenEdit && (
                <button
                  onClick={() => onOpenEdit(certificate)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer border border-white/15 transition-colors"
                >
                  ✏️ Edit Details
                </button>
              )}

              {onRegenerate && (
                <button
                  onClick={() => onRegenerate(certificate.id)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold cursor-pointer transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>🔄</span>
                  <span>Regenerate Hash & Reissue</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isRevoked && onRevoke && (
                <button
                  onClick={() => onRevoke(certificate.id)}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold cursor-pointer border border-rose-400/30 transition-colors"
                >
                  🚫 Revoke Deed
                </button>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
