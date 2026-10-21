"use client";

interface CertificateHashChipProps {
  hash?: string;
  isCopied: boolean;
  onCopy: () => void;
  truncatedLength?: number;
}

export function CertificateHashChip({
  hash,
  isCopied,
  onCopy,
  truncatedLength = 16,
}: CertificateHashChipProps) {
  if (!hash) {
    return (
      <span className="text-[11px] text-[#8e9f94] italic font-mono">
        hash pending
      </span>
    );
  }

  const truncated =
    hash.length > truncatedLength
      ? `${hash.substring(0, truncatedLength / 2)}...${hash.substring(hash.length - truncatedLength / 2)}`
      : hash;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onCopy();
      }}
      title={`Click to copy full SHA-256 hash:\n${hash}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[11px] border transition-all cursor-pointer select-all group ${
        isCopied
          ? "bg-emerald-100 border-emerald-400 text-emerald-900 font-bold scale-102"
          : "bg-[#f4f7f5] hover:bg-[#eaf1ec] border-[#d8e3dc] text-[#2c4034]"
      }`}
    >
      <span className="text-[10px] text-emerald-700">🔒</span>
      <span className="truncate max-w-[140px] sm:max-w-none">{truncated}</span>
      <span
        className={`text-[10px] ml-1 transition-opacity ${
          isCopied
            ? "text-emerald-700 font-bold"
            : "text-[#7a8c80] opacity-0 group-hover:opacity-100"
        }`}
      >
        {isCopied ? "✓ Copied" : "📋"}
      </span>
    </button>
  );
}
