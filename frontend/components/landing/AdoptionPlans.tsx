"use client";

import { useState, useEffect } from "react";
import {
  adoptionPlanService,
  BackendAdoptionPlan,
} from "@/services/adoption-plans/adoption-plan.service";
import { OccasionDedicationType } from "@/components/admin/types";

export interface AdoptionPlansProps {
  openPlant: (planId?: string) => void;
}

const OCCASION_FILTERS: { value: "all" | OccasionDedicationType; label: string; icon: string }[] = [
  { value: "all", label: "All Plans", icon: "🌿" },
  { value: "birthday", label: "Birthday", icon: "🎂" },
  { value: "student", label: "Student", icon: "🎓" },
  { value: "marriage", label: "Marriage", icon: "💍" },
  { value: "other", label: "Other Occasion", icon: "🌱" },
  { value: "anniversary", label: "Anniversary", icon: "💍" },
  { value: "memorial", label: "Memorial", icon: "🕯️" },
  { value: "corporate", label: "Corporate CSR", icon: "🏢" },
  { value: "general", label: "General", icon: "🌱" },
];

const OCCASION_TAGS: Record<
  OccasionDedicationType,
  { label: string; icon: string; color: string }
> = {
  birthday: {
    label: "Birthday",
    icon: "🎂",
    color: "bg-amber-50 text-amber-800 border-amber-200",
  },
  student: {
    label: "Student",
    icon: "🎓",
    color: "bg-cyan-50 text-cyan-800 border-cyan-200",
  },
  marriage: {
    label: "Marriage",
    icon: "💍",
    color: "bg-rose-50 text-rose-800 border-rose-200",
  },
  memorial: {
    label: "Memorial",
    icon: "🕯️",
    color: "bg-indigo-50 text-indigo-800 border-indigo-200",
  },
  anniversary: {
    label: "Anniversary",
    icon: "💍",
    color: "bg-pink-50 text-pink-800 border-pink-200",
  },
  corporate: {
    label: "Corporate",
    icon: "🏢",
    color: "bg-blue-50 text-blue-800 border-blue-200",
  },
  general: {
    label: "General",
    icon: "🌱",
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  other: {
    label: "Other Occasion",
    icon: "🌱",
    color: "bg-teal-50 text-teal-800 border-teal-200",
  },
};

export function AdoptionPlans({ openPlant }: AdoptionPlansProps) {
  const [activeOccasion, setActiveOccasion] = useState<"all" | OccasionDedicationType>("all");
  const [plans, setPlans] = useState<BackendAdoptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAdoptionPlans() {
      try {
        setLoading(true);
        const res = await adoptionPlanService.getAll({ limit: 50 });
        if (isMounted && res.data?.items) {
          const activePlans = res.data.items.filter((p) => p.isActive !== false);
          setPlans(activePlans);
        }
      } catch (err) {
        console.error("Failed to load adoption plans from database:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadAdoptionPlans();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered =
    activeOccasion === "all"
      ? plans
      : plans.filter((p) => (p.occasionDedications || ["general"]).includes(activeOccasion));

  return (
    <section id="plans" className="py-28 scroll-mt-20" style={{ background: "var(--color-cream)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-[#2d6a4f] text-xs font-bold uppercase tracking-wider mb-3">
            <span>🌿 Simple • Premium • Scalable</span>
          </div>
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[#173324] text-4xl md:text-5xl mb-4"
          >
            Adoption Packages & Living Forests
          </h2>
          <p className="text-[#4a6557] max-w-2xl mx-auto leading-relaxed">
            Customers are not buying a sapling — they are creating a living legacy. All adoptions are a single-time lifetime investment with legal digital deeds, GPS biometric tracking, and complimentary plantation visits.
          </p>
        </div>

        {/* PDF Page 8 Highlight Banner: Simple. Premium. Scalable. */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#173324] via-[#1f4a33] to-[#2d6a4f] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono">
              ★ Flagship Retail Model
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              10 Trees — ₹25,000 <span className="text-sm font-normal text-emerald-200">(AED 1,000 • USD 300)</span>
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              10 dedicated trees with lifelong arborist custody, digital deed of ownership, high-resolution drone telemetry, and complimentary plantation visits. Larger personal and family plantations available in 25, 50, 100+ trees.
            </p>
          </div>
          <button
            onClick={() => {
              const retail10 = plans.find((p) => p.planLabel.includes("10 Trees"));
              openPlant(retail10?.id);
            }}
            className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-[#173324] bg-white hover:bg-emerald-50 transition-all shadow-lg shrink-0 cursor-pointer"
          >
            Adopt 10 Trees Plan (₹25,000) 🌿
          </button>
        </div>

        {/* Occasion filter pills */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {OCCASION_FILTERS.map((f) => {
            const isSelected = activeOccasion === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setActiveOccasion(f.value)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg,#2d6a4f,#173324)"
                    : "#fff",
                  color: isSelected ? "#fff" : "#4a6557",
                  boxShadow: isSelected
                    ? "0 4px 12px rgba(45,106,79,0.3)"
                    : "0 1px 4px rgba(23,51,36,0.1)",
                  border: isSelected ? "none" : "1px solid #d4e9dd",
                }}
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="rounded-2xl overflow-hidden bg-white p-6 animate-pulse border border-[#e2eae5]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl"></div>
                  <div className="w-20 h-6 bg-emerald-50 rounded-full"></div>
                </div>
                <div className="h-5 bg-emerald-50 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-emerald-50 rounded w-full mb-2"></div>
                <div className="h-3 bg-emerald-50 rounded w-4/5 mb-6"></div>
                <div className="h-10 bg-emerald-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-16 bg-white/70 backdrop-blur-xs rounded-3xl border border-[#d4e9dd] max-w-md mx-auto px-6">
            <span className="text-4xl">🌱</span>
            <h3 className="text-lg font-bold text-[#173324] mt-3">
              No Adoption Plans Available Yet
            </h3>
            <p className="text-xs text-[#4a6557] mt-1 leading-relaxed">
              No adoption packages have been configured yet. Add adoption plans through the Admin Dashboard to start offering dedication packages.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white/70 backdrop-blur-xs rounded-3xl border border-[#d4e9dd] max-w-md mx-auto">
            <span className="text-4xl">🌱</span>
            <h3 className="text-lg font-bold text-[#173324] mt-3">
              No Plans for This Occasion
            </h3>
            <p className="text-xs text-[#4a6557] mt-1">
              Select another occasion or explore all available adoption packages.
            </p>
            <button
              onClick={() => setActiveOccasion("all")}
              className="mt-4 px-4 py-2 bg-[#2d6a4f] text-white text-xs font-semibold rounded-xl hover:bg-[#173324] transition-all cursor-pointer"
            >
              Show All Plans
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((plan) => {
              const planPrice =
                typeof plan.price === "number" && plan.price > 0
                  ? plan.price
                  : typeof plan.priceModifier === "number" && plan.priceModifier > 0
                  ? plan.priceModifier
                  : 25000;
              const features = plan.features || [];
              const occasions =
                plan.occasionDedications && plan.occasionDedications.length > 0
                  ? plan.occasionDedications
                  : (["general"] as OccasionDedicationType[]);

              return (
                <div
                  key={plan.id}
                  className="rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group border border-[#d8e5dd]"
                  style={{
                    background: "#fff",
                    boxShadow: "0 4px 24px rgba(23,51,36,0.06)",
                  }}
                >
                  <div>
                    {/* Top row: Icon & Badge */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="w-13 h-13 rounded-2xl bg-[#f0faf4] border border-[#d4e9dd] flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-105">
                        {plan.icon || "🌱"}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-[#1b7a43] border border-emerald-200">
                        {plan.badge || "Standard"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      style={{ fontFamily: "var(--font-display)" }}
                      className="font-bold text-[#173324] text-xl mb-2"
                    >
                      {plan.planLabel}
                    </h3>

                    {/* Price Section */}
                    <div className="mb-4 pb-3 border-b border-[#f0f4f1]">
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className="text-3xl font-extrabold text-[#173324] tracking-tight"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          ₹{planPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs font-semibold text-[#55695d]">
                          / single-time
                        </span>
                      </div>
                      {plan.planLabel.includes("10 Trees") && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-[#2d6a4f]">
                          <span>🇦🇪 AED 1,000</span>
                          <span>•</span>
                          <span>🌐 $300 USD</span>
                        </div>
                      )}
                      {(plan.planLabel.includes("100 Trees") || plan.planLabel.includes("50 Trees")) && (
                        <div className="mt-1.5 text-[11px] font-semibold text-emerald-800">
                          Bulk rate: Up to ₹20,000 per 10-tree equivalent
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-[#5a6b62] text-xs sm:text-[13px] leading-relaxed mb-4">
                      {plan.description}
                    </p>

                    {/* Occasion Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {occasions.map((occ) => {
                        const tagInfo = OCCASION_TAGS[occ] || {
                          label: occ,
                          icon: "🌱",
                          color: "bg-gray-50 text-gray-700 border-gray-200",
                        };
                        return (
                          <span
                            key={occ}
                            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${tagInfo.color}`}
                          >
                            <span>{tagInfo.icon}</span>
                            <span>{tagInfo.label}</span>
                          </span>
                        );
                      })}
                    </div>

                    {/* Included Features */}
                    {features.length > 0 && (
                      <div className="pt-3 border-t border-[#f0f4f1] mb-5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#73877b] block mb-2">
                          What&apos;s Included
                        </span>
                        <ul className="space-y-1.5">
                          {features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-[#384a3f] flex items-start gap-2 leading-snug"
                            >
                              <span className="text-[#2d6a4f] font-bold shrink-0">✓</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-[#f0f4f1]">
                    <div className="flex items-center justify-between text-xs text-[#6b8070] mb-3">
                      <span>♾️ Lifetime Biological Custody</span>
                      {plan.activeCount > 0 && (
                        <span className="font-semibold text-[#2d6a4f]">
                          🌿 {plan.activeCount.toLocaleString()} Adopters
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => openPlant(plan.id)}
                      className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:shadow-lg cursor-pointer"
                      style={{
                        background: "linear-gradient(135deg,#2d6a4f,#173324)",
                        color: "#fff",
                      }}
                    >
                      Choose Plan (₹{planPrice.toLocaleString("en-IN")})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

