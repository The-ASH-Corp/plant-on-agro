"use client";

import { Tree, Plan } from "@/types";

interface Step6PaymentProps {
  selectedTree: Tree | null;
  selectedPlanData: Plan | undefined;
  qty: number;
  location: string | null;
  total: number;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
}

const PAYMENT_METHODS = [
  {
    id: "sandbox",
    label: "⚡ Instant Test Simulation",
    desc: "1-Click sandbox checkout • 100% Free test",
  },
  {
    id: "upi",
    label: "📱 UPI / QR (Simulated)",
    desc: "GPay, PhonePe, Paytm simulation",
  },
  {
    id: "card",
    label: "💳 Card (Simulated)",
    desc: "Visa, Mastercard sandbox gateway",
  },
  {
    id: "netbanking",
    label: "🏦 Net Banking (Simulated)",
    desc: "Instant sandbox bank verification",
  },
];

export function Step6Payment({
  selectedTree,
  selectedPlanData,
  qty,
  location,
  total,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}: Step6PaymentProps) {
  return (
    <div>
      <div
        className="p-5 rounded-2xl mb-6"
        style={{ background: "#f0faf4", border: "1px solid #d4ede1" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#173324]">Order Summary</h3>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-full">
            Lifetime Single-Time Payment
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-[#4a6557]">
            <span>Tree Species</span>
            <span className="text-[#173324] font-medium">{selectedTree?.name}</span>
          </div>
          <div className="flex justify-between text-[#4a6557]">
            <span>Dedication Tier</span>
            <span className="text-[#173324] font-medium">
              {selectedPlanData?.label}
            </span>
          </div>
          <div className="flex justify-between text-[#4a6557]">
            <span>Quantity</span>
            <span className="text-[#173324] font-medium">{qty} trees</span>
          </div>
          <div className="flex justify-between text-[#4a6557]">
            <span>Reserve Location</span>
            <span className="text-[#173324] font-medium text-right max-w-[60%]">
              {location}
            </span>
          </div>
          <div className="flex justify-between text-[#4a6557]">
            <span>Billing Cycle</span>
            <span className="text-emerald-700 font-bold">
              None (100% Lifetime Single-Time)
            </span>
          </div>
          <div
            className="border-t pt-2 mt-2 flex justify-between font-bold"
            style={{ borderColor: "#d4ede1" }}
          >
            <span className="text-[#173324]">Total Payable</span>
            <span className="text-[#2d6a4f] text-lg">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-white/90 border border-emerald-200 text-xs text-[#2d6a4f] flex items-start gap-2.5">
          <span className="text-base shrink-0">🛡️</span>
          <div className="leading-relaxed">
            <span className="font-bold text-[#173324]">
              One-Time Single Payment Guarantee:
            </span>{" "}
            No recurring subscriptions, annual renewal charges, or hidden maintenance
            fees. Covers sapling plantation, lifelong forestry care, drone telemetry,
            and permanent digital deed.
          </div>
        </div>
      </div>

      <p className="text-[#4a6557] text-sm mb-2 font-medium">
        Select Payment & Verification Method:
      </p>

      {/* Zero-Payment Sandbox Test Callout */}
      <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-[#1e4433] flex items-center gap-3 shadow-xs">
        <span className="text-2xl shrink-0">🧪</span>
        <div className="leading-snug">
          <span className="font-bold text-[#173324] block">
            Zero-Payment Test Sandbox Active
          </span>
          <span className="text-[11px] text-[#4a6557]">
            No real credit card or bank credentials needed. You can test complete
            tree adoption, instant deed generation, arborist field tagging, and live
            dashboard integration right now!
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.id}
            id={`pay-method-${m.id}`}
            type="button"
            onClick={() => setSelectedPaymentMethod(m.id)}
            className="p-3.5 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between"
            style={{
              border:
                selectedPaymentMethod === m.id
                  ? "2px solid #2d6a4f"
                  : "2px solid #eaf2ec",
              background: selectedPaymentMethod === m.id ? "#f0faf4" : "#fff",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#173324] text-xs">{m.label}</span>
              {selectedPaymentMethod === m.id && (
                <span className="w-5 h-5 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#55695d] mt-1">{m.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
