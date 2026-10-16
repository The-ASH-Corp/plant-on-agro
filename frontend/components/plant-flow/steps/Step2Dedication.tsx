"use client";

import { Plan } from "@/types";

interface Step2DedicationProps {
  selectedPlan: string | null;
  onSelectPlan: (planId: string) => void;
  plans?: Plan[];
  loading?: boolean;
}

export function Step2Dedication({
  selectedPlan,
  onSelectPlan,
  plans = [],
  loading = false,
}: Step2DedicationProps) {
  if (loading) {
    return (
      <div>
        <p className="text-[#4a6557] font-medium mb-1">
          Fetching dedication packages from database...
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[#eaf2ec] animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-emerald-50 rounded w-2/3"></div>
                <div className="h-3 bg-emerald-50 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[#4a6557] font-medium mb-1">
        Choose your dedication or occasion package.
      </p>
      <p className="text-xs text-[#73877b] mb-4">
        All adoptions are a single-time lifetime payment with zero renewal fees.
      </p>
      {plans.length === 0 ? (
        <div className="text-center py-10 bg-[#f9fbf9] rounded-2xl border border-[#d4e9dd]">
          <span className="text-3xl">🕊️</span>
          <p className="text-sm font-semibold text-[#173324] mt-2">No adoption plans available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {plans.map((p) => (
            <button
              key={p.id}
              id={`plan-option-${p.id}`}
              onClick={() => onSelectPlan(p.id)}
              className="flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 cursor-pointer"
              style={{
                border:
                  selectedPlan === p.id
                    ? "2px solid #52b788"
                    : "2px solid #eaf2ec",
                background: selectedPlan === p.id ? "#f0faf4" : "#fff",
              }}
            >
              <span className="text-2xl">{p.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-[#173324] text-sm">{p.label}</div>
                <div className="text-[#4a6557] text-xs">{p.desc}</div>
              </div>
              {p.price !== 0 && (
                <span
                  className="text-xs font-semibold"
                  style={{ color: p.price > 0 ? "#e06b3b" : "#52b788" }}
                >
                  {p.price > 0 ? `+₹${p.price}` : `-₹${Math.abs(p.price)}`}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
