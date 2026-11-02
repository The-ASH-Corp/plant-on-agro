"use client";

import { CertificateStatus } from "@/services/certificates/certificate.service";

interface CertificateStatusBadgeProps {
  status: CertificateStatus | string;
  size?: "sm" | "md";
}

export function CertificateStatusBadge({
  status,
  size = "md",
}: CertificateStatusBadgeProps) {
  const isSm = size === "sm";

  switch (status) {
    case "Issued":
      return (
        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs ${
            isSm ? "text-[10px] px-2.5 py-0.5" : "text-xs px-2.5 py-1"
          }`}
        >
          <span>✓</span>
          <span>Valid Deed</span>
        </span>
      );
    case "Pending Generation":
      return (
        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200 shadow-xs ${
            isSm ? "text-[10px] px-2.5 py-0.5" : "text-xs px-2.5 py-1"
          }`}
        >
          <span>⏳</span>
          <span>Pending Gen</span>
        </span>
      );
    case "Revoked":
      return (
        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 font-bold rounded-full bg-rose-50 text-rose-800 border border-rose-200 shadow-xs ${
            isSm ? "text-[10px] px-2.5 py-0.5" : "text-xs px-2.5 py-1"
          }`}
        >
          <span>🚫</span>
          <span>Revoked</span>
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 font-bold rounded-full bg-gray-50 text-gray-700 border border-gray-200 ${
            isSm ? "text-[10px] px-2.5 py-0.5" : "text-xs px-2.5 py-1"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
          <span>{status}</span>
        </span>
      );
  }
}
