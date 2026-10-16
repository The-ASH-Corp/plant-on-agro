"use client";

import { PlantStep } from "@/types";

interface PlantFlowFooterProps {
  step: PlantStep;
  canNext: boolean;
  isProcessing: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function PlantFlowFooter({
  step,
  canNext,
  isProcessing,
  onBack,
  onNext,
}: PlantFlowFooterProps) {
  if (step >= 7) return null;

  return (
    <div
      className="sticky bottom-0 p-6 pt-4 flex gap-3"
      style={{ background: "#fff", borderTop: "1px solid #eaf2ec" }}
    >
      {step > 1 && (
        <button
          id="btn-back-step"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer"
          style={{ background: "#eaf2ec", color: "#4a6557" }}
        >
          Back
        </button>
      )}
      <button
        onClick={onNext}
        id={step === 6 ? "btn-complete-sandbox-order" : "btn-continue-step"}
        disabled={!canNext || isProcessing}
        className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
        style={{
          background: canNext
            ? "linear-gradient(135deg,#52b788,#2d6a4f)"
            : "#ccc",
        }}
      >
        {isProcessing ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span>Simulating Test Verification...</span>
          </>
        ) : step === 6 ? (
          "Complete Order (Sandbox Test)"
        ) : (
          "Continue"
        )}
      </button>
    </div>
  );
}
