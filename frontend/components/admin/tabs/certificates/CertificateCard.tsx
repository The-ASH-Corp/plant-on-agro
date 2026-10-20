"use client";

import { CertificateCardProps } from "./types";
import { CertificateStatusBadge } from "./CertificateStatusBadge";
import { CertificateHashChip } from "./CertificateHashChip";
import { TrashIcon, PencilIcon } from "@/components/ui";

export function CertificateCard({
  cert,
  isCopied,
  onCopyHash,
  onInspect,
  onEdit,
  onRevoke,
  onRegenerate,
  onDelete,
}: CertificateCardProps) {
  const isRevoked = cert.status === "Revoked";

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#e2eae5] shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group overflow-hidden">
      {/* Decorative Ornate Accent Trim */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-emerald-800 via-emerald-600 to-amber-600" />

      {/* Top Header: Serial & Status */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3 pt-1">
          <div>
            <span className="font-mono font-bold text-xs text-emerald-950 flex items-center gap-1.5">
              <span>📜</span>
              <span>{cert.certificateNumber}</span>
            </span>
            <div className="text-[10px] text-[#7a8c80] mt-0.5">
              Order: <span className="font-mono text-[#173324] font-semibold">{cert.orderRef}</span>
              {cert.treeTag && ` • Tag: ${cert.treeTag}`}
            </div>
          </div>
          <CertificateStatusBadge status={cert.status} size="sm" />
        </div>

        {/* Honoree & Dedication Box */}
        <div className="p-3.5 rounded-2xl bg-[#f8faf8] border border-[#e8efe9] mb-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-0.5">
            Presented In Honor Of
          </div>
          <div
            className="text-base font-bold text-[#173324] truncate"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {cert.recipientName}
          </div>
          <div className="text-xs text-[#55695d] mt-0.5 truncate">
            Sponsor: {cert.adopterName || "Eco Steward"}
          </div>

          {cert.dedicatedMessage && (
            <p className="text-[11px] text-[#425449] italic mt-2 line-clamp-2 border-t border-[#e2eae5] pt-1.5">
              &ldquo;{cert.dedicatedMessage}&rdquo;
            </p>
          )}
        </div>

        {/* Tree & Location Meta */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div className="p-2.5 rounded-xl bg-[#fcfdfc] border border-[#eef2ef]">
            <div className="text-[10px] text-[#7a8c80]">Botanical Specimen</div>
            <div className="font-semibold text-[#173324] truncate">
              {cert.treeSpecies || "Indigenous Agro Tree"}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#fcfdfc] border border-[#eef2ef]">
            <div className="text-[10px] text-[#7a8c80]">Sanctuary Reserve</div>
            <div className="font-semibold text-[#173324] truncate">
              {cert.reserveName || "Western Ghats, MH"}
            </div>
          </div>
        </div>

        {/* Cryptographic SHA-256 Hash */}
        <div className="mb-4">
          <div className="text-[10px] font-bold text-[#7a8c80] uppercase tracking-wider mb-1">
            Cryptographic SHA-256 Seal
          </div>
          <CertificateHashChip
            hash={cert.certificateHash}
            isCopied={isCopied}
            onCopy={() => cert.certificateHash && onCopyHash(cert.id, cert.certificateHash)}
            truncatedLength={20}
          />
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="pt-3 border-t border-[#f0f4f1] flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          {/* Inspect Deed */}
          <button
            onClick={() => onInspect(cert)}
            className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
          >
            <span>👁️</span>
            <span>Inspect</span>
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(cert)}
            title="Edit certificate details"
            className="p-1.5 rounded-xl border border-[#d8e3dc] hover:bg-[#f4f7f5] text-[#173324] transition-colors cursor-pointer"
          >
            <PencilIcon className="w-3.5 h-3.5" />
          </button>

          {/* Regenerate Hash */}
          <button
            onClick={() => onRegenerate(cert.id, cert.certificateNumber)}
            title="Regenerate cryptographic hash"
            className="p-1.5 rounded-xl border border-[#d8e3dc] hover:bg-amber-50 text-amber-800 transition-colors cursor-pointer"
          >
            ⚡
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Revoke */}
          {!isRevoked && (
            <button
              onClick={() => onRevoke(cert.id, cert.certificateNumber)}
              title="Revoke certificate"
              className="px-2 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
            >
              Revoke
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() => onDelete(cert.id, cert.certificateNumber)}
            title="Delete deed record"
            className="p-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 transition-colors cursor-pointer"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
