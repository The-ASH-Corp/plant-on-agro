"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useHydratedStore } from "@/store/hooks/use-hydrated-store";
import { PlantFlow } from "@/components/plant-flow";
import {
  treeInstanceService,
  BackendTreeInstance,
} from "@/services/tree-instances/tree-instance.service";

import { BuyerDashboardTab, BuyerKpiData } from "./types";
import { BuyerHeader } from "./BuyerHeader";
import { BuyerHeroBanner } from "./BuyerHeroBanner";
import { BuyerKpiGrid } from "./BuyerKpiGrid";
import { BuyerTreesTab } from "./BuyerTreesTab";
import { BuyerCertificatesTab } from "./BuyerCertificatesTab";
import { BuyerImpactTab } from "./BuyerImpactTab";
import { CertificateModal } from "./CertificateModal";
import { BuyerSidebarWidgets } from "./BuyerSidebarWidgets";

export function BuyerDashboard() {
  const router = useRouter();
  const user = useHydratedStore(useAuthStore, (s) => s.user);
  const isAuthenticated = useHydratedStore(useAuthStore, (s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const [activeTab, setActiveTab] = useState<BuyerDashboardTab>("trees");
  const [plantFlowOpen, setPlantFlowOpen] = useState(false);
  const [selectedCertificateTree, setSelectedCertificateTree] = useState<BackendTreeInstance | null>(null);
  const [trees, setTrees] = useState<BackendTreeInstance[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback demo trees so buyer dashboard is instantly alive, rich, and inspiring
  const defaultBuyerTrees: BackendTreeInstance[] = [
    {
      id: "demo-tree-1",
      treeTag: "POA-MG-2847",
      orderRef: "ORD-2026-781",
      assignedReserve: "Western Ghats Ecological Corridor, MH",
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
      assignedReserve: "Deccan Dry Forest Patch, Pune",
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

        const storedBuyerTrees: BackendTreeInstance[] = (() => {
          if (typeof window !== "undefined") {
            try {
              const raw = localStorage.getItem("poa_buyer_trees");
              return raw ? JSON.parse(raw) : [];
            } catch {
              return [];
            }
          }
          return [];
        })();

        if (isMounted) {
          if (res.data?.items && res.data.items.length > 0) {
            const apiIds = new Set(res.data.items.map((i) => i.id));
            setTrees([...storedBuyerTrees.filter((s) => !apiIds.has(s.id)), ...res.data.items]);
          } else {
            setTrees([...storedBuyerTrees, ...defaultBuyerTrees]);
          }
        }
      } catch (err) {
        console.warn("Could not load trees from API, using default ledger:", err);
        const storedBuyerTrees: BackendTreeInstance[] = (() => {
          if (typeof window !== "undefined") {
            try {
              const raw = localStorage.getItem("poa_buyer_trees");
              return raw ? JSON.parse(raw) : [];
            } catch {
              return [];
            }
          }
          return [];
        })();
        if (isMounted) setTrees([...storedBuyerTrees, ...defaultBuyerTrees]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchUserTrees();

    // Real-time listener for test orders
    const handleNewOrder = (e: any) => {
      if (Array.isArray(e.detail?.instances)) {
        const insts = e.detail.instances as BackendTreeInstance[];
        const instIds = new Set(insts.map((i) => i.id));
        setTrees((prev) => [...insts, ...prev.filter((t) => !instIds.has(t.id))]);
      } else if (e.detail?.instance) {
        const inst = e.detail.instance as BackendTreeInstance;
        setTrees((prev) => [inst, ...prev.filter((t) => t.id !== inst.id)]);
      }
    };
    window.addEventListener("poa-new-order", handleNewOrder);

    return () => {
      isMounted = false;
      window.removeEventListener("poa-new-order", handleNewOrder);
    };
  }, [user]);

  // Protected route check (allows viewing newly adopted trees in test mode)
  useEffect(() => {
    const hasTestTrees =
      typeof window !== "undefined" &&
      Boolean(localStorage.getItem("poa_buyer_trees"));

    if (!isAuthenticated && !user && !hasTestTrees) {
      const timeout = setTimeout(() => {
        router.push("/login");
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, user, router]);

  const totalTrees = trees.length;
  const estimatedCO2 = totalTrees * 22; // ~22kg of CO2 absorbed per tree per year
  const greenAreaSqFt = totalTrees * 65;

  const kpiData: BuyerKpiData = {
    totalTrees,
    estimatedCO2,
    greenAreaSqFt,
    certificatesCount: totalTrees,
    healthRate: 100,
  };

  return (
    <div className="min-h-screen bg-[#f3f7f4] text-[#173324] flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <BuyerHeader
        user={user}
        onLogout={logout}
        onOpenPlantFlow={() => setPlantFlowOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1540px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 space-y-4 sm:space-y-5">
        {/* Executive Hero Card */}
        <BuyerHeroBanner
          user={user}
          totalTrees={totalTrees}
          onOpenPlantFlow={() => setPlantFlowOpen(true)}
          onSelectTab={setActiveTab}
        />

        {/* 4 Interactive KPI Power Cards */}
        <BuyerKpiGrid kpi={kpiData} />

        {/* Main Content & Telemetry Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Main Column (8 Cols on Desktop) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Tab Navigation Controls */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#dce6df] pb-2">
              {[
                { id: "trees" as const, label: "🌲 My Adopted Trees", count: totalTrees, desc: "Living specimens & GPS" },
                { id: "certificates" as const, label: "📜 Official Deeds", count: totalTrees, desc: "Certified proof" },
                { id: "impact" as const, label: "📊 Carbon & Growth Milestones", desc: "Scientific ledger" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? "bg-[#173324] text-white shadow-sm shadow-emerald-950/20"
                        : "bg-white text-[#52796f] hover:bg-emerald-50 hover:text-[#173324] border border-[#e2eae5]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {typeof tab.count === "number" && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
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

            {/* Active Tab View */}
            {activeTab === "trees" && (
              <BuyerTreesTab
                trees={trees}
                loading={loading}
                onOpenPlantFlow={() => setPlantFlowOpen(true)}
                onViewCertificate={(tree) => setSelectedCertificateTree(tree)}
              />
            )}

            {activeTab === "certificates" && (
              <BuyerCertificatesTab
                trees={trees}
                userName={user?.name}
                onOpenModal={(tree) => setSelectedCertificateTree(tree)}
              />
            )}

            {activeTab === "impact" && (
              <BuyerImpactTab
                totalTrees={totalTrees}
                estimatedCO2={estimatedCO2}
              />
            )}
          </div>

          {/* Sidebar Column (4 Cols on Desktop) */}
          <div className="lg:col-span-4">
            <BuyerSidebarWidgets
              trees={trees}
              user={user}
              onOpenPlantFlow={() => setPlantFlowOpen(true)}
              onSelectTreeDeed={(tree) => setSelectedCertificateTree(tree)}
            />
          </div>
        </div>
      </main>

      {/* Certificate Modal */}
      <CertificateModal
        tree={selectedCertificateTree}
        userName={user?.name}
        onClose={() => setSelectedCertificateTree(null)}
      />

      {/* Plant Tree Modal */}
      {plantFlowOpen && <PlantFlow onClose={() => setPlantFlowOpen(false)} />}
    </div>
  );
}
export default BuyerDashboard;
