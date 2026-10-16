"use client";

import { PLANS } from "@/data/mockData";

interface Step2DedicationProps {
  selectedPlan: string | null;
  onSelectPlan: (planId: string) => void;
}

export function Step2Dedication({
  selectedPlan,
  onSelectPlan,
}: Step2DedicationProps) {
  return (
    <div>
      <p className="text-[#4a6557] font-medium mb-1">
        Choose your dedication or occasion package.
      </p>
      <p className="text-xs text-[#73877b] mb-4">
        All adoptions are a single-time lifetime payment with zero renewal fees.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PLANS.map((p) => (
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
    </div>
  );
}
