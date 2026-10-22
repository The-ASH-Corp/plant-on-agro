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
    id: "razorpay",
    label: "💳 Razorpay Official Checkout",
    desc: "UPI (GPay / PhonePe / Paytm), Cards, NetBanking & Wallets",
    badge: "Official & Recommended",
    highlight: true,
  },
  {
    id: "razorpay_upi",
    label: "📱 Direct UPI / QR Code",
    desc: "Instant QR scan via Google Pay, PhonePe, Paytm, BHIM",
    badge: "Instant 0% Fee",
    highlight: false,
  },
  {
    id: "razorpay_card",
    label: "💳 Credit / Debit Cards",
    desc: "Visa, MasterCard, RuPay, Amex • 256-Bit SSL Encrypted",
    badge: "Fast & Verified",
    highlight: false,
  },
  {
    id: "sandbox",
    label: "⚡ Sandbox Simulation Test",
    desc: "1-Click test checkout • Free demo mode for quick testing",
    badge: "Developer Test",
    highlight: false,
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
      {/* Order Summary Card */}
      <div
        className="p-5 rounded-2xl mb-6 shadow-2xs"
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
            <span>Dedication Package</span>
            <span className="text-[#173324] font-medium">
              {selectedPlanData?.label || "General Dedication"}
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
            <span className="text-[#2d6a4f] text-xl font-extrabold">
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
            fees. Covers sapling plantation, lifelong forestry care, verified GPS mapping,
            and permanent digital deed.
          </div>
        </div>
      </div>

      <p className="text-[#4a6557] text-sm mb-2 font-medium">
        Select Payment & Verification Method:
      </p>

      {/* Razorpay Trust Banner */}
      <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/60 border border-emerald-200/80 text-xs text-[#1e4433] flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🔒</span>
          <div>
            <span className="font-bold text-[#173324] block text-xs">
              Razorpay Secured Gateway Active
            </span>
            <span className="text-[11px] text-[#4a6557]">
              256-bit Bank Grade SSL Encryption • RBI Authorized
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-md bg-[#2d6a4f] text-white text-[10px] font-bold uppercase tracking-wider">
          Razorpay
        </span>
      </div>

      {/* Payment Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {PAYMENT_METHODS.map((m) => {
          const isSelected = selectedPaymentMethod === m.id || (m.id === "razorpay" && selectedPaymentMethod === "");
          return (
            <button
              key={m.id}
              id={`pay-method-${m.id}`}
              type="button"
              onClick={() => setSelectedPaymentMethod(m.id)}
              className="p-3.5 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between relative group"
              style={{
                border: isSelected ? "2px solid #2d6a4f" : "2px solid #eaf2ec",
                background: isSelected ? "#f0faf4" : "#fff",
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-[#173324] text-xs">{m.label}</span>
                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      ✓
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-gray-300 shrink-0" />
                  )}
                </div>
                <span className="text-[11px] text-[#55695d] block leading-snug">{m.desc}</span>
              </div>
              <div className="mt-2.5">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    m.highlight
                      ? "bg-emerald-100 text-[#2d6a4f] border border-emerald-200"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {m.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
