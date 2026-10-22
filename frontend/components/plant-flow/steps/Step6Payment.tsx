"use client";

import { Tree, Plan } from "@/types";

interface Step6PaymentProps {
  selectedTree: Tree | null;
  selectedPlanData: Plan | undefined;
  qty: number;
  location: string | null;
  total: number;
  selectedPaymentMethod?: string;
  setSelectedPaymentMethod?: (method: string) => void;
}

export function Step6Payment({
  selectedTree,
  selectedPlanData,
  qty,
  location,
  total,
}: Step6PaymentProps) {
  return (
    <div className="space-y-3.5">
      {/* Order Summary Card */}
      <div
        className="p-4 rounded-2xl shadow-2xs"
        style={{ background: "#f0faf4", border: "1px solid #d4ede1" }}
      >
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-emerald-200/50">
          <h3 className="font-semibold text-[#173324] text-sm">Adoption Order Summary</h3>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
            Lifetime Single-Time Payment
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
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
            <span className="text-[#173324] font-medium text-right max-w-[60%] truncate">
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
            className="border-t pt-2 mt-1.5 flex justify-between items-center font-bold"
            style={{ borderColor: "#d4ede1" }}
          >
            <span className="text-[#173324] text-sm">Total Payable</span>
            <span className="text-[#2d6a4f] text-xl font-extrabold tracking-tight">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="mt-2.5 p-2.5 rounded-xl bg-white/90 border border-emerald-200 text-[11px] text-[#2d6a4f] flex items-start gap-2">
          <span className="text-sm shrink-0">🛡️</span>
          <div className="leading-snug">
            <span className="font-bold text-[#173324]">
              One-Time Single Payment Guarantee:
            </span>{" "}
            No recurring subscriptions or maintenance fees. Covers RFID tagging, arborist care, GPS mapping, and digital deed.
          </div>
        </div>
      </div>

      {/* Single Dedicated Razorpay Payment Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-white via-[#f7fcf9] to-[#eef8f2] border-2 border-[#2d6a4f] shadow-sm relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0c2340] text-white flex items-center justify-center font-bold text-base shadow-sm">
              💳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#173324] text-sm">
                  Razorpay Official Payment Gateway
                </span>
                <span className="bg-emerald-100 text-[#2d6a4f] border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Sole Payment Model
                </span>
              </div>
              <p className="text-[11px] text-[#4a6557]">
                Official, RBI-Authorized Checkout for PlantOn Agro
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
              🔒 256-Bit SSL
            </span>
          </div>
        </div>

        {/* Supported Payment Channels Ribbon */}
        <p className="text-[11px] text-[#4a6557] mb-2 font-medium">
          All payment channels are securely handled in the Razorpay checkout window:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <div className="p-2 rounded-xl bg-white border border-emerald-200/80 text-center shadow-2xs">
            <span className="text-base block mb-0.5">📱</span>
            <span className="text-xs font-bold text-[#173324] block">UPI & QR</span>
            <span className="text-[10px] text-[#55695d]">GPay, PhonePe, Paytm</span>
          </div>

          <div className="p-2 rounded-xl bg-white border border-emerald-200/80 text-center shadow-2xs">
            <span className="text-base block mb-0.5">💳</span>
            <span className="text-xs font-bold text-[#173324] block">Cards</span>
            <span className="text-[10px] text-[#55695d]">Visa, Master, RuPay</span>
          </div>

          <div className="p-2 rounded-xl bg-white border border-emerald-200/80 text-center shadow-2xs">
            <span className="text-base block mb-0.5">🏛️</span>
            <span className="text-xs font-bold text-[#173324] block">NetBanking</span>
            <span className="text-[10px] text-[#55695d]">50+ Indian Banks</span>
          </div>

          <div className="p-2 rounded-xl bg-white border border-emerald-200/80 text-center shadow-2xs">
            <span className="text-base block mb-0.5">💼</span>
            <span className="text-xs font-bold text-[#173324] block">Wallets & EMI</span>
            <span className="text-[10px] text-[#55695d]">Instant Approvals</span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="pt-2.5 border-t border-emerald-100/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#345d47]">
          <span className="flex items-center gap-1 font-medium">
            <span className="text-emerald-600">✓</span> Instant RFID Tag Allotment
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="text-emerald-600">✓</span> Cryptographic SHA-256 Deed
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="text-emerald-600">✓</span> GST Tax Invoice Included
          </span>
        </div>
      </div>
    </div>
  );
}
