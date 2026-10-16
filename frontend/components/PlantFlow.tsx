"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlantStep, Tree } from "@/types";
import { TREES, PLANS, LOCATIONS } from "@/data/mockData";

interface PlantFlowProps {
  onClose: () => void;
}

export function PlantFlow({ onClose }: PlantFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<PlantStep>(1);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [location, setLocation] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("sandbox");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId] = useState(() => "POA-" + Math.random().toString(36).substring(2, 8).toUpperCase());

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

  const stepLabels = ["Tree", "Dedication", "Qty", "Location", "Details", "Payment", "Done"];

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
                    id={`tree-option-${t.id}`}
                    onClick={() => setSelectedTree(t)}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 cursor-pointer"
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

          {/* Step 2: Dedication */}
          {step === 2 && (
            <div>
              <p className="text-[#4a6557] font-medium mb-1">Choose your dedication or occasion package.</p>
              <p className="text-xs text-[#73877b] mb-4">All adoptions are a single-time lifetime payment with zero renewal fees.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PLANS.map((p) => (
                  <button
                    key={p.id}
                    id={`plan-option-${p.id}`}
                    onClick={() => setSelectedPlan(p.id)}
                    className="flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 cursor-pointer"
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
                  id="btn-qty-minus"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-12 h-12 rounded-full text-xl font-bold flex items-center justify-center transition-all cursor-pointer"
                  style={{ background: "#eaf2ec", color: "#2d6a4f" }}
                >
                  −
                </button>
                <span
                  id="qty-display-value"
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-6xl text-[#173324] w-24 text-center"
                >
                  {qty}
                </span>
                <button
                  id="btn-qty-plus"
                  onClick={() => setQty(qty + 1)}
                  className="w-12 h-12 rounded-full text-xl font-bold flex items-center justify-center transition-all cursor-pointer"
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
                    id={`qty-preset-${n}`}
                    onClick={() => setQty(n)}
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
          )}

          {/* Step 4: Location */}
          {step === 4 && (
            <div>
              <p className="text-[#4a6557] mb-5">Choose a plantation site for your tree.</p>
              <div className="grid grid-cols-1 gap-3">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    id={`location-option-${loc.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
                    onClick={() => setLocation(loc)}
                    className="flex items-center gap-3 p-4 rounded-xl text-left transition-all cursor-pointer"
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
                      id={label === "Full Name" ? "input-full-name" : label === "Email Address" ? "input-email" : "input-phone"}
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
                    <span className="text-[#173324] font-medium">{selectedPlanData?.label}</span>
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
                    <span className="text-emerald-700 font-bold">None (100% Lifetime Single-Time)</span>
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
                    <span className="font-bold text-[#173324]">One-Time Single Payment Guarantee:</span> No recurring subscriptions, annual renewal charges, or hidden maintenance fees. Covers sapling plantation, lifelong forestry care, drone telemetry, and permanent digital deed.
                  </div>
                </div>
              </div>
              <p className="text-[#4a6557] text-sm mb-2 font-medium">Select Payment & Verification Method:</p>
              
              {/* Zero-Payment Sandbox Test Callout */}
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-[#1e4433] flex items-center gap-3 shadow-xs">
                <span className="text-2xl shrink-0">🧪</span>
                <div className="leading-snug">
                  <span className="font-bold text-[#173324] block">Zero-Payment Test Sandbox Active</span>
                  <span className="text-[11px] text-[#4a6557]">
                    No real credit card or bank credentials needed. You can test complete tree adoption, instant deed generation, arborist field tagging, and live dashboard integration right now!
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                {[
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
                ].map((m) => (
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
                      background:
                        selectedPaymentMethod === m.id ? "#f0faf4" : "#fff",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#173324] text-xs">
                        {m.label}
                      </span>
                      {selectedPaymentMethod === m.id && (
                        <span className="w-5 h-5 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#55695d] mt-1">
                      {m.desc}
                    </span>
                  </button>
                ))}
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
                <div className="flex justify-between text-sm">
                  <span className="text-[#4a6557]">Billing Plan</span>
                  <span className="font-semibold text-emerald-700">Lifetime Single-Time (No Expiration)</span>
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
                id="btn-back-step"
                onClick={() => setStep((s) => (s - 1) as PlantStep)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                style={{ background: "#eaf2ec", color: "#4a6557" }}
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (step < 6) {
                  setStep((s) => (s + 1) as PlantStep);
                } else {
                  const LOCATION_COORDINATES: Record<string, { lat: number; lng: number; formatted: string }> = {
                    "Western Ghats, Maharashtra": { lat: 18.9894, lng: 73.4428, formatted: "18.9894° N, 73.4428° E" },
                    "Nashik Valley, Maharashtra": { lat: 19.9975, lng: 73.7898, formatted: "19.9975° N, 73.7898° E" },
                    "Satara Plateau, Maharashtra": { lat: 17.6805, lng: 73.9904, formatted: "17.6805° N, 73.9904° E" },
                    "Nagpur Forest Zone": { lat: 21.1458, lng: 79.0882, formatted: "21.1458° N, 79.0882° E" },
                    "Aurangabad Green Belt": { lat: 19.8762, lng: 75.3433, formatted: "19.8762° N, 75.3433° E" },
                    "Pune Hills, Maharashtra": { lat: 18.5204, lng: 73.8567, formatted: "18.5204° N, 73.8567° E" },
                  };

                  const chosenCoords = (location && LOCATION_COORDINATES[location]) || {
                    lat: 19.9975,
                    lng: 73.7898,
                    formatted: "19.9975° N, 73.7898° E",
                  };

                  const speciesShort = (selectedTree?.name || "TR").substring(0, 2).toUpperCase();
                  const certNumber = `CERT-${orderId}`;
                  const dateStr = new Date().toISOString().split("T")[0];
                  const formattedDate = new Date().toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  // 1. Order Record
                  const newOrder = {
                    id: "ord-" + Date.now(),
                    orderNumber: orderId,
                    adopterName: name || "Verified Adopter",
                    adopterEmail: email || "adopter@example.com",
                    treeSpecies: selectedTree?.name || "Indigenous Tree",
                    scientificName: selectedTree?.sci || "Botanical Tree",
                    category: selectedTree?.category || "Fruit Trees",
                    reserveName: location || "Nashik Valley, Maharashtra",
                    gpsCoords: chosenCoords.formatted,
                    planType: selectedPlanData?.label || "Individual",
                    quantity: qty,
                    totalAmount: total,
                    datePlanted: dateStr,
                    status: "Certificate Issued" as const,
                    certificateId: certNumber,
                    ndviScore: 0.91,
                  };

                  // 2. Physical Tree Instance Records (1 for each tree in the quantity)
                  const newInstances = [];
                  for (let i = 0; i < qty; i++) {
                    const serialNum = Math.floor(1000 + Math.random() * 9000);
                    const treeTag = `POA-${speciesShort}-${serialNum}`;
                    const jitterLat = Number((chosenCoords.lat + (Math.random() - 0.5) * 0.004).toFixed(4));
                    const jitterLng = Number((chosenCoords.lng + (Math.random() - 0.5) * 0.004).toFixed(4));

                    newInstances.push({
                      id: `inst-${Date.now()}-${i}`,
                      treeTag: treeTag,
                      orderRef: orderId,
                      assignedReserve: location || "Nashik Valley, Maharashtra",
                      gpsCoordinates: { latitude: jitterLat, longitude: jitterLng },
                      formattedGps: `${jitterLat}° N, ${jitterLng}° E`,
                      datePlanted: formattedDate,
                      healthStatus: "Sapling Growing" as const,
                      treeVarietyName: selectedTree?.name || "Indigenous Sapling",
                      adopterName: name || "Verified Adopter",
                      adopterEmail: email || "adopter@example.com",
                      notes: qty > 1 
                        ? `Tree #${i + 1} of ${qty} adopted under "${selectedPlanData?.label || 'Individual'}" lifetime package. Physical nursery tagging and geotagging completed.`
                        : `Adopted under "${selectedPlanData?.label || 'Individual'}" lifetime package. Physical nursery tagging and geotagging completed.`,
                      imageUrl: selectedTree?.img || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
                      lastInspectedAt: dateStr,
                      isActive: true,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    });
                  }

                  try {
                    // Update orders ledger in localStorage
                    const existingOrders = JSON.parse(localStorage.getItem("poa_orders") || "[]");
                    localStorage.setItem("poa_orders", JSON.stringify([newOrder, ...existingOrders]));

                    // Update tree instances ledger in localStorage
                    const existingInstances = JSON.parse(localStorage.getItem("poa_instances") || "[]");
                    localStorage.setItem("poa_instances", JSON.stringify([...newInstances, ...existingInstances]));

                    // Update buyer adopted trees in localStorage
                    const existingBuyerTrees = JSON.parse(localStorage.getItem("poa_buyer_trees") || "[]");
                    localStorage.setItem("poa_buyer_trees", JSON.stringify([...newInstances, ...existingBuyerTrees]));

                    // Dispatch event for any active admin or buyer windows
                    window.dispatchEvent(
                      new CustomEvent("poa-new-order", {
                        detail: { order: newOrder, instance: newInstances[0], instances: newInstances },
                      })
                    );
                  } catch (e) {
                    console.warn("Could not save order locally:", e);
                  }

                  // Simulated fast verification
                  setTimeout(() => {
                    setIsProcessing(false);
                    setStep(7);
                  }, 400);
                }
              }}
              id={step === 6 ? "btn-complete-sandbox-order" : "btn-continue-step"}
              disabled={!canNext || isProcessing}
              className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
              style={{
                background: canNext ? "linear-gradient(135deg,#52b788,#2d6a4f)" : "#ccc",
              }}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
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
        )}
      </div>
    </div>
  );
}
