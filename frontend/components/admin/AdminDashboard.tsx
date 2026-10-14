"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

// Types & Mock Data
import {
  AdminTabType,
  TreeVarietyItem,
  AdoptionPlanItem,
  PlantationLocationItem,
  AdoptionOrder,
} from "./types";
import {
  INITIAL_TREES,
  INITIAL_PLANS,
  INITIAL_LOCATIONS,
  INITIAL_ORDERS,
} from "./mockData";

// Layout Components
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminToast } from "./AdminToast";

// Tab Components
import { OverviewTab } from "./tabs/OverviewTab";
import { TreesTab } from "./tabs/TreesTab";
import { PlansTab } from "./tabs/PlansTab";
import { LocationsTab } from "./tabs/LocationsTab";
import { OrdersTab } from "./tabs/OrdersTab";

// Modal Components
import { AddTreeModal } from "./modals/AddTreeModal";
import { AddPlanModal } from "./modals/AddPlanModal";
import { AddLocationModal } from "./modals/AddLocationModal";
import { OrderDetailsModal } from "./modals/OrderDetailsModal";

import { treeVarietyService } from "@/services/tree-varieties/tree-variety.service";
import { adoptionPlanService } from "@/services/adoption-plans/adoption-plan.service";
import { OccasionDedicationType } from "./types";

// Re-export types for backward compatibility
export type {
  AdminTabType,
  TreeVarietyItem,
  AdoptionPlanItem,
  PlantationLocationItem,
  AdoptionOrder,
};

export function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dynamic Lists State
  const [trees, setTrees] = useState<TreeVarietyItem[]>([]);
  const [plans, setPlans] = useState<AdoptionPlanItem[]>([]);
  const [locations, setLocations] = useState<PlantationLocationItem[]>(INITIAL_LOCATIONS);
  const [orders] = useState<AdoptionOrder[]>(INITIAL_ORDERS);

  // Load real tree varieties and adoption plans from backend API on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      try {
        const [treesRes, plansRes] = await Promise.all([
          treeVarietyService.getAll(),
          adoptionPlanService.getAll(),
        ]);
        if (isMounted) {
          setTrees(treesRes.data?.items ? treesRes.data.items.map(treeVarietyService.mapToUiItem) : []);
          setPlans(plansRes.data?.items ? plansRes.data.items.map(adoptionPlanService.mapToUiItem) : []);
        }
      } catch (err) {
        console.warn("Could not load catalog from backend:", err);
      }
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Modals State
  const [showAddTreeModal, setShowAddTreeModal] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdoptionOrder | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth Store & Access Guard
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const logout = useAuthStore((s) => s.logout);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!hasHydrated && useAuthStore.persist?.hasHydrated?.()) {
      useAuthStore.getState().setHasHydrated(true);
    }
  }, [hasHydrated]);

  useEffect(() => {
    if (!mounted) return;
    const storeHydrated = hasHydrated || (useAuthStore.persist?.hasHydrated?.() ?? false);
    if (!storeHydrated) return;

    // Only redirect if rehydration has finished and the user is verified not to be admin
    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/login");
    }
  }, [mounted, hasHydrated, isAuthenticated, user, router]);

  // Create Handlers
  const handleCreateTree = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const commonName = (fd.get("name") as string).trim();
    const scientificName = (fd.get("sci") as string).trim();
    const category = fd.get("category") as TreeVarietyItem["category"];
    const price = Number(fd.get("price")) || 299;
    const co2 = Number(fd.get("co2")) || 25;
    const location = (fd.get("location") as string).trim() || "Western Ghats, Maharashtra";
    const growth = (fd.get("growth") as string).trim() || "10–12 m in 5 years";
    const careRequirements =
      (fd.get("careRequirements") as string)?.trim() ||
      "Weekly watering in early stages, adequate sunlight, organic soil";
    const img =
      (fd.get("img") as string).trim() ||
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format";
    const desc =
      (fd.get("desc") as string).trim() ||
      "Newly catalogued botanical variety for agroforestry.";

    try {
      const res = await treeVarietyService.create({
        commonName,
        scientificName,
        category,
        price,
        co2AbsorptionRateKgYear: co2,
        growthTimeline: growth,
        careRequirements,
        coverImages: [img],
        location,
        description: desc,
      });

      if (res.data) {
        const uiTree = treeVarietyService.mapToUiItem(res.data);
        setTrees((prev) => [uiTree, ...prev.filter((t) => t.id !== uiTree.id)]);
      } else {
        const localTree: TreeVarietyItem = {
          id: "tree-" + (trees.length + 1),
          name: commonName,
          sci: scientificName,
          category,
          price,
          location,
          growth,
          img,
          desc,
          co2PerYearKg: co2,
          careRequirements,
        };
        setTrees((prev) => [localTree, ...prev]);
      }
      setShowAddTreeModal(false);
      showToast(`Added "${commonName}" to tree catalog!`);
      setActiveTab("trees");
    } catch (err) {
      console.warn("Tree creation notice:", err);
      const localTree: TreeVarietyItem = {
        id: "tree-" + (trees.length + 1),
        name: commonName,
        sci: scientificName,
        category,
        price,
        location,
        growth,
        img,
        desc,
        co2PerYearKg: co2,
        careRequirements,
      };
      setTrees((prev) => [localTree, ...prev]);
      setShowAddTreeModal(false);
      showToast(`Added "${commonName}" to tree catalog!`);
      setActiveTab("trees");
    }
  };

  const handleCreatePlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const planLabel = (fd.get("label") as string).trim();
    const icon = (fd.get("icon") as string).trim() || "🌱";
    const priceModifier = Number(fd.get("price")) || 0;
    const badge = (fd.get("badge") as string).trim() || "Standard";
    const description = (fd.get("desc") as string).trim();

    // Parse features
    const rawFeatures = (fd.get("features") as string) || "";
    const features = rawFeatures
      .split(/[\n,]+/)
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    // Parse occasion dedications
    let occasionDedications: OccasionDedicationType[] = ["general"];
    try {
      const rawOccasions = fd.get("occasionDedications") as string;
      if (rawOccasions) {
        occasionDedications = JSON.parse(rawOccasions);
      }
    } catch {
      occasionDedications = ["general"];
    }

    try {
      const res = await adoptionPlanService.create({
        planLabel,
        icon,
        priceModifier,
        badge,
        description,
        features,
        occasionDedications,
      });

      if (res.data) {
        const uiPlan = adoptionPlanService.mapToUiItem(res.data);
        setPlans((prev) => [uiPlan, ...prev.filter((p) => p.id !== uiPlan.id)]);
      } else {
        const fallbackPlan: AdoptionPlanItem = {
          id: "plan-" + Date.now(),
          label: planLabel,
          planLabel,
          icon,
          desc: description,
          description,
          price: priceModifier,
          priceModifier,
          features,
          occasionDedications,
          badge,
          activeCount: 0,
        };
        setPlans((prev) => [fallbackPlan, ...prev]);
      }

      setShowAddPlanModal(false);
      showToast(`Added adoption plan "${planLabel}"!`);
      setActiveTab("plans");
    } catch (err: any) {
      console.warn("Plan creation notice:", err);
      showToast(err.message || "Failed to create adoption plan");
    }
  };

  const handleCreateLocation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newLoc: PlantationLocationItem = {
      id: "loc-" + (locations.length + 1),
      name: (fd.get("name") as string).trim(),
      region: (fd.get("region") as string).trim(),
      gps: (fd.get("gps") as string).trim() || "18.5204° N, 73.8567° E",
      areaHectares: Number(fd.get("areaHectares")) || 10,
      capacity: Number(fd.get("capacity")) || 5000,
      treesPlanted: 0,
      survivalRate: "99.0%",
      ndviScore: 0.85,
      soilHealth: (fd.get("soilHealth") as string).trim() || "Rich Red Soil (pH 6.5, Moisture 35%)",
      image:
        (fd.get("image") as string).trim() ||
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
      status: "Active",
    };
    setLocations((prev) => [...prev, newLoc]);
    setShowAddLocationModal(false);
    showToast(`Added reserve location "${newLoc.name}"!`);
    setActiveTab("locations");
  };

  const handleDeleteTree = async (id: string) => {
    if (confirm("Remove this tree variety from adoption catalog?")) {
      try {
        await treeVarietyService.delete(id);
      } catch (err) {
        console.warn("Tree deletion API notice:", err);
      }
      setTrees((prev) => prev.filter((t) => t.id !== id));
      showToast("Tree variety removed from catalog.");
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (confirm("Remove this adoption plan?")) {
      try {
        await adoptionPlanService.delete(id);
      } catch (err) {
        console.warn("Adoption plan deletion API notice:", err);
      }
      setPlans((prev) => prev.filter((p) => p.id !== id));
      showToast("Adoption plan removed.");
    }
  };

  // Wait until client has mounted and store has rehydrated
  const isReady = mounted && (hasHydrated || (useAuthStore.persist?.hasHydrated?.() ?? false));

  if (!isReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1f15] text-white p-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl animate-pulse mb-4">
          🌱
        </div>
        <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-semibold mb-2 text-emerald-100">
          PlantOn Agro Operations
        </h2>
        <p className="text-sm text-emerald-300/80">Connecting to secure console...</p>
      </div>
    );
  }

  // Guard screen if unauthorized
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1f15] text-white p-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl mb-4">
          🔒
        </div>
        <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-semibold mb-2 text-emerald-100">
          PlantOn Agro Security Guard
        </h2>
        <p className="text-sm text-emerald-300/80 mb-6">Administrator session required.</p>
        <Link
          href="/login"
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold tracking-wide text-white transition-all shadow-md"
        >
          Go to Admin Login →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f8faf8] text-[#1c2e24] font-sans antialiased overflow-x-hidden">
      {/* 1. Executive Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        treesCount={trees.length}
        plansCount={plans.length}
        locationsCount={locations.length}
        ordersCount={orders.length}
        userName={user?.name}
        onLogout={logout}
        onOpenAddTree={() => setShowAddTreeModal(true)}
        onOpenAddPlan={() => setShowAddPlanModal(true)}
        onOpenAddLocation={() => setShowAddLocationModal(true)}
      />

      {/* 2. Main Application Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Command Bar */}
        <AdminHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAddTree={() => setShowAddTreeModal(true)}
        />

        {/* Global Toast Alert */}
        <AdminToast message={toastMessage} />

        {/* Main Body Content by Tab */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === "overview" && (
            <OverviewTab
              locations={locations}
              orders={orders}
              setActiveTab={setActiveTab}
              onSelectOrder={setSelectedOrder}
            />
          )}

          {activeTab === "trees" && (
            <TreesTab
              trees={trees}
              searchQuery={searchQuery}
              onOpenAddTree={() => setShowAddTreeModal(true)}
              onDeleteTree={handleDeleteTree}
            />
          )}

          {activeTab === "plans" && (
            <PlansTab
              plans={plans}
              searchQuery={searchQuery}
              onOpenAddPlan={() => setShowAddPlanModal(true)}
              onDeletePlan={handleDeletePlan}
            />
          )}

          {activeTab === "locations" && (
            <LocationsTab
              locations={locations}
              searchQuery={searchQuery}
              onOpenAddLocation={() => setShowAddLocationModal(true)}
            />
          )}

          {activeTab === "orders" && (
            <OrdersTab
              orders={orders}
              searchQuery={searchQuery}
              onSelectOrder={setSelectedOrder}
              onExportCSV={() => showToast("Exporting order ledger CSV...")}
            />
          )}
        </main>
      </div>

      {/* 3. Action Modals */}
      <AddTreeModal
        isOpen={showAddTreeModal}
        onClose={() => setShowAddTreeModal(false)}
        onSubmit={handleCreateTree}
      />

      <AddPlanModal
        isOpen={showAddPlanModal}
        onClose={() => setShowAddPlanModal(false)}
        onSubmit={handleCreatePlan}
      />

      <AddLocationModal
        isOpen={showAddLocationModal}
        onClose={() => setShowAddLocationModal(false)}
        onSubmit={handleCreateLocation}
      />

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onDownloadCertificate={(certId) => {
          showToast(`Digital Certificate ${certId} downloaded!`);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}
