"use client";

interface AdminToastProps {
  message: string | null;
}

export function AdminToast({ message }: AdminToastProps) {
  if (!message) return null;

  return (
    <div className="fixed top-18 right-6 z-50 bg-[#173324] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-emerald-400/40 flex items-center gap-2 animate-bounce">
      <span>✅</span>
      <span>{message}</span>
    </div>
  );
}
