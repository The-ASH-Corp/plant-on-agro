"use client";

import { useState } from "react";
import { User } from "@/types/auth";
import { VisionDonationModal } from "./VisionDonationModal";

interface VisionCampaignSectionProps {
  user?: User | null;
}

export function VisionCampaignSection({ user }: VisionCampaignSectionProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const presets = [
    { value: 500, label: "₹500",},
    { value: 1000, label: "₹1,000", },
    { value: 2500, label: "₹2,500", },
    { value: 5000, label: "₹5,000",},
    { value: 10000, label: "₹10,000",  },
  ];

  // Active donation amount
  const activeAmount = isCustom
    ? Math.max(1, parseInt(customAmount) || 0)
    : selectedAmount;

  const estimatedTrees = Math.max(1, Math.round(activeAmount / 500));

  const handleSelectPreset = (val: number) => {
    setSelectedAmount(val);
    setIsCustom(false);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(val);
    setIsCustom(true);
  };

  return (
    <section id="vision-2m" className="py-20 bg-gradient-to-b from-[#f2f7f4] via-white to-[#f0f6f2] relative overflow-hidden">
      {/* Decorative ambient blurred glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 rounded-full bg-[#2d6a4f]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Campaign Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#173324] tracking-tight leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            2M Trees Vision Campaign
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Building India’s most trusted network of technology-enabled living forests, regenerative farms, and nature sanctuaries.
            <strong> Our goal: 20 Lakh (2,000,000) Trees</strong>
          </p>
        </div>

    

        {/* Interactive Donation Card ("Users Can Donate Any Amount") */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#173324] via-[#1b4332] to-[#2d6a4f] rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-emerald-600/30">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-emerald-500/30">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold tracking-wider uppercase border border-emerald-400/30">
                  🤝 Open Crowdfunded Vision
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold mt-2" style={{ fontFamily: "var(--font-display)" }}>
                  Donate to the 2M Trees Vision
                </h3>
                <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                  You don’t have to buy a fixed package to be part of history. Whether you give ₹100 or ₹25,000, 100% of your contribution directly funds saplings, bio-enrichment, and lifetime arborist stewardship.
                </p>
              </div>

              {/* Dynamic Trees Count Badge */}
              {/* <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 min-w-[170px]">
                <span className="text-[11px] text-emerald-200 uppercase font-semibold block">Your Direct Impact</span>
                <div className="text-3xl font-black text-emerald-300 mt-0.5">
                  ~{estimatedTrees} {estimatedTrees === 1 ? "Tree" : "Trees"}
                </div>
                <span className="text-[10px] text-emerald-100/80 block mt-0.5">
                  Nurtured for a Lifetime
                </span>
              </div> */}
            </div>

            {/* Quick Amount Presets */}
            <div className="mt-6">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-2.5">
                Select a Contribution Tier or Enter Custom Amount:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {presets.map((p) => {
                  const isSelected = !isCustom && selectedAmount === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => handleSelectPreset(p.value)}
                      className={`p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between border ${
                        isSelected
                          ? "bg-white text-[#173324] border-white shadow-lg scale-[1.02]"
                          : "bg-white/10 hover:bg-white/20 text-white border-white/15"
                      }`}
                    >
                      <span className={`text-lg font-black ${isSelected ? "text-[#173324]" : "text-white"}`}>
                        {p.label}
                      </span>
                     
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount Input Field */}
              <div className="mt-4 pt-3 border-t border-emerald-500/20 flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-xs text-emerald-200 font-semibold whitespace-nowrap">
                  Or enter any custom amount:
                </span>
                <div className="relative flex-1 max-w-xs">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-300">₹</span>
                  <input
                    type="text"
                    value={isCustom ? customAmount : ""}
                    onChange={handleCustomChange}
                    placeholder="e.g. 750, 1500, 20000..."
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white/15 border border-white/20 text-white placeholder-emerald-200/50 text-sm font-bold focus:outline-none focus:bg-white/25 focus:border-white transition-all"
                  />
                </div>
                {isCustom && customAmount && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustom(false);
                      setCustomAmount("");
                      setSelectedAmount(1000);
                    }}
                    className="text-xs text-emerald-300 hover:text-white underline cursor-pointer"
                  >
                    Reset to ₹1,000 preset
                  </button>
                )}
              </div>
            </div>

            {/* Donate Call to Action */}
            <div className="mt-8 pt-5 border-t border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-emerald-100 flex items-center gap-2">
                <span>🌱</span>
                <span>
                  Contributing <strong>₹{activeAmount.toLocaleString("en-IN")}</strong> will plant and protect <strong>~{estimatedTrees} living trees</strong> with official digital deeds.
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={activeAmount <= 0}
                className="px-8 py-3.5 rounded-xl text-sm sm:text-base font-extrabold text-[#173324] bg-white hover:bg-emerald-50 active:scale-98 shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                <span>🌱 Donate ₹{activeAmount.toLocaleString("en-IN")} to 2M Vision</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Decorative background circle */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
        </div>
      </div>

      {/* Donation Checkout Modal */}
      {isModalOpen && (
        <VisionDonationModal
          initialAmount={activeAmount}
          user={user}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            // Success handler
          }}
        />
      )}
    </section>
  );
}
