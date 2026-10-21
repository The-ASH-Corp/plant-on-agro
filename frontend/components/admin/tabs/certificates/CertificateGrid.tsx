"use client";

import { CertificateGridProps } from "./types";
import { CertificateCard } from "./CertificateCard";

export function CertificateGrid({
  certificates,
  copiedHashId,
  onCopyHash,
  onInspect,
  onEdit,
  onRevoke,
  onRegenerate,
  onDelete,
  isLoading = false,
}: CertificateGridProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-[#e2eae5] text-center text-xs text-[#7a8c80]">
        <div className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading cryptographic certificates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {certificates.map((cert) => (
        <CertificateCard
          key={cert.id}
          cert={cert}
          isCopied={copiedHashId === cert.id}
          onCopyHash={onCopyHash}
          onInspect={onInspect}
          onEdit={onEdit}
          onRevoke={onRevoke}
          onRegenerate={onRegenerate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
