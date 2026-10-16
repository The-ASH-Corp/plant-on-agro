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

  // Fetch real trees from MongoDB database via treeInstanceService
  useEffect(() => {
    let isMounted = true;
    async function fetchUserTrees() {
      try {
        setLoading(true);
        // Query by user's email or name if authenticated, otherwise fetch latest general instances
        const searchQuery = user?.email || user?.name || "";
        const res = await treeInstanceService.getAll({
          search: searchQuery,
          limit: 50,
        });

        // Also check if any trees were adopted during this session in local storage
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
          const apiItems = res.data?.items || [];
          if (apiItems.length > 0) {
            const apiIds = new Set(apiItems.map((i) => i.id));
            setTrees([...storedBuyerTrees.filter((s) => !apiIds.has(s.id)), ...apiItems]);
          } else if (storedBuyerTrees.length > 0) {
            setTrees(storedBuyerTrees);
          } else {
            // If user has no specific trees, fetch general trees so dashboard displays real database trees
            const generalRes = await treeInstanceService.getAll({ limit: 10 });
            if (isMounted) {
              setTrees(generalRes.data?.items || []);
            }
          }
        }
      } catch (err) {
        console.warn("Could not load trees from database:", err);
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
        if (isMounted) setTrees(storedBuyerTrees);
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
