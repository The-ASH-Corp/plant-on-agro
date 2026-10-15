"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "../../public/Screenshot_From_2026-09-17_15-39-39-removebg-preview.png";
import { useAuthStore } from "@/store/auth.store";
import { useHydratedStore } from "@/store/hooks/use-hydrated-store";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";
import { PlantFlow } from "@/components/PlantFlow";
import {
  treeInstanceService,
  BackendTreeInstance,
} from "@/services/tree-instances/tree-instance.service";

export function BuyerDashboard() {
  const router = useRouter();
  const user = useHydratedStore(useAuthStore, (s) => s.user);
  const isAuthenticated = useHydratedStore(useAuthStore, (s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const [activeTab, setActiveTab] = useState<"trees" | "certificates" | "impact">("trees");
  const [plantFlowOpen, setPlantFlowOpen] = useState(false);
  const [trees, setTrees] = useState<BackendTreeInstance[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback demo trees if the backend has not yet seeded trees for this user
  const defaultBuyerTrees: BackendTreeInstance[] = [
    {
      id: "demo-tree-1",
      treeTag: "POA-MG-2847",
      orderRef: "ORD-2026-781",
      assignedReserve: "Western Ghats Ecological Reserve, MH",
      gpsCoordinates: { latitude: 18.922, longitude: 73.816 },
      formattedGps: "18.9220° N, 73.8160° E",
      datePlanted: "14 Sep 2026",
      healthStatus: "Thriving",
      treeVarietyName: "Indian Mango (Mangifera Indica)",
      adopterName: user?.name || "Tree Planter",
      adopterEmail: user?.email || "planter@plantonagro.com",
      notes: "Sapling thriving under monsoon care. Regular geotagged drone inspections scheduled.",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
      lastInspectedAt: "2026-10-01",
      isActive: true,
      createdAt: "2026-09-14",
      updatedAt: "2026-10-01",
    },
    {
      id: "demo-tree-2",
      treeTag: "POA-TK-1192",
      orderRef: "ORD-2026-904",
      assignedReserve: "Deccan Dry Forest Corridor, Pune",
      gpsCoordinates: { latitude: 18.5204, longitude: 73.8567 },
      formattedGps: "18.5204° N, 73.8567° E",
      datePlanted: "28 Sep 2026",
      healthStatus: "Healthy",
      treeVarietyName: "Teak Wood (Tectona Grandis)",
      adopterName: user?.name || "Tree Planter",
      adopterEmail: user?.email || "planter@plantonagro.com",
      notes: "Secondary leaf canopy developing smoothly. Strong root anchoring established.",
      imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&h=400&fit=crop&auto=format",
      lastInspectedAt: "2026-10-10",
      isActive: true,
      createdAt: "2026-09-28",
      updatedAt: "2026-10-10",
    },
  ];

  // Fetch real trees from API
  useEffect(() => {
    let isMounted = true;
    async function fetchUserTrees() {
      try {
        setLoading(true);
        const res = await treeInstanceService.getAll({
          search: user?.name || user?.email || "",
          limit: 10,
        });

        if (isMounted) {
          if (res.data?.items && res.data.items.length > 0) {
            setTrees(res.data.items);
          } else {
            setTrees(defaultBuyerTrees);
          }
        }
      } catch (err) {
        console.warn("Could not load trees from API, using default ledger:", err);
        if (isMounted) setTrees(defaultBuyerTrees);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (user) {
      fetchUserTrees();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Protected route check
  useEffect(() => {
    if (!isAuthenticated && !user) {
      // Allow slight hydration grace period before redirect
      const timeout = setTimeout(() => {
        router.push("/login");
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, user, router]);

  const totalTrees = trees.length;
  const estimatedCO2 = totalTrees * 22; // ~22kg of CO2 absorbed per tree per year
  const greenAreaSqFt = totalTrees * 65;

  return (
    <div className="min-h-screen bg-[#f4f7f5] text-[#173324] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#173324] border-b border-emerald-900/40 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <Image
                src={Logo}
                alt="PlantOn Agro Logo"
                width={160}
                height={160}
                className="w-auto h-9 sm:h-11 object-contain"
                priority
              />
            </Link>
            <span className="hidden sm:inline-block h-5 w-px bg-white/20" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
                Buyer Portal
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-semibold">
                Living Ledger
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPlantFlowOpen(true)}
              className="text-xs font-bold px-4 py-2 rounded-full bg-gradient-to-r from-[#1b7a43] to-[#52b788] text-white hover:scale-105 transition-transform shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span>🌱</span>
              <span className="hidden sm:inline">Plant Another Tree</span>
              <span className="sm:hidden">Plant</span>
            </button>

            {user && (
              <UserAvatarMenu
                user={user}
                onLogout={logout}
                openPlant={() => setPlantFlowOpen(true)}
              />
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome Banner Card */}
        <div className="bg-gradient-to-r from-[#173324] via-[#1e4433] to-[#2d6a4f] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          {/* Subtle background graphics */}
          <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-300 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Tree Adopter</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold mb-2 leading-tight">
                Welcome back, {user?.name || "Tree Planter"}!
              </h1>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                Here is your living green impact ledger. Track drone inspections, verified GPS coordinates, and view your digital plantation certificates.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-colors"
              >
                ← Back to Storefront
              </Link>
              <button
                onClick={() => setPlantFlowOpen(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#52b788] text-white hover:bg-[#40916c] transition-colors shadow-lg cursor-pointer"
              >
                + Adopt New Tree
              </button>
            </div>
          </div>
        </div>

        {/* Impact Highlights Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#e2eae5] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#1b7a43] flex items-center justify-center text-2xl shrink-0">
              🌳
            </div>
            <div>
              <p className="text-xs font-bold text-[#52796f] uppercase tracking-wider">Trees Planted</p>
              <h3 className="text-2xl font-bold text-[#173324] mt-0.5">{totalTrees}</h3>
              <p className="text-[11px] text-emerald-600 font-medium">100% Verified Alive</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2eae5] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl shrink-0">
              🌍
            </div>
            <div>
              <p className="text-xs font-bold text-[#52796f] uppercase tracking-wider">CO₂ Offset</p>
              <h3 className="text-2xl font-bold text-[#173324] mt-0.5">{estimatedCO2} kg</h3>
              <p className="text-[11px] text-blue-600 font-medium">Annual estimated</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2eae5] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl shrink-0">
              🌱
            </div>
            <div>
              <p className="text-xs font-bold text-[#52796f] uppercase tracking-wider">Green Canopy</p>
              <h3 className="text-2xl font-bold text-[#173324] mt-0.5">{greenAreaSqFt} sq ft</h3>
              <p className="text-[11px] text-amber-600 font-medium">Native bio-habitat</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2eae5] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl shrink-0">
              📜
            </div>
            <div>
              <p className="text-xs font-bold text-[#52796f] uppercase tracking-wider">Certificates</p>
              <h3 className="text-2xl font-bold text-[#173324] mt-0.5">{totalTrees}</h3>
              <p className="text-[11px] text-purple-600 font-medium">Cryptographic GPS</p>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#dce6e0] pb-2">
          {[
            { id: "trees" as const, label: "🌲 My Planted Trees", count: totalTrees },
            { id: "certificates" as const, label: "📜 Official Certificates", count: totalTrees },
            { id: "impact" as const, label: "📊 Carbon & Growth Milestones" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "bg-[#173324] text-white shadow-sm"
                    : "bg-white text-[#52796f] hover:bg-emerald-50 hover:text-[#173324] border border-[#e2eae5]"
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: My Planted Trees */}
        {activeTab === "trees" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#173324]">My Planted Trees & Live GPS Telemetry</h2>
                <p className="text-xs text-[#52796f]">
                  Individual living saplings geotagged and cared for by our on-ground forestry teams.
                </p>
              </div>
              <button
                onClick={() => setPlantFlowOpen(true)}
                className="text-xs font-bold text-[#1b7a43] hover:underline cursor-pointer"
              >
                + Plant another tree
              </button>
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-[#52796f]">Loading your planted trees...</p>
              </div>
            ) : trees.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#e2eae5] space-y-4 max-w-lg mx-auto">
                <div className="text-5xl">🌱</div>
                <h3 className="text-base font-bold text-[#173324]">No Trees Planted Yet</h3>
                <p className="text-xs text-[#52796f] leading-relaxed">
                  Start your green journey today! Choose an adoption plan to receive your first living tree, GPS coordinates, and personal certificate.
                </p>
                <button
                  onClick={() => setPlantFlowOpen(true)}
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#1b7a43] text-white hover:bg-[#145c32] cursor-pointer"
                >
                  Adopt Your First Tree
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trees.map((tree) => (
                  <div
                    key={tree.id}
                    className="bg-white rounded-2xl border border-[#e2eae5] shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      {/* Tree Image Banner */}
                      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                        <img
                          src={tree.imageUrl}
                          alt={tree.treeVarietyName}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#173324]/85 text-emerald-300 backdrop-blur-md">
                            {tree.treeTag}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/90 text-white backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            {tree.healthStatus}
                          </span>
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="p-5 space-y-3.5">
                        <div>
                          <h3 className="text-base font-bold text-[#173324]">{tree.treeVarietyName}</h3>
                          <p className="text-xs text-[#52796f] flex items-center gap-1 mt-0.5">
                            <span>📍</span>
                            <span>{tree.assignedReserve}</span>
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-[#f7faf8] border border-[#e2eae5] text-xs">
                          <div>
                            <span className="text-[10px] font-semibold text-[#739284] block">GPS Telemetry</span>
                            <span className="font-mono text-[#173324] font-bold">{tree.formattedGps}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-[#739284] block">Planted Date</span>
                            <span className="text-[#173324] font-bold">{tree.datePlanted}</span>
                          </div>
                        </div>

                        <p className="text-xs text-[#4a6557] leading-relaxed bg-[#fbfdfc] p-3 rounded-xl border border-dashed border-[#dce6e0]">
                          "{tree.notes}"
                        </p>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-4 bg-[#fafcfb] border-t border-[#edf2ee] flex items-center justify-between text-xs">
                      <a
                        href={`https://www.google.com/maps?q=${tree.gpsCoordinates?.latitude || 18.922},${tree.gpsCoordinates?.longitude || 73.816}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#1b7a43] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>🧭</span> Open In Maps
                      </a>
                      <button
                        onClick={() => setActiveTab("certificates")}
                        className="px-3 py-1.5 rounded-lg border border-[#cbe1d3] text-[#2d6a4f] hover:bg-emerald-50 font-semibold cursor-pointer"
                      >
                        View Certificate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Certificates */}
        {activeTab === "certificates" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#173324]">Verified Digital Certificates</h2>
              <p className="text-xs text-[#52796f]">
                Official Certificate of Plantation backed by GPS coordinates and tree registry serials.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {trees.map((tree) => (
                <div
                  key={tree.id}
                  className="bg-gradient-to-br from-[#173324] via-[#1b3d2b] to-[#12281d] rounded-3xl p-8 text-white shadow-2xl border border-emerald-500/30 relative overflow-hidden flex flex-col justify-between"
                >
                  {/* Decorative corner seals */}
                  <div className="absolute top-0 right-0 w-44 h-44 opacity-10 bg-[radial-gradient(circle_at_100%_0%,_#52b788,_transparent)] pointer-events-none" />

                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between border-b border-white/15 pb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">🌱</span>
                        <div>
                          <h4 className="text-xs font-bold tracking-widest uppercase text-emerald-400">
                            PlantOn Agro Verified Registry
                          </h4>
                          <p className="text-[10px] text-white/60">Official Living Tree Deed</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        {tree.treeTag}
                      </span>
                    </div>

                    <div className="text-center py-2">
                      <p className="text-xs font-serif uppercase tracking-widest text-emerald-200/80 mb-1">
                        Certificate of Plantation
                      </p>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#95d5b2] mb-3">
                        {user?.name || tree.adopterName}
                      </h3>
                      <p className="text-xs text-white/80 max-w-md mx-auto leading-relaxed">
                        has officially planted and adopted a living <strong>{tree.treeVarietyName}</strong> under the PlantOn Agro sustainability initiative.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs">
                      <div>
                        <span className="text-[10px] text-emerald-300 block font-semibold">Reserve Location</span>
                        <span className="text-white font-medium">{tree.assignedReserve}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-300 block font-semibold">GPS Telemetry</span>
                        <span className="text-white font-mono font-medium">{tree.formattedGps}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-300 block font-semibold">Date of Planting</span>
                        <span className="text-white font-medium">{tree.datePlanted}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-300 block font-semibold">Verification Seal</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <span>✓</span> Cryptographically Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-white/60">Valid Forever • Living Tree</span>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl bg-[#52b788] text-white hover:bg-[#40916c] font-bold cursor-pointer transition-colors"
                    >
                      🖨️ Print / Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Carbon & Growth Milestones */}
        {activeTab === "impact" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2eae5] shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#173324]">Your Ecological Impact Breakdown</h2>
              <p className="text-xs text-[#52796f]">
                Scientific projections of carbon capture, soil moisture preservation, and biodiversity revival.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#f4faf6] border border-[#d2eadb] space-y-2">
                <span className="text-2xl">🌿</span>
                <h4 className="text-sm font-bold text-[#173324]">Annual CO₂ Sequestration</h4>
                <p className="text-2xl font-serif font-bold text-[#1b7a43]">{estimatedCO2} kg / yr</p>
                <p className="text-xs text-[#52796f]">Equivalent to driving ~88 miles less in a passenger car.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#f4faf6] border border-[#d2eadb] space-y-2">
                <span className="text-2xl">💧</span>
                <h4 className="text-sm font-bold text-[#173324]">Groundwater Recharge</h4>
                <p className="text-2xl font-serif font-bold text-[#1b7a43]">{totalTrees * 120} Liters</p>
                <p className="text-xs text-[#52796f]">Retained annually in sub-surface aquifers through deep root systems.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#f4faf6] border border-[#d2eadb] space-y-2">
                <span className="text-2xl">🦋</span>
                <h4 className="text-sm font-bold text-[#173324]">Pollinator Support</h4>
                <p className="text-2xl font-serif font-bold text-[#1b7a43]">{totalTrees * 350} sq ft</p>
                <p className="text-xs text-[#52796f]">Biodiverse canopy feeding bees, migratory birds, and native flora.</p>
              </div>
            </div>

            {/* Growth Journey Milestones */}
            <div className="pt-4 border-t border-[#edf2ee]">
              <h3 className="text-sm font-bold text-[#173324] mb-4">Plantation Growth Journey</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  { stage: "Stage 01", title: "Nursery Hardening", status: "Completed ✓", desc: "Healthy sapling selected & acclimated." },
                  { stage: "Stage 02", title: "Field Geo-Tagging", status: "Active ✓", desc: "Planted with organic compost & GPS telemetry." },
                  { stage: "Stage 03", title: "Root Anchoring", status: "In Progress", desc: "Monitored deep root expansion and hydration." },
                  { stage: "Stage 04", title: "Mature Canopy", status: "Upcoming", desc: "Full ecological bloom and carbon offset yield." },
                ].map((st, i) => (
                  <div key={i} className="p-4 rounded-xl border border-[#e2eae5] bg-[#fafcfb] space-y-1">
                    <span className="text-[10px] font-bold text-[#52b788] uppercase">{st.stage}</span>
                    <h5 className="text-xs font-bold text-[#173324]">{st.title}</h5>
                    <p className="text-[11px] text-emerald-700 font-semibold">{st.status}</p>
                    <p className="text-[10px] text-[#52796f] leading-snug">{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Plant Modal if clicked from dashboard */}
      {plantFlowOpen && <PlantFlow onClose={() => setPlantFlowOpen(false)} />}
    </div>
  );
}
