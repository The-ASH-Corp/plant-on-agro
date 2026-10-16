"use client";

import { PlantStep } from "@/types";

interface PlantFlowHeaderProps {
  step: PlantStep;
  onClose: () => void;
}

const STEP_LABELS = [
  "Tree",
  "Dedication",
  "Qty",
  "Location",
  "Details",
  "Payment",
  "Done",
];

export function PlantFlowHeader({ step, onClose }: PlantFlowHeaderProps) {
  return (
    <div
      className="sticky top-0 z-10 p-6 pb-4"
      style={{ background: "#fff", borderBottom: "1px solid #eaf2ec" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-[#173324] text-2xl"
        >
          {step === 7 ? "Your Journey Has Begun 🌱" : "Plant a Tree"}
        </h2>
        <button
          onClick={onClose}
          className="text-[#8a9b90] hover:text-[#173324] text-xl transition-colors cursor-pointer"
          aria-label="Close plant tree modal"
        >
          ✕
        </button>
      </div>

      {/* Progress Bar */}
      {step < 7 && (
        <div className="flex items-center gap-1">
          {STEP_LABELS.slice(0, 6).map((label, i) => (
            <div key={label} className="flex items-center gap-1 flex-1">
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background:
                      i + 1 < step
                        ? "#2d6a4f"
                        : i + 1 === step
                        ? "linear-gradient(135deg,#52b788,#2d6a4f)"
                        : "#eaf2ec",
                    color: i + 1 <= step ? "#fff" : "#8a9b90",
                  }}
                >
                  {i + 1 < step ? "✓" : i + 1}
                </div>
                <span className="text-[10px] text-[#8a9b90] mt-0.5 hidden sm:block">
                  {label}
                </span>
              </div>
              {i < 5 && (
                <div
                  className="flex-1 h-px mx-1"
                  style={{ background: i + 1 < step ? "#52b788" : "#e2ede7" }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
