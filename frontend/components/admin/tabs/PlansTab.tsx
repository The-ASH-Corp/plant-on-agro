"use client";

import { useState, useMemo } from "react";
import { AdoptionPlanItem, OccasionDedicationType } from "../types";
import { TrashIcon, PencilIcon } from "@/components/ui";

interface PlansTabProps {
  plans: AdoptionPlanItem[];
  searchQuery: string;
  onOpenAddPlan: () => void;
  onEditPlan?: (plan: AdoptionPlanItem) => void;
  onDeletePlan?: (id: string, name?: string) => void;
}

const OCCASION_FILTERS: { value: string; label: string; icon: string }[] = [
  { value: "all", label: "All Packages", icon: "🌐" },
  { value: "birthday", label: "Birthday", icon: "🎂" },
  { value: "memorial", label: "Memorial", icon: "🕯️" },
  { value: "anniversary", label: "Anniversary", icon: "💍" },
  { value: "corporate", label: "Corporate CSR", icon: "🏢" },
  { value: "general", label: "General", icon: "🌱" },
];

const OCCASION_TAGS: Record<OccasionDedicationType, { label: string; icon: string; color: string }> = {
  birthday: { label: "Birthday", icon: "🎂", color: "bg-amber-50 text-amber-800 border-amber-200" },
  memorial: { label: "Memorial", icon: "🕯️", color: "bg-indigo-50 text-indigo-800 border-indigo-200" },
  anniversary: { label: "Anniversary", icon: "💍", color: "bg-rose-50 text-rose-800 border-rose-200" },
  corporate: { label: "Corporate", icon: "🏢", color: "bg-blue-50 text-blue-800 border-blue-200" },
  general: { label: "General", icon: "🌱", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
};

export function PlansTab({
  plans,
  searchQuery,
  onOpenAddPlan,
  onEditPlan,
  onDeletePlan,
}: PlansTabProps) {
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all");

  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      const label = p.label || p.planLabel || "";
      const desc = p.desc || p.description || "";
      const badge = p.badge || "";
      const features = (p.features || []).join(" ");

      const matchesSearch =
        label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
        features.toLowerCase().includes(searchQuery.toLowerCase());

      const occasions = p.occasionDedications || [];
      const matchesOccasion =
        selectedOccasion === "all" ||
        occasions.includes(selectedOccasion as OccasionDedicationType);

      return matchesSearch && matchesOccasion;
    });
  }, [plans, searchQuery, selectedOccasion]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-xs">
        <div>
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-[#173324]">
            Adoption Packages & Occasion Programs ({filteredPlans.length})
          </h2>
          <p className="text-xs text-[#73877b]">
            Configure plan labels, pricing modifiers/subsidies, occasion dedications, and features.
          </p>
        </div>
        <button
          onClick={onOpenAddPlan}
          className="px-4 py-2.5 rounded-xl bg-[#173324] hover:bg-[#1f4230] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <span>+</span>
          <span>Add Adoption Plan</span>
        </button>
      </div>

      {/* Occasion Dedication Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {OCCASION_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setSelectedOccasion(f.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedOccasion === f.value
                ? "bg-[#173324] text-white shadow-xs"
                : "bg-white text-[#55695d] border border-[#e2eae5] hover:border-[#173324]"
            }`}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* Grid of Plans */}
      {filteredPlans.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#e2eae5] space-y-3">
          <div className="text-4xl">🌱</div>
          <h3 className="text-base font-bold text-[#173324]">No Adoption Plans Found</h3>
          <p className="text-xs text-[#73877b] max-w-sm mx-auto">
            {searchQuery || selectedOccasion !== "all"
              ? "No plans match your current search or occasion filter."
              : "No adoption plans created yet. Add your first plan to start offering dedication packages!"}
          </p>
          <button
            onClick={onOpenAddPlan}
            className="px-4 py-2 rounded-xl bg-[#173324] text-white text-xs font-semibold hover:bg-[#1f4230] transition-all cursor-pointer"
          >
            + Create Adoption Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlans.map((plan) => {
            const priceModifier = plan.priceModifier !== undefined ? plan.priceModifier : plan.price;
            const features = plan.features || [];
            const occasions = plan.occasionDedications || ["general"];

            return (
              <div
                key={plan.id}
                className="p-6 rounded-3xl bg-white border border-[#e2eae5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div>
                  {/* Top Bar: Icon, Badge, Edit and Delete Buttons */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#f4f7f5] flex items-center justify-center text-2xl border border-[#e2eae5]">
                      {plan.icon}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-[#1b7a43] border border-emerald-200">
                        {plan.badge || "Standard"}
                      </span>
                      {plan.isActive === false && (
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          Inactive
                        </span>
                      )}
                      {onEditPlan && (
                        <button
                          type="button"
                          onClick={() => onEditPlan(plan)}
                          title={`Edit ${plan.label || plan.planLabel}`}
                          className="p-1.5 rounded-lg text-[#173324] hover:bg-emerald-50 hover:text-[#1b7a43] border border-transparent hover:border-emerald-200 cursor-pointer text-xs inline-flex items-center justify-center transition-all"
                          aria-label={`Edit ${plan.label || plan.planLabel}`}
                        >
                          <PencilIcon className="w-3.5 h-3.5 text-[#1b7a43]" />
                        </button>
                      )}
                      {onDeletePlan && (
                        <button
                          type="button"
                          onClick={() => onDeletePlan(plan.id, plan.label || plan.planLabel)}
                          title="Delete adoption plan"
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 cursor-pointer text-xs inline-flex items-center justify-center"
                          aria-label={`Delete ${plan.label || plan.planLabel}`}
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Plan Label */}
                  <h3
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-lg font-bold text-[#173324]"
                  >
                    {plan.label || plan.planLabel}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#55695d] mt-2 leading-relaxed">
                    {plan.desc || plan.description}
                  </p>

                  {/* Occasion Dedication Options */}
                  <div className="mt-4 pt-3 border-t border-[#f4f7f5]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b9c92] block mb-1.5">
                      Occasion Dedications:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {occasions.map((occ) => {
                        const tagInfo = OCCASION_TAGS[occ] || {
                          label: occ,
                          icon: "🌱",
                          color: "bg-gray-50 text-gray-700 border-gray-200",
                        };
                        return (
                          <span
                            key={occ}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${tagInfo.color}`}
                          >
                            <span>{tagInfo.icon}</span>
                            <span>{tagInfo.label}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Features List */}
                  {features.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#f4f7f5]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b9c92] block mb-1.5">
                        Included Features:
                      </span>
                      <ul className="space-y-1.5">
                        {features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-[#384a3f] flex items-start gap-1.5 leading-snug"
                          >
                            <span className="text-emerald-600 font-bold text-xs shrink-0">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer: Price Modifier & Adopters & Actions */}
                <div className="mt-6 pt-4 border-t border-[#f0f4f1] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#a0b0a6] uppercase font-bold block">
                      Pricing Modifier / Subsidy
                    </span>
                    <span
                      className={`font-bold ${
                        priceModifier === 0
                          ? "text-[#173324]"
                          : priceModifier > 0
                          ? "text-[#173324]"
                          : "text-emerald-700"
                      }`}
                    >
                      {priceModifier === 0
                        ? "₹0 (Standard Base Rate)"
                        : priceModifier > 0
                        ? `+₹${priceModifier} Extra Charge`
                        : `-₹${Math.abs(priceModifier)} Subsidy`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#f0f5f2] text-[#1b7a43]">
                      {(plan.activeCount ?? 0).toLocaleString()} Adopters
                    </span>
                    
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
