"use client";

import { Plan } from "@/types";

interface Step2DedicationProps {
  selectedPlan: string | null;
  onSelectPlan: (planId: string) => void;
  plans?: Plan[];
  loading?: boolean;
  customOccasion?: string;
  setCustomOccasion?: (val: string) => void;
}

export function Step2Dedication({
  selectedPlan,
  onSelectPlan,
  plans = [],
  loading = false,
  customOccasion = "",
  setCustomOccasion,
}: Step2DedicationProps) {
  if (loading && plans.length === 0) {
    return (
      <div>
        <p className="text-[#4a6557] font-medium mb-1">
          Loading adoption plans...
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[#eaf2ec] animate-pulse"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-emerald-50 rounded w-2/3"></div>
                <div className="h-3 bg-emerald-50 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Check if currently selected plan is "Other Occasion"
  const currentPlan = plans.find((p) => p.id === selectedPlan);
  const isOtherSelected =
    Boolean(currentPlan && (
      currentPlan.label.toLowerCase().includes("other") ||
      currentPlan.id.toLowerCase().includes("other")
    )) || selectedPlan === "other-occasion";

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#173324] mb-1">
          Choose an Adoption Plan
        </h3>
        <p className="text-xs text-[#55695d]">
          Select an occasion package (Birthday, Student, Marriage, or Other Occasion). All packages are a single-time lifetime payment with zero renewal fees.
        </p>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-10 bg-[#f9fbf9] rounded-2xl border border-[#d4e9dd]">
          <span className="text-3xl">🕊️</span>
          <p className="text-sm font-semibold text-[#173324] mt-2">
            No adoption plans available
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {plans.map((p) => {
            const isSelected = selectedPlan === p.id;
            return (
              <button
                key={p.id}
                type="button"
                id={`plan-option-${p.id}`}
                onClick={() => onSelectPlan(p.id)}
                className={`relative flex items-start gap-3 p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs ${
                  isSelected
                    ? "border-2 border-[#2d6a4f] bg-[#f0faf4] ring-2 ring-[#52b788]/20"
                    : "border-2 border-[#eaf2ec] bg-white hover:border-[#b7dfc8]"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50/80 border border-emerald-200/60 flex items-center justify-center text-2xl shrink-0">
                  {p.icon}
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#173324] text-sm truncate">
                      {p.label}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-[#2d6a4f] bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-[#4a6557] text-xs mt-0.5 line-clamp-2 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                {/* Price Modifier badge if any */}
                {p.price !== 0 && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: p.price > 0 ? "#fef3ee" : "#eef8f2",
                      color: p.price > 0 ? "#c8521d" : "#2d6a4f",
                    }}
                  >
                    {p.price > 0 ? `+₹${p.price}` : `-₹${Math.abs(p.price)}`}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Inline custom occasion specification if Other Occasion is selected */}
      {isOtherSelected && setCustomOccasion && (
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#f0faf4] to-[#fbfdfb] border border-emerald-200/80 shadow-2xs">
          <label
            htmlFor="input-custom-occasion"
            className="text-xs font-semibold text-[#173324] block mb-1.5 flex items-center gap-1.5"
          >
            <span>🌱 Specify your occasion or dedication (optional):</span>
          </label>
          <input
            id="input-custom-occasion"
            type="text"
            value={customOccasion}
            onChange={(e) => setCustomOccasion(e.target.value)}
            placeholder="e.g. In Memoriam, Retirement, Newborn Baby, Eco Festival"
            maxLength={80}
            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border-2 border-[#d4e9dd] focus:border-[#52b788] outline-none text-[#173324] placeholder:text-[#8a9b90]"
          />
          <p className="text-[11px] text-[#55695d] mt-1.5">
            This occasion will be printed on your digital certificate and geotagged adoption deed.
          </p>
        </div>
      )}
    </div>
  );
}
