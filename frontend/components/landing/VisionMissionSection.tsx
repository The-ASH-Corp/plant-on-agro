"use client";

import { useState } from "react";
import { VisionMissionSectionContent } from "@/services/landing-page/landing-page.service";

interface VisionMissionSectionProps {
  content?: VisionMissionSectionContent;
  openPlant?: (planId?: string) => void;
  onExplorePlans?: () => void;
}

interface MetricBoxProps {
  value: string;
  label: string;
  accentColor?: "emerald" | "amber";
}

function MetricBox({ value, label, accentColor = "emerald" }: MetricBoxProps) {
  const raw = (value || "").trim();

  // Extract parenthetical sub-value, e.g. "20 Lakh (2,000,000)" -> primary: "20 Lakh", secondary: "(2,000,000)"
  const parenMatch = raw.match(/^(.*?)\s*(\([^)]+\))\s*$/);
  let primary = parenMatch ? parenMatch[1].trim() : raw;
  const secondary = parenMatch ? parenMatch[2].trim() : null;

  // Clean redundant units if the label already contains that unit (e.g. "20 Acres" with label "PlantOn Acres")
  const labelWords = label.toLowerCase().split(/\s+/);
  const primaryParts = primary.split(/\s+/);
  if (primaryParts.length > 1) {
    const lastPart = primaryParts[primaryParts.length - 1].toLowerCase().replace(/s$/, "");
    const matchesLabel = labelWords.some((w) => w.replace(/s$/, "") === lastPart);
    if (matchesLabel && /^\d+[\d,.]*$/.test(primaryParts[0])) {
      primary = primaryParts.slice(0, -1).join(" ");
    }
  }

  // Adaptive font sizing based on length so text always fits cleanly inside the card
  const primaryLen = primary.length;
  let textSizeClass = "text-xl sm:text-2xl lg:text-3xl";
  if (primaryLen > 8) {
    textSizeClass = "text-sm sm:text-base lg:text-lg";
  } else if (primaryLen > 5) {
    textSizeClass = "text-base sm:text-lg lg:text-xl";
  } else if (primaryLen > 3) {
    textSizeClass = "text-lg sm:text-xl lg:text-2xl";
  }

  const textColorClass = accentColor === "amber" ? "text-amber-300" : "text-[#95d5b2]";
  const secondaryColorClass = accentColor === "amber" ? "text-amber-200/80" : "text-emerald-200/80";

  return (
    <div className="flex flex-col items-center justify-center min-h-[96px] sm:min-h-[104px] px-2 py-3 sm:px-3 sm:py-3.5 rounded-2xl bg-white/10 border border-white/15 text-center overflow-hidden hover:bg-white/15 transition-all">
      <div className="flex flex-col items-center justify-center min-h-[38px] leading-none">
        <span
          className={`${textSizeClass} font-black ${textColorClass} tracking-tight tabular-nums block whitespace-nowrap leading-tight`}
        >
          {primary}
        </span>
        {secondary && (
          <span
            className={`text-[10px] sm:text-[11px] font-mono font-medium ${secondaryColorClass} tracking-tight block mt-0.5 whitespace-nowrap`}
          >
            {secondary}
          </span>
        )}
      </div>
      <span className="text-[10px] sm:text-[11px] uppercase font-bold text-emerald-200/90 tracking-wider block mt-1 leading-tight">
        {label}
      </span>
    </div>
  );
}

export function VisionMissionSection({
  content,
  openPlant,
  onExplorePlans,
}: VisionMissionSectionProps) {
  const [activeTab, setActiveTab] = useState<"initial" | "fiveYear">("initial");

  const badgeText = content?.badge || "🌿 Integrated Agro-Forestry, Nature Tourism & Wellness Ecosystem";
  const headlinePart1 = content?.headline || "Plant a Story.";
  const headlinePart2 = content?.headlineHighlight || "Grow a Legacy.";
  const desc = content?.description || "Building technology-enabled living forests, regenerative farms, and immersive nature destinations across India.";
  const locationTag = content?.locationTag || "📍 Flagship Project: Kerala | 2026";
  const reserveTag = content?.reserveTag || "📐 30-Acre Master Reserve";
  const initialTreesTag = content?.initialTreesTag || "🌱 1,00,000 Tree Initial Mission";

  const visionTitle = content?.visionTitle || "The PlantOn Vision";
  const visionDesc = content?.visionDescription || "To build the world's most transparent, connected, and physically verifiable green ecosystem—where adopting a tree is not just a digital transaction, but the beginning of a lifelong relationship with living nature.";

  const missionTitle = content?.missionTitle || "Our Immediate & Long-Term Mission";
  const missionSub = content?.missionSubtitle || "A structured, phased pathway from our 30-acre Kerala flagship to a pan-national 600-acre regenerative network.";

  const initialTrees = content?.initialTrees || "1,00,000";
  const initialAcres = content?.initialAcres || "20";
  const fiveYearTrees = content?.fiveYearTrees || "20 Lakh";
  const fiveYearLocations = content?.fiveYearLocations || "20";
  const fiveYearTotalAcres = content?.fiveYearTotalAcres || "600";

  const fourLayers = [
    {
      num: "01",
      badge: "Living Biosphere",
      title: "PLANTON FOREST",
      icon: "🌳",
      desc: "Tree planting, native biodiversity conservation, and multi-decade arborist stewardship. We don't plant saplings and walk away—we cultivate thriving perpetual biomes.",
      points: [
        "Native & endemic species selection",
        "Soil microbiome & hydrology enrichment",
        "Lifetime arborist care & maintenance",
      ],
    },
    {
      num: "02",
      badge: "Productive Earth",
      title: "PLANTON AGRO",
      icon: "🥑",
      desc: "Fruit plantations, regenerative agriculture, seasonal harvesting, and scientific nursery operations generating recurring ecological and economic value.",
      points: [
        "Mango, Jackfruit, Mahua & Spice canopy",
        "Regenerative zero-chemical farming",
        "Nursery sapling breeding operations",
      ],
    },
    {
      num: "03",
      badge: "Verifiable Proof",
      title: "PLANTON DIGITAL",
      icon: "🛰️",
      desc: "Every tree is assigned a physical RFID tag, micro-level ground GPS coordinates, periodic photographic growth timelines, and a legal digital deed.",
      points: [
        "Individual Tree IDs & Monospace tags",
        "Exact Ground GPS telemetry coordinates",
        "Interactive customer dashboard & updates",
      ],
    },
    {
      num: "04",
      badge: "Sensory Sanctuary",
      title: "PLANTON EXPERIENCE",
      icon: "🏡",
      desc: "Forest walks, plantation visits, traditional heritage stays, Ayurvedic wellness, harvesting workshops, and memorable nature immersion for adopters and families.",
      points: [
        "Personal grove visits & plantation walks",
        "Mud bath, ice bath & Ayurvedic spa",
        "Farm-to-table culinary & pottery retreats",
      ],
    },
  ];

  const flagshipComponents = [
    {
      title: "PlantOn Living Forest",
      size: "20 Acres",
      tagline: "Core Agro-Forestry & Adopter Groves",
      target: "1,00,000 Trees / Plants",
      icon: "🌲",
      cardBg: "bg-[#f4f8f5]",
      border: "border-emerald-200/80",
      accent: "text-[#1b7a43]",
      items: [
        "Dense forest zones & biodiversity corridors",
        "Multi-canopy Agroforestry & fruit plantations",
        "Central nursery & sapling research hub",
        "Regenerative organic farming & harvesting",
        "Walking trails, plantation paths & customer groves",
      ],
    },
    {
      title: "Nature Tourism & Wellness Ecosystem",
      size: "10 Acres Adjacent",
      tagline: "Eco-Stays, Ayurvedic Wellness & Experiential Retreats",
      target: "Integrated Hospitality Destination",
      icon: "🛖",
      cardBg: "bg-[#fbf8f2]",
      border: "border-amber-200/80",
      accent: "text-amber-800",
      items: [
        "Heritage natural wooden cottages & eco-stays",
        "Ayurvedic Spa, Ice bath, Mud bath & Sauna",
        "Nature trails & guided forest exploration walks",
        "Pottery workshops & creative healing centers",
        "Artificial ponds & regenerative farm experiences",
      ],
    },
  ];

  return (
    <section
      id="vision-mission"
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: "var(--color-cream)" }}
    >
      {/* Background ambient lighting synced with project cream/sage palette */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-emerald-100/50 via-[#eef6f0]/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 rounded-full bg-[#2d6a4f]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        {/* ========================================================= */}
        {/* HEADER: BRAND IDENTITY & PHILOSOPHY */}
        {/* ========================================================= */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 text-[#2d6a4f] text-xs sm:text-sm font-semibold tracking-wide border border-emerald-200 shadow-2xs">
            <span>🌿</span>
            <span>{badgeText}</span>
          </div>

          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-4xl sm:text-5xl lg:text-6xl text-[#173324] font-bold tracking-tight leading-[1.15]"
          >
            {headlinePart1} <span className="text-[#2d6a4f]">{headlinePart2}</span>
          </h2>

          <p className="text-gray-600 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl mx-auto">
            {desc}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-mono text-[#2d6a4f]">
            <span className="px-3.5 py-1.5 rounded-xl bg-white border border-[#d2ded7] shadow-2xs">
              {locationTag}
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white border border-[#d2ded7] shadow-2xs">
              {reserveTag}
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white border border-[#d2ded7] shadow-2xs">
              {initialTreesTag}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PROBLEM & SOLUTION: "What if planting trees became a lifetime experience?" */}
        {/* ========================================================= */}
        <div className="rounded-3xl bg-white border border-[#e2eae5] p-6 sm:p-10 lg:p-12 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: The Reality / Problem */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2d6a4f] font-bold">
                The Opportunity
              </span>
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#173324] leading-snug"
              >
                What if planting trees became a lifetime experience?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                People genuinely want to contribute to nature. Yet, millions cannot because they:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#173324] font-medium">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f8faf9] border border-[#e2eae5]">
                  <span className="text-rose-500 font-bold">✕</span> Don’t own fertile land
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f8faf9] border border-[#e2eae5]">
                  <span className="text-rose-500 font-bold">✕</span> Lack time to maintain trees
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f8faf9] border border-[#e2eae5]">
                  <span className="text-rose-500 font-bold">✕</span> Live away from home or abroad
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f8faf9] border border-[#e2eae5]">
                  <span className="text-rose-500 font-bold">✕</span> Lack visible proof of impact
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs sm:text-sm text-[#173324] leading-relaxed">
                💡 <strong className="text-[#1b7a43]">PlantOn bridges this gap:</strong> Customers fund professionally managed plantations, celebrate birthdays, weddings, or memorials, and remain digitally connected to their living trees for life.
              </div>
            </div>

            {/* Right: The 4-Beat Solution */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#2d6a4f] font-semibold mb-2">
                The 4-Step Lifelong Journey
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-5 rounded-2xl bg-[#f8faf9] border border-[#e2eae5] hover:border-[#1b7a43] hover:shadow-md transition-all group">
                  <span className="text-2xl font-mono font-bold text-[#1b7a43]">01</span>
                  <h4 className="text-base sm:text-lg font-bold text-[#173324] mt-1 group-hover:text-[#1b7a43] transition-colors">
                    We Plant.
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Native biodiverse species planted by certified arborists on fertile reserve soil.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#f8faf9] border border-[#e2eae5] hover:border-[#1b7a43] hover:shadow-md transition-all group">
                  <span className="text-2xl font-mono font-bold text-[#1b7a43]">02</span>
                  <h4 className="text-base sm:text-lg font-bold text-[#173324] mt-1 group-hover:text-[#1b7a43] transition-colors">
                    We Grow.
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Lifetime organic nourishment, drip-irrigation, and continuous health monitoring.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#f8faf9] border border-[#e2eae5] hover:border-[#1b7a43] hover:shadow-md transition-all group">
                  <span className="text-2xl font-mono font-bold text-[#1b7a43]">03</span>
                  <h4 className="text-base sm:text-lg font-bold text-[#173324] mt-1 group-hover:text-[#1b7a43] transition-colors">
                    They Track.
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Verified ground GPS coordinates, photographic milestones, and digital certificate deed.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#f8faf9] border border-[#e2eae5] hover:border-[#1b7a43] hover:shadow-md transition-all group">
                  <span className="text-2xl font-mono font-bold text-[#1b7a43]">04</span>
                  <h4 className="text-base sm:text-lg font-bold text-[#173324] mt-1 group-hover:text-[#1b7a43] transition-colors">
                    They Visit.
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Walk through your personalized grove, harvest seasonal fruits, and stay in eco-cottages.
                  </p>
                </div>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#2d6a4f] italic">
                  🌿 “The forest continues growing, and your legacy endures.”
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CORE VISION & MISSION CARDS */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* VISION CARD (Clean Elevated White) */}
          <div className="lg:col-span-5 rounded-3xl bg-white border border-[#e2eae5] p-8 sm:p-10 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 text-[#2d6a4f] text-xs font-bold tracking-widest uppercase border border-emerald-200">
                🔭 Our Vision
              </div>

              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#173324] leading-snug"
              >
                {visionTitle}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                {visionDesc}
              </p>
            </div>

            <div className="pt-8 border-t border-[#f0f4f1] mt-8 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#2d6a4f] font-bold block">
                Foundational Pillars
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[#173324] font-medium">
                  🌱 Living Forests
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[#173324] font-medium">
                  🛰️ GPS Telemetry
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[#173324] font-medium">
                  🛖 Eco-Tourism
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[#173324] font-medium">
                  📜 Verified Deeds
                </span>
              </div>
            </div>
          </div>

          {/* MISSION CARD (Signature Brand Forest Card with Milestone Tabs) */}
          <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-[#173324] via-[#1b4332] to-[#2d6a4f] p-8 sm:p-10 flex flex-col justify-between shadow-xl relative overflow-hidden border border-emerald-600/30 text-white">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold tracking-widest uppercase border border-emerald-400/30">
                  🎯 Our Mission
                </div>

                {/* Milestone Toggle Tabs */}
                <div className="inline-flex p-1 rounded-xl bg-black/30 border border-emerald-500/30 self-start sm:self-auto">
                  <button
                    onClick={() => setActiveTab("initial")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "initial"
                        ? "bg-white text-[#173324] shadow-sm"
                        : "text-emerald-200 hover:text-white"
                    }`}
                  >
                    Initial Mission (Year 1)
                  </button>
                  <button
                    onClick={() => setActiveTab("fiveYear")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "fiveYear"
                        ? "bg-white text-[#173324] shadow-sm"
                        : "text-emerald-200 hover:text-white"
                    }`}
                  >
                    5-Year Mission
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-white">
                  {missionTitle}
                </h4>
                <p className="text-emerald-200 font-mono text-sm sm:text-base font-medium mt-1">
                  {missionSub}
                </p>
              </div>

              {/* Tab 1: Initial Mission */}
              {activeTab === "initial" ? (
                <div className="space-y-4 animate-fadeIn">
                  <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                    Establishing our flagship high-density living reserve in Kerala to prove our full-stack model of agroforestry, telemetry, and visitor hospitality.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
                    <MetricBox
                      value={initialTrees}
                      label="Trees & Plants"
                      accentColor="emerald"
                    />
                    <MetricBox
                      value={initialAcres}
                      label="PlantOn Acres"
                      accentColor="emerald"
                    />
                    <MetricBox
                      value="1"
                      label="Flagship Forest"
                      accentColor="emerald"
                    />
                    <MetricBox
                      value="1 Year"
                      label="Establishment"
                      accentColor="emerald"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/30 border border-emerald-500/25 text-xs text-emerald-200 flex items-center justify-between">
                    <span>📍 Flagship Site: Kerala (2026 Launch)</span>
                    <span className="font-mono text-[#95d5b2] font-bold">₹20–25 Cr Booking Potential</span>
                  </div>
                </div>
              ) : (
                /* Tab 2: 5-Year Mission */
                <div className="space-y-4 animate-fadeIn">
                  <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                    Scaling the proven Kerala blueprint across 20 strategic agro-climatic locations in India, creating a self-sustaining green corridor network.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
                    <MetricBox
                      value={fiveYearTrees}
                      label="Trees & Canopy"
                      accentColor="amber"
                    />
                    <MetricBox
                      value={fiveYearLocations}
                      label="Locations"
                      accentColor="amber"
                    />
                    <MetricBox
                      value="400"
                      label="Forest Acres"
                      accentColor="amber"
                    />
                    <MetricBox
                      value={fiveYearTotalAcres}
                      label="Total Acres"
                      accentColor="amber"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/30 border border-emerald-500/25 text-xs text-emerald-200 flex items-center justify-between">
                    <span>🌐 400 Acres Living Forest + 200 Acres Nature Tourism & Wellness Destinations</span>
                    <span className="font-mono text-amber-300 font-bold">₹400–500 Cr Ecosystem</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Quote */}
            <div className="pt-6 border-t border-emerald-500/30 mt-6 flex items-center justify-between text-xs text-emerald-200/80 italic">
              <span>“The first forest proves the model. The next 19 build the network.”</span>
              <span className="font-mono text-[#95d5b2] not-italic font-bold">2026 — 2031</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* FOUR CONNECTED LAYERS: "More Than Tree Planting" */}
        {/* ========================================================= */}
        <div className="space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2d6a4f] font-bold">
              Integrated System Architecture
            </span>
            <h3
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl sm:text-4xl font-bold text-[#173324]"
            >
              More Than Tree Planting
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              PlantOn is engineered around four interconnected operational layers that transform a conventional plantation into a permanent, verifiable, and revenue-generating nature asset.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fourLayers.map((layer) => (
              <div
                key={layer.num}
                className="rounded-3xl bg-white border border-[#e2eae5] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#1b7a43] hover:translate-y-[-4px] transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{layer.icon}</span>
                    <span className="text-2xl font-mono font-bold text-gray-300 group-hover:text-[#1b7a43] transition-colors">
                      {layer.num}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#2d6a4f] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block">
                      {layer.badge}
                    </span>
                    <h4 className="text-lg font-bold text-[#173324] mt-2 group-hover:text-[#1b7a43] transition-colors">
                      {layer.title}
                    </h4>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {layer.desc}
                  </p>
                </div>

                <div className="pt-5 border-t border-[#f0f4f1] mt-6 space-y-2">
                  {layer.points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-[#173324]">
                      <span className="text-[#1b7a43] font-bold shrink-0">✓</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs font-mono text-gray-500 pt-2">
            Every adopted tree is intended to possess a transparent digital journey including cryptographic serial identity, telemetry coordinates, and growth timelines.
          </p>
        </div>

        {/* ========================================================= */}
        {/* THE 30-ACRE FLAGSHIP DESTINATION BREAKDOWN */}
        {/* ========================================================= */}
        <div className="rounded-3xl bg-white border border-[#e2eae5] p-6 sm:p-10 lg:p-12 shadow-lg relative overflow-hidden space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#f0f4f1] pb-8">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2d6a4f] font-bold">
                Flagship Model Showcase
              </span>
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="text-3xl sm:text-4xl font-bold text-[#173324]"
              >
                30-Acre Integrated Nature Destination
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                A self-sustaining collaborative ecosystem where agroforestry meets regenerative tourism and restorative Ayurvedic wellness.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start lg:self-auto">
              <div className="px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-right">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#2d6a4f] font-bold block">
                  Total Ecosystem
                </span>
                <span className="text-2xl font-mono font-extrabold text-[#173324]">
                  30 Acres
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {flagshipComponents.map((comp, idx) => (
              <div
                key={idx}
                className={`rounded-2xl ${comp.cardBg} border ${comp.border} p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{comp.icon}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white text-[#173324] border border-[#d2ded7] shadow-2xs">
                      {comp.size}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl sm:text-2xl font-bold text-[#173324]">
                      {comp.title}
                    </h4>
                    <p className={`text-xs sm:text-sm font-semibold mt-0.5 ${comp.accent}`}>
                      {comp.tagline}
                    </p>
                  </div>

                  <div className="py-2 px-3.5 rounded-xl bg-white border border-[#d2ded7] inline-block text-xs font-mono text-[#173324] shadow-2xs">
                    🎯 Target: <strong>{comp.target}</strong>
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-[#dce7e1]">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#2d6a4f] font-bold block">
                    Planned Components
                  </span>
                  {comp.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex items-center gap-2.5 text-xs text-[#173324]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1b7a43] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-[#f8faf9] border border-[#e2eae5] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="text-xs sm:text-sm text-[#173324] leading-relaxed">
              🌲 <strong className="text-[#1b7a43]">PlantOn creates the living forest.</strong> Seamlessly integrated with adjacent eco-tourism, farm retreats, and holistic Ayurvedic wellness destinations.
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => openPlant?.()}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#173324] text-white hover:bg-[#1b7a43] transition-all shadow-md cursor-pointer"
              >
                Adopt in Flagship Forest
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* NETWORK AMBITION BANNER */}
        {/* ========================================================= */}
        <div className="rounded-3xl bg-gradient-to-r from-[#173324] via-[#1b4332] to-[#2d6a4f] border border-emerald-600/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl text-white space-y-6">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="px-3.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-mono font-bold tracking-widest uppercase border border-emerald-400/30 inline-block">
              Scale & Future Vision
            </span>

            <h3
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight"
            >
              We Are Not Building One Farm.
              <br />
              <span className="text-[#95d5b2]">We Are Building a Network of Living Forests.</span>
            </h3>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-light">
              A future where every adopter can open one application and see:
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 pt-2">
              {["My Trees", "My Grove", "My Forest", "My Impact", "My Visits", "My Memories"].map(
                (item, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-xl bg-black/30 border border-emerald-400/30 text-xs sm:text-sm font-semibold text-white tracking-wide"
                  >
                    🌿 {item}
                  </span>
                )
              )}
            </div>
            <p className="text-xs font-mono text-emerald-200/80 pt-2">
              Seamlessly connected across 20 biodiversity destinations nationwide.
            </p>
          </div>

          <div className="pt-6 border-t border-emerald-500/20 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => openPlant?.()}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white text-[#173324] hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              🌱 Start Your Living Tree Legacy
            </button>
            {onExplorePlans && (
              <button
                onClick={onExplorePlans}
                className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-950/80 text-emerald-200 border border-emerald-500/40 hover:bg-emerald-900 transition-all cursor-pointer"
              >
                Explore Adoption Plans & Pricing
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
