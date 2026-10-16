import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "info" | "neutral" | "purple" | "danger";
  size?: "xs" | "sm" | "md";
  className?: string;
  dot?: boolean;
}

const VARIANT_STYLES: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-800 border-emerald-300",
  warning: "bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-400/40",
  info: "bg-sky-50 text-sky-800 border-sky-300",
  purple: "bg-purple-50 text-purple-800 border-purple-300",
  danger: "bg-rose-50 text-rose-800 border-rose-300",
  neutral: "bg-gray-50 text-gray-700 border-gray-200",
};

const DOT_STYLES: Record<string, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500 animate-ping",
  info: "bg-sky-500",
  purple: "bg-purple-500",
  danger: "bg-rose-500",
  neutral: "bg-gray-400",
};

const SIZE_STYLES: Record<string, string> = {
  xs: "text-[9px] px-1.5 py-0.2",
  sm: "text-[10px] px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
};

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className = "",
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold border ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT_STYLES[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
