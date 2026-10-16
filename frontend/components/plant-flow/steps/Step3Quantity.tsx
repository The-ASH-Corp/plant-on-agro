"use client";

import { Tree } from "@/types";

interface Step3QuantityProps {
  qty: number;
  onSetQty: (qty: number) => void;
  selectedTree: Tree | null;
  total: number;
}

const PRESETS = [5, 10, 25, 50];

export function Step3Quantity({
  qty,
  onSetQty,
  selectedTree,
  total,
}: Step3QuantityProps) {
  return (
    <div className="text-center py-6">
      <p className="text-[#4a6557] mb-8">How many trees would you like to plant?</p>
      <div className="flex items-center justify-center gap-6 mb-8">
        <button
          id="btn-qty-minus"
          onClick={() => onSetQty(Math.max(1, qty - 1))}
          className="w-12 h-12 rounded-full text-xl font-bold flex items-center justify-center transition-all cursor-pointer"
          style={{ background: "#eaf2ec", color: "#2d6a4f" }}
          aria-label="Decrease tree quantity"
        >
          −
        </button>
        <span
          id="qty-display-value"
          style={{ fontFamily: "var(--font-display)" }}
          className="text-6xl text-[#173324] w-24 text-center font-bold"
        >
          {qty}
        </span>
        <button
          id="btn-qty-plus"
          onClick={() => onSetQty(qty + 1)}
          className="w-12 h-12 rounded-full text-xl font-bold flex items-center justify-center transition-all cursor-pointer"
          style={{
            background: "linear-gradient(135deg,#52b788,#2d6a4f)",
            color: "#fff",
          }}
          aria-label="Increase tree quantity"
        >
          +
        </button>
      </div>
      <div className="text-[#4a6557] text-sm mb-2">
        {selectedTree?.name} × {qty} ={" "}
        <strong className="text-[#2d6a4f]">
          ₹{total.toLocaleString("en-IN")}
        </strong>
      </div>
      <div className="flex justify-center gap-3 mt-6">
        {PRESETS.map((n) => (
          <button
            key={n}
            id={`qty-preset-${n}`}
            onClick={() => onSetQty(n)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
            style={{
              background: qty === n ? "#2d6a4f" : "#eaf2ec",
              color: qty === n ? "#fff" : "#4a6557",
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
