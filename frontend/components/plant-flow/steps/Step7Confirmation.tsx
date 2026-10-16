"use client";

import { useRouter } from "next/navigation";
import { Tree } from "@/types";

interface Step7ConfirmationProps {
  selectedTree: Tree | null;
  location: string | null;
  orderId: string;
  onClose: () => void;
}

export function Step7Confirmation({
  selectedTree,
  location,
  orderId,
  onClose,
}: Step7ConfirmationProps) {
  const router = useRouter();

  return (
    <div className="text-center py-4">
      <div className="text-6xl mb-6">🌱</div>
      <h3
        style={{ fontFamily: "var(--font-display)" }}
        className="text-[#173324] text-3xl mb-3"
      >
        Your Tree Journey Has Begun!
      </h3>
      <p className="text-[#4a6557] mb-8">
        Our plantation team will get to work. You'll receive updates, photos, and
        your certificate soon.
      </p>
      <div
        className="p-5 rounded-2xl mb-6 text-left space-y-3"
        style={{ background: "#f0faf4", border: "1px solid #d4ede1" }}
      >
        <div className="flex justify-between text-sm">
          <span className="text-[#4a6557]">Tree</span>
          <span className="font-semibold text-[#173324]">{selectedTree?.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#4a6557]">Location</span>
          <span className="font-semibold text-[#173324] text-right max-w-[60%]">
            {location}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#4a6557]">Planting Date</span>
          <span className="font-semibold text-[#173324]">Within 14 days</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#4a6557]">Order ID</span>
          <span className="font-mono font-semibold text-[#2d6a4f]">{orderId}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#4a6557]">Billing Plan</span>
          <span className="font-semibold text-emerald-700">
            Lifetime Single-Time (No Expiration)
          </span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          id="btn-view-buyer-dashboard"
          onClick={() => {
            onClose();
            router.push("/buyer/dashboard");
          }}
          className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md hover:brightness-105"
          style={{ background: "linear-gradient(135deg,#52b788,#2d6a4f)" }}
        >
          <span>🌳</span>
          <span>View in Buyer Dashboard</span>
        </button>
        <button
          type="button"
          id="btn-verify-admin-ledger"
          onClick={() => {
            onClose();
            router.push("/admin");
          }}
          className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-[#173324] border border-[#d4ede1] bg-[#f0faf4] hover:bg-[#e4f5ec] flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <span>📊</span>
          <span>Verify in Admin Ledger</span>
        </button>
        <button
          type="button"
          id="btn-close-wizard"
          onClick={onClose}
          className="py-3 px-5 rounded-xl font-semibold text-xs sm:text-sm cursor-pointer hover:bg-[#e0ece5] transition-all"
          style={{ background: "#eaf2ec", color: "#2d6a4f" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
