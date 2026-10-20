"use client";

import { CertificateTableProps } from "./types";
import { CertificateTableRow } from "./CertificateTableRow";

export function CertificateTable({
  certificates,
  copiedHashId,
  onCopyHash,
  onInspect,
  onEdit,
  onRevoke,
  onRegenerate,
  onDelete,
  isLoading = false,
}: CertificateTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#e2eae5] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f4f7f5] text-[11px] font-bold text-[#44584c] uppercase tracking-wider border-b border-[#e2eae5]">
              <th className="py-3.5 px-4">Certificate Serial</th>
              <th className="py-3.5 px-4">Order Ref / Tag</th>
              <th className="py-3.5 px-4">Honoree & Adopter</th>
              <th className="py-3.5 px-4">Tree & Reserve</th>
              <th className="py-3.5 px-4">Cryptographic Hash</th>
              <th className="py-3.5 px-4">Deed Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs text-[#7a8c80]">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>Querying cryptographic ledger...</span>
                  </div>
                </td>
              </tr>
            ) : (
              certificates.map((cert, index) => (
                <CertificateTableRow
                  key={cert.id}
                  cert={cert}
                  index={index}
                  isCopied={copiedHashId === cert.id}
                  onCopyHash={onCopyHash}
                  onInspect={onInspect}
                  onEdit={onEdit}
                  onRevoke={onRevoke}
                  onRegenerate={onRegenerate}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
