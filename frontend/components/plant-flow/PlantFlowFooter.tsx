"use client";

import { PlantStep } from "@/types";

interface PlantFlowFooterProps {
  step: PlantStep;
  canNext: boolean;
  isProcessing: boolean;
  total?: number;
  waitlistMode?: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function PlantFlowFooter({
  step,
  canNext,
  isProcessing,
  total,
  waitlistMode = false,
  onBack,
  onNext,
}: PlantFlowFooterProps) {
  if (step >= 6) return null;

  const isWaitlistSubmitStep = waitlistMode && step === 4;
  const isPaymentSubmitStep = !waitlistMode && step === 5;

  return (
    <div
      className="sticky bottom-0 p-6 pt-4 flex gap-3"
      style={{ background: "#fff", borderTop: "1px solid #eaf2ec" }}
    >
      {step > 1 && (
        <button
          id="btn-back-step"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer disabled:opacity-50"
          style={{ background: "#eaf2ec", color: "#4a6557" }}
        >
          Back
        </button>
      )}
      <button
        onClick={onNext}
        id={
          isWaitlistSubmitStep || isPaymentSubmitStep
            ? "btn-complete-order"
            : "btn-continue-step"
        }
        disabled={!canNext || isProcessing}
        className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
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
            <span>
              {isWaitlistSubmitStep
                ? "Adding to Waitlist..."
                : isPaymentSubmitStep
                ? "Connecting to Razorpay..."
                : "Processing..."}
            </span>
          </>
        ) : isWaitlistSubmitStep ? (
          "Join Waitlist & Reserve Spot 🌱"
        ) : isPaymentSubmitStep ? (
          total !== undefined ? (
            `Proceed to Pay ₹${total.toLocaleString("en-IN")} with Razorpay 💳`
          ) : (
            "Proceed to Pay with Razorpay 💳"
          )
        ) : (
          "Continue"
        )}
      </button>
    </div>
  );
}
