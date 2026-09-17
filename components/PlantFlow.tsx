"use client";

import { useState } from "react";
import { PlantStep, Tree } from "@/types";
import { TREES, PLANS, LOCATIONS } from "@/data/mockData";

interface PlantFlowProps {
  onClose: () => void;
}

export function PlantFlow({ onClose }: PlantFlowProps) {
  const [step, setStep] = useState<PlantStep>(1);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [location, setLocation] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const orderId = "POA-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  const selectedPlanData = PLANS.find((p) => p.id === selectedPlan);
  const pricePerTree = selectedTree ? selectedTree.price + (selectedPlanData?.price ?? 0) : 0;
  const total = pricePerTree * qty;

  const canNext =
    (step === 1 && selectedTree) ||
    (step === 2 && selectedPlan) ||
    (step === 3 && qty >= 1) ||
    (step === 4 && location) ||
    (step === 5 && name && email) ||
    step === 6 ||
    step === 7;

  const stepLabels = ["Tree", "Plan", "Qty", "Location", "Details", "Payment", "Done"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,35,24,0.85)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl relative"
        style={{ background: "#fff" }}
      >
        {/* Header */}
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
              className="text-[#8a9b90] hover:text-[#173324] text-xl transition-colors"
            >
              ✕
            </button>
          </div>
          {/* Progress */}
          {step < 7 && (
            <div className="flex items-center gap-1">
              {stepLabels.slice(0, 6).map((l, i) => (
                <div key={l} className="flex items-center gap-1 flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
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
                      {l}
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

        {/* Body */}
        <div className="p-6">
          {/* Step 1: Choose tree */}
          {step === 1 && (
            <div>
              <p className="text-[#4a6557] mb-5">Which tree would you like to plant?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TREES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTree(t)}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200"
                    style={{
                      border: selectedTree?.id === t.id ? "2px solid #52b788" : "2px solid #eaf2ec",
                      background: selectedTree?.id === t.id ? "#f0faf4" : "#fff",
                    }}
                  >
                    <img
                      src={t.img}
                      alt={t.name}
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-[#173324] text-sm">{t.name}</div>
                      <div className="text-[#4a6557] text-xs">{t.category}</div>
                      <div className="text-[#2d6a4f] font-bold text-sm">₹{t.price}</div>
                    </div>
                    {selectedTree?.id === t.id && (
                      <span className="ml-auto text-[#52b788] text-lg">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Plan */}
          {step === 2 && (
            <div>
              <p className="text-[#4a6557] mb-5">Choose your planting plan.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PLANS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className="flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200"
                    style={{
                      border: selectedPlan === p.id ? "2px solid #52b788" : "2px solid #eaf2ec",
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
          )}

          {/* Step 3: Quantity */}
          {step === 3 && (
            <div className="text-center py-6">
              <p className="text-[#4a6557] mb-8">How many trees would you like to plant?</p>
              <div className="flex items-center justify-center gap-6 mb-8">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-12 h-12 rounded-full text-xl font-bold flex items-center justify-center transition-all"
                  style={{ background: "#eaf2ec", color: "#2d6a4f" }}
                >
                  −
                </button>
                <span
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-6xl text-[#173324] w-24 text-center"
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-12 h-12 rounded-full text-xl font-bold flex items-center justify-center transition-all"
                  style={{ background: "linear-gradient(135deg,#52b788,#2d6a4f)", color: "#fff" }}
                >
                  +
                </button>
              </div>
              <div className="text-[#4a6557] text-sm mb-2">
                {selectedTree?.name} × {qty} ={" "}
                <strong className="text-[#2d6a4f]">₹{total.toLocaleString("en-IN")}</strong>
              </div>
              <div className="flex justify-center gap-3 mt-6">
                {[5, 10, 25, 50].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQty(n)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
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
          )}

          {/* Step 4: Location */}
          {step === 4 && (
            <div>
              <p className="text-[#4a6557] mb-5">Choose a plantation site for your tree.</p>
              <div className="grid grid-cols-1 gap-3">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setLocation(loc)}
                    className="flex items-center gap-3 p-4 rounded-xl text-left transition-all"
                    style={{
                      border: location === loc ? "2px solid #52b788" : "2px solid #eaf2ec",
                      background: location === loc ? "#f0faf4" : "#fff",
                    }}
                  >
                    <span className="text-lg">📍</span>
                    <span className="font-medium text-[#173324] text-sm">{loc}</span>
                    {location === loc && <span className="ml-auto text-[#52b788]">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: User details */}
          {step === 5 && (
            <div>
              <p className="text-[#4a6557] mb-5">Your certificate will be issued in this name.</p>
              <div className="space-y-4">
                {[
                  {
                    label: "Full Name",
                    val: name,
                    set: setName,
                    type: "text",
                    placeholder: "e.g. Priya Sharma",
                  },
                  {
                    label: "Email Address",
                    val: email,
                    set: setEmail,
                    type: "email",
                    placeholder: "your@email.com",
                  },
                  {
                    label: "Phone Number",
                    val: phone,
                    set: setPhone,
                    type: "tel",
                    placeholder: "+91 98765 43210",
                  },
                ].map(({ label, val, set, type, placeholder }) => (
                  <div key={label}>
                    <label className="text-xs font-semibold text-[#4a6557] uppercase tracking-wider mb-1.5 block">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={val}
                      onChange={(e) => set(e.target.value)}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ border: "2px solid #eaf2ec", color: "#173324" }}
                      onFocus={(e) => (e.target.style.border = "2px solid #52b788")}
                      onBlur={(e) => (e.target.style.border = "2px solid #eaf2ec")}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Payment */}
          {step === 6 && (
            <div>
              <div
                className="p-5 rounded-2xl mb-6"
                style={{ background: "#f0faf4", border: "1px solid #d4ede1" }}
              >
                <h3 className="font-semibold text-[#173324] mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#4a6557]">
                    <span>Tree</span>
                    <span className="text-[#173324] font-medium">{selectedTree?.name}</span>
                  </div>
                  <div className="flex justify-between text-[#4a6557]">
                    <span>Plan</span>
                    <span className="text-[#173324] font-medium">{selectedPlanData?.label}</span>
                  </div>
                  <div className="flex justify-between text-[#4a6557]">
                    <span>Quantity</span>
                    <span className="text-[#173324] font-medium">{qty} trees</span>
                  </div>
                  <div className="flex justify-between text-[#4a6557]">
                    <span>Location</span>
                    <span className="text-[#173324] font-medium text-right max-w-[60%]">
                      {location}
                    </span>
                  </div>
                  <div
                    className="border-t pt-2 mt-2 flex justify-between font-bold"
                    style={{ borderColor: "#d4ede1" }}
                  >
                    <span className="text-[#173324]">Total</span>
                    <span className="text-[#2d6a4f] text-lg">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[#4a6557] text-sm mb-4">Select payment method:</p>
              <div className="grid grid-cols-2 gap-3">
                {["💳 Card / UPI", "📱 PhonePe / GPay", "🏦 Net Banking", "💰 Pay Later"].map(
                  (m) => (
                    <button
                      key={m}
                      className="p-4 rounded-xl text-sm font-medium text-[#173324] hover:bg-[#f0faf4] transition-all"
                      style={{ border: "2px solid #eaf2ec" }}
                    >
                      {m}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Step 7: Confirmation */}
          {step === 7 && (
            <div className="text-center py-4">
              <div className="text-6xl mb-6">🌱</div>
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="text-[#173324] text-3xl mb-3"
              >
                Your Tree Journey Has Begun!
              </h3>
              <p className="text-[#4a6557] mb-8">
                Our plantation team will get to work. You'll receive updates, photos, and your certificate soon.
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
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 rounded-xl font-semibold text-sm text-white"
                  style={{ background: "linear-gradient(135deg,#52b788,#2d6a4f)" }}
                >
                  Track My Tree
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm"
                  style={{ background: "#eaf2ec", color: "#2d6a4f" }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer nav */}
        {step < 7 && (
          <div
            className="sticky bottom-0 p-6 pt-4 flex gap-3"
            style={{ background: "#fff", borderTop: "1px solid #eaf2ec" }}
          >
            {step > 1 && (
              <button
                onClick={() => setStep((s) => (s - 1) as PlantStep)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ background: "#eaf2ec", color: "#4a6557" }}
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (step < 6) setStep((s) => (s + 1) as PlantStep);
                else setStep(7);
              }}
              disabled={!canNext}
              className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-40"
              style={{
                background: canNext ? "linear-gradient(135deg,#52b788,#2d6a4f)" : "#ccc",
              }}
            >
              {step === 6 ? "Complete Order" : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
