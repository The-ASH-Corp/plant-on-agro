"use client";

import { useMemo } from "react";
import { AdoptionPlanItem } from "../types";

interface PlansTabProps {
  plans: AdoptionPlanItem[];
  searchQuery: string;
  onOpenAddPlan: () => void;
}

export function PlansTab({
  plans,
  searchQuery,
  onOpenAddPlan,
}: PlansTabProps) {
  const filteredPlans = useMemo(() => {
    return plans.filter(
      (p) =>
        p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.badge.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [plans, searchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-xs">
        <div>
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-[#173324]">
            Adoption Packages & Occasion Programs ({filteredPlans.length})
          </h2>
          <p className="text-xs text-[#73877b]">Configure personal, memorial, occasion, and enterprise CSR packages</p>
        </div>
        <button
          onClick={onOpenAddPlan}
          className="px-4 py-2 rounded-xl bg-[#173324] hover:bg-[#1f4230] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <span>+</span>
          <span>Add Adoption Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            className="p-6 rounded-3xl bg-white border border-[#e2eae5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{plan.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-[#1b7a43] border border-emerald-200">
                  {plan.badge}
                </span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg font-bold text-[#173324]">
                {plan.label}
              </h3>
              <p className="text-xs text-[#55695d] mt-2 leading-relaxed">{plan.desc}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f0f4f1] flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-[#a0b0a6] uppercase font-bold block">Price Modifier</span>
                <span className="font-bold text-[#173324]">
                  {plan.price === 0 ? "Standard Tree Rate" : plan.price > 0 ? `+₹${plan.price} Extra` : `₹${plan.price} Subsidy`}
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#f0f5f2] text-[#1b7a43]">
                {plan.activeCount.toLocaleString()} Adopters
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
