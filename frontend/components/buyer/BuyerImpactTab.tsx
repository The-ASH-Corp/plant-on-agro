"use client";

interface BuyerImpactTabProps {
  totalTrees: number;
  estimatedCO2: number;
}

export function BuyerImpactTab({ totalTrees, estimatedCO2 }: BuyerImpactTabProps) {
  const milesAvoided = Math.round(estimatedCO2 * 2.5);
  const waterRechargeLiters = totalTrees * 180;
  const pollinatorSqFt = totalTrees * 450;
  const oxygenProducedKg = Math.round(totalTrees * 118);

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e2eae5] shadow-xs space-y-4">
        <div>
          <span className="text-[10px] font-bold text-[#1b7a43] uppercase tracking-widest font-mono">
            Scientific Ledger
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#173324] mt-0.5">
            Ecological & Atmospheric Impact Analysis
          </h2>
          <p className="text-xs text-[#52796f] max-w-2xl mt-0.5 leading-relaxed">
            Every living tree you adopt through PlantOn Agro acts as a permanent biological carbon pump, replenishing water tables and revitalizing regional biodiversity.
          </p>
        </div>

        {/* 4 Impact Real-World Comparisons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-[#f0faf4] to-[#e4f6eb] border border-[#cce8d7] space-y-1">
            <span className="text-2xl">🚗</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#1b7a43] block">
              Automobile Carbon Offset
            </span>
            <h4 className="text-xl font-serif font-bold text-[#173324]">~{milesAvoided} Miles</h4>
            <p className="text-[11px] text-[#52796f]">Equivalent passenger car emissions permanently sequestered.</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-[#eff8ff] to-[#e0f1fe] border border-[#cbe4fc] space-y-1">
            <span className="text-2xl">💧</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 block">
              Groundwater Aquifer
            </span>
            <h4 className="text-xl font-serif font-bold text-blue-900">{waterRechargeLiters} L / yr</h4>
            <p className="text-[11px] text-blue-700/80">Moisture held and filtered deep in soil via root micro-channels.</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-[#fbf6e9] to-[#faedd0] border border-[#f5deab] space-y-1">
            <span className="text-2xl">🦋</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800 block">
              Bio-Diverse Habitat
            </span>
            <h4 className="text-xl font-serif font-bold text-amber-950">{pollinatorSqFt} sq. ft</h4>
            <p className="text-[11px] text-amber-800/80">Canopy foraging zone for bees, songbirds, and indigenous insects.</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-[#fbf0f8] to-[#f6e1f0] border border-[#f0cbe7] space-y-1">
            <span className="text-2xl">💨</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-purple-700 block">
              Oxygen Production
            </span>
            <h4 className="text-xl font-serif font-bold text-purple-950">{oxygenProducedKg} kg / yr</h4>
            <p className="text-[11px] text-purple-700/80">Pure atmospheric oxygen released into regional air basins.</p>
          </div>
        </div>
      </div>

      {/* 4-Stage Tree Growth & Telemetry Lifecycle */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e2eae5] shadow-xs space-y-4">
        <div>
          <span className="text-[10px] font-bold text-[#1b7a43] uppercase tracking-widest font-mono">
            Growth Roadmap
          </span>
          <h3 className="text-base font-bold text-[#173324] mt-0.5">
            Afforestation Lifecycle & Field Care Journey
          </h3>
          <p className="text-xs text-[#52796f]">
            How your adopted living trees are nurtured, GPS tagged, and audited over their lifespan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
          {[
            {
              step: "01",
              title: "Nursery Acclimatization",
              status: "Completed ✓",
              statusColor: "text-emerald-700 bg-emerald-100",
              desc: "Native sapling selected for genetic vigor and hardened in micro-climate nurseries.",
              icon: "🌱",
            },
            {
              step: "02",
              title: "GPS Field Geo-Tagging",
              status: "Verified ✓",
              statusColor: "text-emerald-700 bg-emerald-100",
              desc: "Planted at verified reserve with organic compost and assigned unique cryptographic tag.",
              icon: "📍",
            },
            {
              step: "03",
              title: "Root Anchoring & Telemetry",
              status: "Active Monitoring",
              statusColor: "text-blue-700 bg-blue-100",
              desc: "Quarterly field visits by trained arborists inspect foliage canopy, soil hydration, and stem girth.",
              icon: "🌿",
            },
            {
              step: "04",
              title: "Perpetual Canopy & Carbon",
              status: "Permanent Heritage",
              statusColor: "text-purple-700 bg-purple-100",
              desc: "Mature tree produces ecological yield and enters the national afforestation ledger.",
              icon: "🌳",
            },
          ].map((phase, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-xl bg-[#fafcfb] border border-[#e2eae5] space-y-2 relative group hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{phase.icon}</span>
                <span className="text-[10px] font-bold font-mono text-gray-400">PHASE {phase.step}</span>
              </div>

              <div>
                <h5 className="text-xs font-bold text-[#173324]">{phase.title}</h5>
                <span
                  className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded-full mt-1 ${phase.statusColor}`}
                >
                  {phase.status}
                </span>
              </div>

              <p className="text-[11px] text-[#52796f] leading-snug">{phase.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
