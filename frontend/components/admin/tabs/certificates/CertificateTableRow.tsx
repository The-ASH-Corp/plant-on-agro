"use client";

import { CertificateTableRowProps } from "./types";
import { CertificateStatusBadge } from "./CertificateStatusBadge";
import { CertificateHashChip } from "./CertificateHashChip";
import { TrashIcon, PencilIcon } from "@/components/ui";

export function CertificateTableRow({
  cert,
  index,
  isCopied,
  onCopyHash,
  onInspect,
  onEdit,
  onRevoke,
  onRegenerate,
  onDelete,
}: CertificateTableRowProps) {
  const isRevoked = cert.status === "Revoked";

  return (
    <tr
      className={`border-b border-[#f0f4f1] hover:bg-[#fbfdfc] transition-colors ${
        index % 2 === 0 ? "bg-white" : "bg-[#fcfdfc]"
      }`}
    >
      {/* 1. Certificate Serial & Date */}
      <td className="py-3.5 px-4">
        <div className="flex flex-col">
          <button
            onClick={() => onInspect(cert)}
            className="text-left font-mono font-bold text-xs text-emerald-900 hover:text-emerald-700 hover:underline cursor-pointer flex items-center gap-1.5"
          >
            <span>📜</span>
            <span>{cert.certificateNumber}</span>
          </button>
          <span className="text-[10px] text-[#7a8c80] mt-0.5">
            {cert.issueDate
              ? new Date(cert.issueDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Date pending"}
          </span>
        </div>
      </td>

      {/* 2. Order & Tree Tag */}
      <td className="py-3.5 px-4">
        <div className="flex flex-col">
          <span className="font-mono text-xs font-semibold text-[#173324]">
            {cert.orderRef}
          </span>
          {cert.treeTag && (
            <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 w-fit mt-1">
              🏷️ {cert.treeTag}
            </span>
          )}
        </div>
      </td>

      {/* 3. Honoree & Adopter */}
      <td className="py-3.5 px-4">
        <div className="flex flex-col">
          <span className="font-bold text-xs text-[#173324]">
            {cert.recipientName}
          </span>
          <span className="text-[11px] text-[#55695d]">
            By {cert.adopterName || "Eco Steward"}
          </span>
        </div>
      </td>

      {/* 4. Tree Species & Reserve */}
      <td className="py-3.5 px-4">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[#224430]">
            {cert.treeSpecies || "Native Agro Specimen"}
          </span>
          <span className="text-[10px] text-[#7a8c80] flex items-center gap-1 mt-0.5">
            <span>📍</span>
            <span>{cert.reserveName || "Western Ghats, MH"}</span>
          </span>
        </div>
      </td>

      {/* 5. Cryptographic Hash */}
      <td className="py-3.5 px-4">
        <CertificateHashChip
          hash={cert.certificateHash}
          isCopied={isCopied}
          onCopy={() => cert.certificateHash && onCopyHash(cert.id, cert.certificateHash)}
        />
      </td>

      {/* 6. Status */}
      <td className="py-3.5 px-4">
        <CertificateStatusBadge status={cert.status} size="sm" />
      </td>

      {/* 7. Actions */}
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {/* Inspect Deed */}
          <button
            onClick={() => onInspect(cert)}
            title="Inspect deed certificate"
            className="p-1.5 rounded-lg bg-[#f0f5f2] hover:bg-emerald-100 text-emerald-800 transition-colors cursor-pointer text-xs"
          >
            👁️
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(cert)}
            title="Edit deed metadata"
            className="p-1.5 rounded-lg bg-[#f0f5f2] hover:bg-emerald-100 text-[#173324] transition-colors cursor-pointer text-xs"
          >
            <PencilIcon className="w-3.5 h-3.5" />
          </button>

          {/* Regenerate Hash */}
          <button
            onClick={() => onRegenerate(cert.id, cert.certificateNumber)}
            title="Regenerate cryptographic SHA-256 hash"
            className="p-1.5 rounded-lg bg-[#f0f5f2] hover:bg-amber-100 text-amber-800 transition-colors cursor-pointer text-xs"
          >
            ⚡
          </button>

          {/* Revoke */}
          {!isRevoked && (
            <button
              onClick={() => onRevoke(cert.id, cert.certificateNumber)}
              title="Revoke / Void this certificate deed"
              className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-200 transition-colors cursor-pointer"
            >
              Revoke
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() => onDelete(cert.id, cert.certificateNumber)}
            title="Delete certificate deed"
            className="p-1.5 rounded-lg bg-[#fdf2f2] hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer text-xs"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
